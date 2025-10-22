<?php

// Basic example unit test to ensure the Unit directory works correctly
it('passes a basic assertion', function () {
    expect(true)->toBeTrue();
});

it('can perform basic math', function () {
    expect(2 + 2)->toBe(4);
});

it('can work with strings', function () {
    $string = 'Hello World';
    expect($string)->toContain('World');
    expect(strlen($string))->toBe(11);
});