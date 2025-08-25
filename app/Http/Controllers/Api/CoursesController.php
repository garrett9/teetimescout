<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCourseRequest;
use App\Http\Requests\NearybyCoursesRequest;
use App\Http\Requests\SearchCoursesRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Services\Radar\RadarService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use MatanYadaev\EloquentSpatial\Objects\Point;

class CoursesController extends Controller
{
    use AuthorizesRequests;

    public function index(SearchCoursesRequest $request): AnonymousResourceCollection
    {
        $sortField = $request->input('sort_field') ?: 'name';
        $sortDirection = $request->input('sort_direction') ?: 'asc';
        $search = $request->input('search');
        $name = $request->input('name');
        $city = $request->input('city');
        $state = $request->input('state');
        $courseId = $request->input('course_id');
        $isSimulator = $request->input('is_simulator');

        $query = Course::orderBy($sortField, $sortDirection);
        if ($search) {
            $query
                ->where(function (Builder $query) use ($search) {
                    $query
                        ->whereLike('name', "{$search}%")
                        ->orWhereLike('city', "{$search}%")
                        ->orWhereLike('course_id', "{$search}%");
                });
        }

        if ($name) {
            $query->where('name', $name);
        }

        if ($city) {
            $query->where('city', $city);
        }

        if ($state) {
            $query->where('state', $state);
        }

        if ($courseId) {
            $query->where('course_id', $courseId);
        }

        if ($isSimulator !== null) {
            $query->where('is_simulator', (bool) $isSimulator);
        }

        return CourseResource::collection($query->paginate());
    }

    public function show(Course $course): CourseResource
    {
        $this->authorize('view', $course);

        return new CourseResource($course);
    }

    public function nearby(RadarService $radarService, NearybyCoursesRequest $request): JsonResponse
    {
        $travelMinutes = $request->integer('travel_minutes');
        $travelMinutes = max($travelMinutes, 15);
        $travelMinutes = min($travelMinutes, 120);

        // As an example, if we want to travel a max of 30 minutes to a location, we assume the location
        // is at least the same distance in miles (otherwise it'd have to be a straight line at 60mph).
        // We then add 10 additional miles as a buffer just in case.
        $travelDistanceInMiles = $travelMinutes + 10;
        $travelDistanceInMeters = $travelDistanceInMiles * 1609.34;

        $origin = new Point($request->latitude, $request->longitude);

        $courses = Course::whereDistanceSphere('location', $origin, '<=', $travelDistanceInMeters)
            ->whereIsSimulator(false) // Not worrying about simulator times yet
            ->get();
        $courses = $radarService->getWithinTravelMinutes($travelMinutes, $origin, $courses);

        return new JsonResponse([
            'data' => $courses,
        ]);
    }

    public function store(CreateCourseRequest $request): CourseResource
    {
        $course = new Course($request->validated());
        $course->location = new Point($request->latitude, $request->longitude);
        $course->save();

        return new CourseResource($course);
    }

    public function update(UpdateCourseRequest $request, Course $course): CourseResource
    {
        $course->fill($request->validated());
        if ($request->latitude && $request->longitude) {
            $course->location = new Point($request->latitude, $request->longitude);
        }

        $course->save();

        return new CourseResource($course);
    }

    public function delete(Course $course): JsonResponse
    {
        $this->authorize('delete', $course);

        $course->delete();

        return new JsonResponse(null, 204);
    }
}
