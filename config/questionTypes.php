<?php

use App\Enums\ApplicationContext;
use App\Enums\QuestionType;
use App\Enums\ScoringTypes;

// Will be moved to db once there is a UI to manage

return [
    // Generic base types
    'base' => [
        QuestionType::Ranking->value => [
            'label' => 'Ranking',
            'helper_text' => 'Generic ranking of entities in a defined order.',
        ],
        QuestionType::EntitySelection->value => [
            'label' => 'Entity Selection',
            'helper_text' => 'Select one or more entities from a category.',
        ],
    ],

    // Specialized question types built on top of base types
    ApplicationContext::UKFootball->value => [
        'standings' => [
            'base' => QuestionType::Ranking,
            'answer_category' => 'football-team',
            'label' => 'Standings',
            'short_description' => 'Members should predict the final order of teams in a league.',
            'description' => 'Members predict the standings of teams in a league and are awarded 1 or 2 points for correct predictions.',
            // The selections defines which drop downs the user will see and whether
            // they have any pre-set filters applied to them.
            'answer_category_filters' => [
                [
                    'name' => 'football-league',
                    'label' => 'Select a UK league',
                    'filters' => ['country' => 'England']
                ]
            ],
            'answer_count_label' => 'Number of team positions to predict',
            'answer_count_helper_text' => 'The position of how many teams should be predicted?',
            'scoring_types' => [
               [
                'value' => ScoringTypes::PositionWithProximity->value,
                'label' => 'Position with Proximity',
                'description' => 'Points for correct positions and near misses',
                ],
            ],
        ],
        'managers' => [
            'base' => QuestionType::EntitySelection,
            'answer_category' => 'manager',
            'label' => 'Managers (not yet set up)',
            'short_description' => 'Use this when members should select one or more managers.',
            'description' => 'Members select one manager from a list of available managers.',
            'answer_category_filters' => [
                [
                    'name' => 'football-league',
                    'label' => 'Select a League',
                    'description' => 'Select the league the manager should work within',
                    'filters' => []
                ],
            ],
        ],
        'players' => [
            'base' => QuestionType::EntitySelection,
            'answer_category' => 'player',
            'label' => 'Players (not yet set up)',
            'short_description' => 'Use this when members should select one or more players.',
            'description' => 'Members select one player from a list of available players.',
            'answer_category_filters' => [
                [
                    'name' => 'football-league',
                    'label' => 'Select a League',
                    'description' => 'Select the league the player should work within',
                    'filters' => []
                ],
            ],
        ],
    ],
];