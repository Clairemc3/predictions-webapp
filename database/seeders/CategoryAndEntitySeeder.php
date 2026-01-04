<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryAndEntitySeeder extends Seeder
{
    private array $playersData;
    private array $managersData;
    private array $teamsData;
    private array $competitionsData;
    private array $leaguesData;
    private array $countriesData;
    private array $allEntities;

    public function __construct()
    {
        $this->competitionsData = json_decode(file_get_contents(database_path('seeders/seed-data/cups.json')), true);
        $this->playersData = json_decode(file_get_contents(database_path('seeders/seed-data/players.json')), true);
        $this->managersData = json_decode(file_get_contents(database_path('seeders/seed-data/managers.json')), true);
        $this->teamsData = json_decode(file_get_contents(database_path('seeders/seed-data/teams.json')), true);
        $this->leaguesData = json_decode(file_get_contents(database_path('seeders/seed-data/leagues.json')), true);
        $this->countriesData = json_decode(file_get_contents(database_path('seeders/seed-data/countries.json')), true);

        $this->allEntities = array_merge(
            $this->playersData, 
            $this->managersData, 
            $this->teamsData, 
            $this->competitionsData,
            $this->leaguesData,
            $this->countriesData
        );
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedCategories();
        $this->seedEntities();
        $this->seedCategoryRelationships();
        $this->seedEntityRelationships();
    }

    /**
     * Seed the categories table.
     */
    private function seedCategories(): void
    {
        $categories = [
            'football-team',
            'club-football-team',
            'national-football-team',
            'manager',
            'player',
            'football-league',
            'competition',
            'country'
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['name' => $category],
                [
                    'name' => $category,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    /**
     * Seed the entities table.
     */
    private function seedEntities(): void
    {
        foreach ($this->allEntities as $entityData) {
            // Insert the entity
            DB::table('entities')->updateOrInsert(
                ['value' => $entityData['value']],
                [
                    'value' => $entityData['value'],
                    'code' => $entityData['code'] ?? null,
                    'short_value' => $entityData['short_value'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // Add images
            if (isset($entityData['image_api_url'])) {
                $entityId = DB::table('entities')
                    ->where('value', $entityData['value'])
                    ->value('id');

                if ($entityId) {
                    DB::table('entity_images')->updateOrInsert(
                        ['entity_id' => $entityId],
                        ['third_party_url' => $entityData['image_api_url'], 'created_at' => now(), 'updated_at' => now()]
                    );
                }
            }
        }
    }

    /**
     */
    private function seedCategoryRelationships(): void
    {
        foreach ($this->allEntities as $entityData) {
            $entityId = DB::table('entities')
                ->where('value', $entityData['value'])
                ->value('id');

            // Attach the entity to its categories
            foreach ($entityData['categories'] as $category) {
                $categoryId = DB::table('categories')
                    ->where('name', $category)
                    ->value('id');

                if ($entityId && $categoryId) {
                    DB::table('category_entity')->updateOrInsert(
                        ['category_id' => $categoryId, 'entity_id' => $entityId],
                        ['created_at' => now(), 'updated_at' => now()]
                    );
                }
            }
        }
    }

    private function seedEntityRelationships(): void
    {
        foreach ($this->allEntities as $entityData) {
            $childEntityId = DB::table('entities')
                ->where('value', $entityData['value'])
                ->value('id');

            // Attach the entity to its relationships
            foreach ($entityData['entityRelationships'] ?? [] as $relationship) {
                $parentEntityId = DB::table('entities')
                    ->where('value', $relationship['entity'])
                    ->value('id');

                if ($parentEntityId && $childEntityId) {
                    DB::table('entity_relationships')->updateOrInsert(
                        ['parent_entity_id' => $parentEntityId, 'child_entity_id' => $childEntityId],
                        ['relation_type' => $relationship['relation_type'], 'created_at' => now(), 'updated_at' => now()]
                    );
                }
            }
        }
    }

}