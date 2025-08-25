<?php

namespace App\Http\Requests;

use App\Enums\TeeTimeService;
use App\Enums\USState;
use App\Models\Course;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class CreateCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('create', Course::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'course_id'             => 'required|string',
            'name'                  => 'required|string',
            'city'                  => 'required|string',
            'state'                 => ['required', Rule::enum(USState::class)],
            'timezone'              => 'required|timezone:per_country,US',
            'latitude'              => 'required|numeric|max:90|min:-90',
            'longitude'             => 'required|numeric|min:-180|max:180',
            'tee_time_service'      => ['required', Rule::enum(TeeTimeService::class)],
            'meta.booking_class_id' => 'required_if:tee_time_service,'.TeeTimeService::FORE_UP::class,
        ];
    }
}
