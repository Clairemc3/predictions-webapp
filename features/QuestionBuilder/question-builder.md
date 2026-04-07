# Feature: Question Builder

## Summary

The Question Builder allows hosts to create and edit questions for a season. A host selects from a list of available question types (configured by a super-admin), and the form adapts dynamically to present the relevant options for that type — entities to include, how many answers to collect, and how to score them. Only the host of a season can create or modify its questions, and only while the season is in **Draft** status.

---

## Background & Problem

Questions are the core unit of prediction gameplay. Each question has a `base_type` (the mechanical type — `ranking` or `entity_selection`) and a `type` (the key of the specific `QuestionType` configured by a super-admin, e.g. `standings`, `top-scorer`). The form must be dynamic because different question types require different entity filters, answer counts, and scoring configurations.

---

## Requirements

### Functional

| # | Requirement |
|---|---|
| F1 | A host can navigate to the question builder from the season management page. |
| F2 | The host selects a question type from a list of active types for the application context. |
| F3 | Once a question type is selected, a second panel renders the options specific to that type (entities, answer count, scoring type, point values, optional title). |
| F4 | Entity options are filtered according to the answer category filters defined on the question type. |
| F5 | The host sets how many answers to collect (`answer_count`). |
| F6 | The host selects a scoring type from those configured on the question type. |
| F7 | The host assigns point values per accuracy level for the chosen scoring type. |
| F8 | An optional question title can be entered; if provided, an AI short title is generated in the background (see [AI Short Title feature](a-question-short-title-is-generated-using-an-ai-agent.md)). |
| F9 | On save, the question, its entities (with category pivot data), and its point values are all persisted atomically in a database transaction. |
| F10 | A host can edit an existing question via the edit page; the form pre-populates from the question's current state. |
| F11 | A host can delete a question from the season. |

### Business Rules

- Questions can only be created, updated, or deleted when the season status is **Draft**. Any attempt on an Active or Closed season is rejected by the policy.
- Only the host of the specific season (checked via `Season::isHost()`) can manage its questions — not any user with the `host-a-season` permission globally.
- A user must hold the `host a season` permission (assigned by super-admin) to be a host at all.
- `answer_count` must be between 1 and 20. Setting "all" sends 20.
- `type` must be a valid, active `QuestionType` key for the current application context.
- `entities` must contain at least one entry on create; each entry must reference an existing `entity_id` and `category_id`.

---

## Permissions

| Role / Condition | Action | Allowed |
|---|---|---|
| Host of the season + season is Draft | Create question | ✅ |
| Host of the season + season is Draft | Update question | ✅ |
| Host of the season + season is Draft | Delete question | ✅ |
| Host of the season + season is Active | View question results | ✅ |
| Any other user | Any question mutation | ❌ |
| Host of a different season | Any action | ❌ |

Permission is enforced via `QuestionPolicy` using `Gate::authorize()` in the controller. `Season::isHost($user)` checks whether the authenticated user is recorded as the host of that season — not just whether they globally hold the `host a season` permission.

---

## User Experience

### Host
- Accesses the builder from the season management page via "Add Question".
- Sees a list of active question types as radio buttons, each with a label and short description.
- On selecting a type, a "Question Options" panel appears below with fields specific to that type.
- For **ranking** questions: entity filters, answer count, scoring type, point assignments.
- For **entity_selection** questions: entity filters, answer count, scoring type, point assignments, and an optional title field.
- On submit, the host is redirected back to the season management page.
- To edit, the host navigates to the question's edit page; all fields are pre-populated from the current question.

### Super-Admin
- Configures the `QuestionType` records that hosts see (via the admin question-type builder — separate feature). Types, entity filters, scoring types, and display order are all admin-managed.

---

