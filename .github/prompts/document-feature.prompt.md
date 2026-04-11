---
name: "Document Feature"
description: "Creates or updates a feature documentation file. Pass the path to a features/*.md file and optionally a summary of the feature."
agent: "agent"
argument-hint: "Path to features doc (e.g. features/Auth/login.md) and/or a short description of the feature to document"
tools: [read, write, search, execute]
---

# Document Feature

You are a technical writer creating or updating a feature documentation file for the predictions-webapp. The docs are read by both humans and AI agents, so they must be precise, structured, and complete.

## Step 1 — Identify the Target File

From the user's input, extract:
1. **File path** — a path like `features/<Area>/<feature-name>.md`. If none is given, infer a sensible kebab-case name from the feature description and place it in the most appropriate `features/` subdirectory.
2. **Summary text** — any descriptive text the user provided about the feature.

## Step 2 — Gather Context

Before writing anything, collect context from the codebase. Run searches relevant to the feature:

- Find the main controller(s) and route(s) involved
- Find the relevant model(s), policy/policies, and form requests
- Find the relevant frontend pages/components (in `resources/js/`)
- Find related tests (in `tests/Feature/` and `tests/Unit/`)
- Find any jobs, events, listeners, or observers involved
- Check if a policy exists and identify the roles/permissions used

Use `grep_search`, `file_search`, and `read_file` to read key files. Aim to understand the full feature, not just one layer.

## Step 3 — Determine Mode

Check whether the target file already exists using `read_file`:

- **File exists** → read the current content, then UPDATE it — preserve any sections not affected by new information, and update/extend sections that are outdated or incomplete.
- **File does not exist** → CREATE it from scratch using the full template below.

## Step 4 — Write the Document

Produce the feature doc using this structure. Omit sections that genuinely do not apply (e.g. no background needed for trivial features, no jobs section if none exist) — do not leave sections empty.

---

```markdown
# Feature: <Human-readable feature name>

## Summary

<2–4 sentence plain-English summary of what the feature does, why it exists, and who it affects. Written for a developer or agent reading this cold.>

---

## Background & Problem

<Optional. Only include if the feature solves a non-obvious problem or has important context. Explain the pain point or requirement that drove the feature.>

---

## Requirements

### Functional

| # | Requirement |
|---|---|
| F1 | <Requirement> |
| F2 | <Requirement> |

### Business Rules

<Optional. List any data validation rules, constraints, or invariants that must always hold. E.g. "A member may only have one answer per question per season.">

---

## Permissions

| Role | Action | Allowed |
|------|--------|---------|
| super-admin | <action> | ✅ |
| host | <action> | ✅ |
| player | <action> | ❌ |

<Explain any non-obvious permission logic, e.g. ownership checks, policy conditions, or gates.>

---

## User Experience

### <Role (e.g. Host, Member)>
- <What this role sees/does in the UI>

---

## Technical Design

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ControllerName` | `app/Http/Controllers/...` | <Purpose> |
| `ModelName` | `app/Models/...` | <Purpose> |
| `PolicyName` | `app/Policies/...` | <Purpose> |
| `PageName` | `resources/js/pages/...` | <Purpose> |

### Routes

| Method | URI | Controller | Auth |
|--------|-----|------------|------|
| GET | `/path` | `Controller@method` | Role |

### Data Flow

<Describe the sequence of events when the feature is triggered. Use a numbered list or ASCII diagram if helpful.>

### API / Resource Shape

<Optional. If the feature exposes data to the frontend via an Inertia prop or JSON API, document the shape here.>

---

## Out of Scope

- <Thing that is explicitly NOT supported or intentionally deferred>

---

## Testing

- **<TestFile>** (`tests/Feature/...`) — <what it covers>

---

## Configuration

<Optional. Any .env keys, config values, or external services needed.>
```

---

## Step 5 — Write the File

Write the completed document to the target path using the `write` tool. If the file already existed, produce the full updated file (not a diff).

After writing, confirm the file path and briefly summarise what was added or changed.
