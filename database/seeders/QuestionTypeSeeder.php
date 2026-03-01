<?php

namespace Database\Seeders;

use App\Enums\ApplicationContext;
use App\Enums\QuestionType as QuestionTypeEnum;
use App\Enums\ScoringTypes;
use App\Models\Category;
use App\Models\QuestionType;
use App\Models\QuestionTypeAnswerFilter;
use App\Models\QuestionTypeScoringType;
use Illuminate\Database\Seeder;

class QuestionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $config = config('questionTypes');
        $context = ApplicationContext::UKFootball->value;

        if (!isset($config[$context])) {
            return;
        }

        $displayOrder = 0;

        foreach ($config[$context] as $key => $typeData) {
            $displayOrder++;

            // Resolve answer category ID if provided
            $answerCategoryId = null;
            if (isset($typeData['answer_category'])) {
                $category = Category::where('name', $typeData['answer_category'])->first();
                $answerCategoryId = $category?->id;
            }

            // Create the main question type
            $questionType = QuestionType::create([
                'application_context' => $context,
                'key' => $key,
                'base_type' => $typeData['base']->value,
                'label' => $typeData['label'],
                'short_description' => $typeData['short_description'],
                'description' => $typeData['description'],
                'answer_category_id' => $answerCategoryId,
                'answer_count_label' => $typeData['answer_count_label'] ?? null,
                'answer_count_helper_text' => $typeData['answer_count_helper_text'] ?? null,
                'is_active' => true,
                'display_order' => $displayOrder,
            ]);

            // Create answer category filters
            if (isset($typeData['answer_category_filters']) && is_array($typeData['answer_category_filters'])) {
                $filterOrder = 0;
                foreach ($typeData['answer_category_filters'] as $filter) {
                    $filterOrder++;
                    $filterCategory = Category::where('name', $filter['name'])->first();
                    
                    if ($filterCategory) {
                        QuestionTypeAnswerFilter::create([
                            'question_type_id' => $questionType->id,
                            'category_id' => $filterCategory->id,
                            'label' => $filter['label'],
                            'description' => $filter['description'] ?? null,
                            'filters' => $filter['filters'] ?? [],
                            'display_order' => $filterOrder,
                        ]);
                    }
                }
            }

            // Create scoring types
            if (isset($typeData['scoring_types']) && is_array($typeData['scoring_types'])) {
                $scoringOrder = 0;
                foreach ($typeData['scoring_types'] as $scoringType) {
                    $scoringOrder++;
                    QuestionTypeScoringType::create([
                        'question_type_id' => $questionType->id,
                        'value' => $scoringType['value'],
                        'label' => $scoringType['label'],
                        'description' => $scoringType['description'] ?? null,
                        'display_order' => $scoringOrder,
                    ]);
                }
            }
        }
    }
}
