<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CategoryEntitiesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Validate that the parameter values are entity values, not category names
            'country' => 'sometimes|string|exists:entities,value',
            'football-league' => 'sometimes|string|exists:entities,value',
            'team' => 'sometimes|string|exists:entities,value',
            'count' => 'sometimes|string|in:football-team,football-league,country',
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $categories = $this->all();
                unset($categories['count']);
                foreach ($categories as $key => $value) {
                    // Check if the parameter key exists as a category name in the database
                    if (!$this->isValidCategoryName($key)) {
                        $validator->errors()->add($key, "The {$key} parameter is not a valid category name.");
                    }
                }
            }
        ];
    }

    /**
     * Check if a given key is a valid category name (category names should be cached)
     */
    private function isValidCategoryName(string $categoryName): bool
    {
        $allowedCategories = ['country', 'football-league'];
        if (!in_array($categoryName, $allowedCategories)) {
            return false;
        }
        return true;
    }


    public function validatedFilters(): array
    {
        $data = $this->validated();
        unset($data['count']);
        return $data;
    }
}
