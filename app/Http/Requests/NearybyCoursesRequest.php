<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NearybyCoursesRequest extends FormRequest
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
            'travel_minutes' => 'required|integer|min:1|max:120',
            'latitude'       => 'required|numeric|min:-90|max:90',
            'longitude'      => 'required|numeric|min:-180|max:180',
        ];
    }

    /**
     * @return array<string,mixed>
     */
    public function validationData(): array
    {
        return array_merge($this->all(), $this->query());
    }
}
