<?php

use App\Enums\QuestionType;

return [

    // Generic base types
    'base' => [
        QuestionType::Ranking => [
            'label' => 'Ranking',
            'helper_text' => 'Generic ranking of entities in a defined order.',
        ],
        QuestionType::EntitySelection => [
            'label' => 'Entity Selection',
            'helper_text' => 'Select one or more entities from a category.',
        ],
    ],

    // Specialized question types built on top of base types
    'custom' => [
        'standings' => [
            'base' => QuestionType::Ranking,
            'label' => 'Standings',
            'setup_description_short' => 'Players should predict the final order of teams in a league.',
            'setup_description' => 'Players predict the standings of teams in a league and are awarded 1 or 2 points for correct predictions.',
            // The selections defines which drop downs the user will see and whether 
            // they have any pre-set filters applied to them.
            'selections' => [
                'name' => ['league'],
                'labels' => 'Select a UK league',
                'filters' => ['country' => 'United Kingdom']
            ],
        ],
        'managers' => [
            'base' => QuestionType::EntitySelection,
            'category' => 'manager',
            'label' => 'Managers',
            'setup_description_short' => 'Use this when players should select one or more managers.',
            'setup_description' => 'Players select one manager from a list of available managers.',
            'selections' => [
                [
                    'name' => ['league'],
                    'labels' => 'Select a which league the manager should work within',
                    'filters' => []
                ],
            ],
        ],
        'players' => [
            'base' => QuestionType::EntitySelection,
            'category' => 'player',
            'label' => 'Players',
            'setup_description_short' => 'Use this when players should select one or more players.',
            'setup_description' => 'Players select one players from a list of available players.',
            'selections' => [
                [
                    'name' => ['league'],
                    'labels' => 'Select a which league the player should work within',
                    'filters' => []
                ],
            ],
        ],
    ],

];