## Technical Design

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `QuestionController` | `app/Http/Controllers/QuestionController.php` | Handles create/store/edit/update/destroy |
| `StoreQuestionRequest` | `app/Http/Requests/StoreQuestionRequest.php` | Validates all fields for question creation |
| `UpdateQuestionRequest` | `app/Http/Requests/UpdateQuestionRequest.php` | Validates all fields for question update |
| `QuestionPolicy` | `app/Policies/QuestionPolicy.php` | Authorises by checking `Season::isHost()` + season Draft status |
| `QuestionEntityPersistService` | `app/Services/QuestionEntityPersistService.php` | Syncs the entity pivot table for a question |
| `QuestionPointPersistService` | `app/Services/QuestionPointPersistService.php` | Syncs accuracy-level point values for a question |
| `QuestionTypeService` | `app/Services/QuestionTypeService.php` | Fetches active question types for the app context (cached) |
| `CreateQuestion` page | `resources/js/pages/seasons/questions/create.tsx` | Inertia page for question creation |
| `EditQuestion` page | `resources/js/pages/seasons/questions/edit.tsx` | Inertia page for question editing |
| `QuestionOptions` | `resources/js/components/QuestionBuilder/QuestionOptions.tsx` | Renders type-specific options panel (branches on `base_type`) |
| `Rankings` | `resources/js/components/QuestionBuilder/QuestionTypeOptions/Rankings.tsx` | Options sub-form for `ranking` base type |
| `EntitySelection` | `resources/js/components/QuestionBuilder/QuestionTypeOptions/EntitySelection.tsx` | Options sub-form for `entity_selection` base type |
| `useQuestionForm` | `resources/js/components/Season/Question/useQuestionForm.ts` | Form state hook; fetches full question type on change; exposes `submitCreate`/`submitUpdate` |
| `QuestionTypeSelector` | `resources/js/components/Season/Question/QuestionTypeSelector.tsx` | Radio group for selecting a question type |

### Routes

| Method | URI | Controller | Auth |
|--------|-----|------------|------|
| GET | `/seasons/{season}/questions/create` | `QuestionController@create` | auth + verified |
| POST | `/seasons/{season}/questions` | `QuestionController@store` | auth + verified |
| GET | `/seasons/{season}/questions/{question}/edit` | `QuestionController@edit` | auth + verified |
| PUT | `/seasons/{season}/questions/{question}` | `QuestionController@update` | auth + verified |
| DELETE | `/seasons/{season}/questions/{question}` | `QuestionController@destroy` | auth + verified |

All routes use `scopeBindings()` to ensure the `{question}` belongs to the `{season}`.

### Data Flow

**Create:**
1. Host visits `/seasons/{season}/questions/create` → `QuestionController::create` authorises via policy, fetches active question types, renders `seasons/questions/create` via Inertia.
2. Host selects a question type → `useQuestionForm::handleTypeChange` calls `/api/question-types/{key}` to fetch full config (entity filters, scoring types, etc.).
3. `QuestionOptions` renders `Rankings` or `EntitySelection` based on `selectedQuestionType.base`.
4. Host submits → `StoreQuestionRequest` validates all fields.
5. `QuestionController::store` wraps in a `DB::transaction`:
   - Creates the `Question`, setting `answer_category_id` from the resolved `QuestionType`.
   - `QuestionEntityPersistService::syncEntities` attaches entities with `category_id` pivot data.
   - `QuestionPointPersistService::sync` upserts point values per accuracy level.
6. `QuestionObserver` fires on `created` → dispatches `GenerateQuestionShortTitle` job if a title was provided.
7. Host is redirected to `seasons.manage`.

**Edit/Update:** Same flow with `UpdateQuestionRequest`. Entities and points are synced (upserted), not replaced wholesale.

### Inertia Props

**Create page (`seasons/questions/create`):**
```ts
{
  season: SeasonResource,
  questionTypes: QuestionTypeSummary[]  // id, key, label, shortDescription
}
```

**Edit page (`seasons/questions/edit`):**
```ts
{
  season: SeasonResource,
  question: Question,  // with entities (including pivot.category_id) and pointsValues eager-loaded
  questionTypes: QuestionTypeSummary[]
}
```

---

## Out of Scope

- Super-admins configure question *types* in a separate admin area — they do not use this builder.
- Members (players) have no access to the question builder.
- Questions cannot be created or modified once a season is Active or Closed.
- There is no bulk import or question duplication.
- The `short_title` field is not present in the builder — it is always AI-generated (see [AI Short Title feature](a-question-short-title-is-generated-using-an-ai-agent.md)).

---

## Testing

No dedicated controller tests exist for `QuestionController` at this time. Coverage gaps to address:

- `StoreQuestionRequest` validation rules (type validity, entity requirements, answer_count bounds)
- `QuestionController::store` happy path and auth/season-status rejection
- `QuestionController::update` with entity and point sync
- `QuestionController::destroy`
- `QuestionPolicy` — host-of-season vs host-of-other-season, Draft vs Active season
