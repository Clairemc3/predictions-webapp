<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\UseCheapestModel;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;#[Provider(Lab::Gemini)]
#[UseCheapestModel]
#[MaxTokens(50)]
class ShortTitleGenerator implements Agent
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        $examples = [
            'Top goalscorer' => 'Top G/S',
            'First manager sacked' => '1st Manager sacked'
        ];

        $exampleText = collect($examples)
            ->map(fn ($short, $full) => "\"{$full}\" → \"{$short}\"")
            ->join(', ');

        return 'Generate a short title for a predictions game question. '
            .'Rules: minimum 4 words, each word maximum 7 characters, abbreviate longer words where needed. '
            .'Return only the short title text — no punctuation, no surrounding quotes, no explanation. '
            ."Examples: {$exampleText}.";
    }
}
