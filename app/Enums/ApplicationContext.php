<?php

namespace App\Enums;

/** Application context for the application
 * Eventually this context along with question type setup and other
 * configurations for the context could be moved to the database/controlled via a UI
 */
enum ApplicationContext: string
{
    case UKFootball = 'uk_football';
}
