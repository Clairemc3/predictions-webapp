<?php

/**
 * Scoring Types Configuration
 *
 * Note: These scoring types will eventually be moved to the database.
 */

return [
    // Exact match scoring - correct answer gets fixed points
    'exact_match' => [
        'name' => 'Exact Match',
        'short_description' => 'Right or wrong - no in between',
        'description' => 'Fixed points awarded for the correct answer. No points for incorrect answers.',
        'example' => 'First manager sacked - whoever gets it right gets the points.',
    ],

    // Position-based scoring with proximity tolerance
    'position_with_proximity' => [
        'name' => 'Position with Proximity',
        'short_description' => 'Close counts - earn points for near misses',
        'description' => 'Configurable points for exact position match and nearby positions. Set different point values for being 1, 2, or more positions off.',
        'example' => 'Arsenal finishes 3rd - Host could set: exact position (3rd) = 3 points, 1 position off (2nd or 4th) = 2 points, 2 positions off (1st or 5th) = 1 point.',
    ],

    // Comparative scoring - best guess among all members wins
    'closest_wins' => [
        'name' => 'Closest Wins',
        'short_description' => 'Best guess wins all the points',
        'description' => 'The member whose prediction is closest to the actual outcome wins the points.',
        'example' => 'Most goals scored - the member who picked the player with the most goals compared to other members\' picks wins.',
    ],
];
