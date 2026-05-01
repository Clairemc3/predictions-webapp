<?php

use App\Enums\BaseQuestionType;
use App\Enums\SeasonStatus;
use App\Models\Question;
use App\Models\Season;
use App\Models\SeasonMember;
use App\Models\User;
use Database\Seeders\PermissionSeeder;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

// ===== SHOW =====

test('member can view show predictions page for active season', function () {
    $member = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    $membership = SeasonMember::factory()->create([
        'season_id' => $season->id,
        'user_id' => $member->id,
    ]);

    $response = $this->actingAs($member)->get("/predictions/{$membership->id}");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('predictions/show'));
});

test('show page includes entity_selection questions for active season', function () {
    $member = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    $membership = SeasonMember::factory()->create([
        'season_id' => $season->id,
        'user_id' => $member->id,
    ]);

    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'title' => 'Pick the top manager',
    ]);
    $season->questions()->attach($question);

    $response = $this->actingAs($member)->get("/predictions/{$membership->id}");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('predictions/show')
        ->where('questions', fn ($grouped) => collect($grouped)
            ->flatten(1)
            ->contains(fn ($q) => $q['id'] === $question->id && $q['base_type'] === BaseQuestionType::EntitySelection->value)
        )
    );
});

test('show page includes ranking questions for active season', function () {
    $member = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    $membership = SeasonMember::factory()->create([
        'season_id' => $season->id,
        'user_id' => $member->id,
    ]);

    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::Ranking,
    ]);
    $season->questions()->attach($question);

    $response = $this->actingAs($member)->get("/predictions/{$membership->id}");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('predictions/show')
        ->where('questions', fn ($grouped) => collect($grouped)
            ->flatten(1)
            ->contains(fn ($q) => $q['id'] === $question->id && $q['base_type'] === BaseQuestionType::Ranking->value)
        )
    );
});

test('unauthenticated user cannot view show predictions page', function () {
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    $membership = SeasonMember::factory()->create(['season_id' => $season->id]);

    $response = $this->get("/predictions/{$membership->id}");

    $response->assertRedirect('/login');
});

test('non-member cannot view another members show predictions page', function () {
    $nonMember = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    $membership = SeasonMember::factory()->create(['season_id' => $season->id]);

    $response = $this->actingAs($nonMember)->get("/predictions/{$membership->id}");

    $response->assertForbidden();
});

// ===== EDIT =====

test('member can view edit predictions page for active season', function () {
    $member = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    $membership = SeasonMember::factory()->create([
        'season_id' => $season->id,
        'user_id' => $member->id,
    ]);

    $response = $this->actingAs($member)->get("/predictions/{$membership->id}/edit");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('predictions/edit'));
});

test('edit page includes entity_selection questions for active season', function () {
    $member = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    $membership = SeasonMember::factory()->create([
        'season_id' => $season->id,
        'user_id' => $member->id,
    ]);

    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'title' => 'Pick the top manager',
    ]);
    $season->questions()->attach($question);

    $response = $this->actingAs($member)->get("/predictions/{$membership->id}/edit");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('predictions/edit')
        ->where('questions', fn ($grouped) => collect($grouped)
            ->flatten(1)
            ->contains(fn ($q) => $q['id'] === $question->id && $q['base_type'] === BaseQuestionType::EntitySelection->value)
        )
    );
});

