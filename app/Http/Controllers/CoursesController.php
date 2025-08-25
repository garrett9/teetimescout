<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\View\View;

class CoursesController extends Controller
{
    public function show(Course $course): View
    {
        return view('app', [
            'title'       => "$course->name Tee Times",
            'description' => "Discover the best tee time at $course->name and nearby courses.",
        ]);
    }
}
