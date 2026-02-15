<?php

namespace App\Enums;

/** Scoring types for questions
 * Eventually this context along with question type setup and other
 * configurations for the context could be moved to the database/controlled via a UI
 */
enum ScoringTypes: string
{
    case ExactMatch = 'exact_match';
    case PositionWithProximity = 'position_with_proximity';
    case ClosestWins = 'closest_wins';
}
