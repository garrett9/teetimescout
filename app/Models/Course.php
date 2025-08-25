<?php

namespace App\Models;

use App\Enums\CountryCode;
use App\Enums\TeeTimeService;
use App\Enums\USState;
use Illuminate\Database\Eloquent\Casts\Attribute;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property string $course_id
 * @property string $name
 * @property string $slug
 * @property string $city
 * @property \App\Enums\USState $state
 * @property \App\Enums\CountryCode $country
 * @property \MatanYadaev\EloquentSpatial\Objects\Point $location
 * @property \App\Enums\TeeTimeService $tee_time_service
 * @property string $timezone
 * @property int $is_simulator
 * @property array<array-key, mixed>|null $meta
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course orderByDistance(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn, string $direction = 'asc')
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course orderByDistanceSphere(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn, string $direction = 'asc')
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereContains(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereCrosses(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereDisjoint(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereDistance(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn, string $operator, int|float $value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereDistanceSphere(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn, string $operator, int|float $value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereEquals(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereIntersects(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereIsSimulator($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereMeta($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereNotContains(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereNotWithin(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereOverlaps(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereSrid(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, string $operator, int|float $value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereState($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereTeeTimeService($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereTimezone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereTouches(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course whereWithin(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course withCentroid(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, string $alias = 'centroid')
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course withDistance(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn, string $alias = 'distance')
 * @method static \Illuminate\Database\Eloquent\Builder<static>|\App\Models\Course withDistanceSphere(\Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $column, \Illuminate\Contracts\Database\Query\Expression|\MatanYadaev\EloquentSpatial\Objects\Geometry|string $geometryOrColumn, string $alias = 'distance')
 *
 * @mixin \Eloquent
 */
class Course extends AbstractModel
{
    use HasSlug;
    use HasSpatial;

    protected $casts = [
        'tee_time_service' => TeeTimeService::class,
        'location'         => Point::class,
        'state'            => USState::class,
        'country'          => CountryCode::class,
        'meta'             => 'array',
    ];

    protected $fillable = [
        'course_id',
        'city',
        'state',
        'name',
        'timezone',
        'tee_time_service',
        'meta',
    ];

    protected $attributes = [
        'country' => CountryCode::US,
    ];

    /**
     * @return Attribute<Point,Point>
     */
    protected function location(): Attribute
    {
        return Attribute::make(
            get: fn (string $value): Point => Point::fromWkb($value),
            set: fn (Point $point): string => $point->toWkb(),
        );
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn () => implode(' ', [$this->name, $this->state->value, $this->country->value]))
            ->saveSlugsTo('slug');
    }

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
