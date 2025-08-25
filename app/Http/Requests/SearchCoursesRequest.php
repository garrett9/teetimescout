<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SearchCoursesRequest extends FormRequest
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
            'sort_field'     => [Rule::in(['course_id', 'name', 'state'])],
            'sort_direction' => [Rule::in(['asc', 'desc'])],
            'page'           => 'integer',
            'page_size'      => ['integer', Rule::in([10, 25, 50, 100])],
            'search'         => ['nullable', 'string'],
            'city'           => ['nullable', 'string'],
            'state'          => ['nullable', 'string'],
            'name'           => ['nullable', 'string'],
            'course_id'      => ['nullable', 'string'],
            'is_simulator'   => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<int,mixed>
     */
    public function validationData(): array
    {
        return array_merge($this->query->all(), $this->all());
    }
}
