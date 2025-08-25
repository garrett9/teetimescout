<?php

namespace App\Console\Commands;

use App\Enums\CountryCode;
use App\Enums\TeeTimeService;
use App\Enums\USState;
use App\Models\Course;
use App\Services\TeeTimeRequestors\GolfNowRequestor;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Spatie\GoogleTimeZone\GoogleTimeZone;

class IngestGolfNowCourses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:ingest-golf-now-courses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ingests and creates internal course records from GolfNow for the US.';

    /**
     * Execute the console command.
     */
    public function handle(GoogleTimeZone $googleTimeZone): int
    {
        $currentDate = Carbon::now('America/Los_Angeles')->startOfDay();

        $configs = [
            [
                // Western US
                'display'   => 'Western US',
                'latitude'  => 39.7387389892915,
                'longitude' => -104.9931406834999,
                'radius'    => 1200,
            ],
            [
                // South East US
                'display'   => 'Southern US',
                'latitude'  => 36.16095307287538,
                'longitude' => -86.7818126631909,
                'radius'    => 800,
            ],
            [
                // North East US
                'display'   => 'North East US',
                'latitude'  => 43.045108671476605,
                'longitude' => -75.99436790798941,
                'radius'    => 600,
            ],
            [
                // Alaska

                'display'   => 'Alaska US',
                'latitude'  => 65.90043047940492,
                'longitude' => -152.08541038949542,
                'radius'    => 900,
            ],
            [
                // Hawaii
                'display'   => 'Hawaii US',
                'latitude'  => 21.123103431205614,
                'longitude' => -157.24836210990972,
                'radius'    => 300,
            ],
        ];
        foreach ($configs as $config) {
            $this->newLine();
            $this->info("Processing {$config['display']}");
            $facilities = Http::post(GolfNowRequestor::URL, [
                'BestDealsOnly'             => false,
                'CurrentClientDate'         => $currentDate->toISOString(),
                'Date'                      => $currentDate->addDay()->format('M d Y'),
                'ExcludeFeaturedFacilities' => true,
                'FacilityID'                => null,
                'FacilityType'              => 0,
                'HotDealsOnly'              => false,
                'Latitude'                  => $config['latitude'],
                'Longitude'                 => $config['longitude'],
                'PageNumber'                => 0,
                'PageSize'                  => 5000,
                'Radius'                    => $config['radius'],
                'SearchType'                => 4,
                'PromotedCampaignsOnly'     => false,
                'SortBy'                    => 'Facilities.Name',
                'SortByRollup'              => 'Facilities.Name',
                'SortDirection'             => 0,
                'View'                      => 'Course',
            ])->json('ttResults.facilities');
            $bar = $this->output->createProgressBar(count($facilities));

            foreach ($facilities as $facility) {
                if ($facility['isPrivate'] || $facility['address']['country'] !== CountryCode::US->value) {
                    $bar->advance();

                    continue;
                }

                $course = Course::whereCourseId($facility['id'])
                    ->whereTeeTimeService(TeeTimeService::GOLF_NOW)
                    ->first();

                if ($course) {
                    $bar->advance();

                    continue;
                }

                $timezoneInfo = $googleTimeZone->getTimeZoneForCoordinates($facility['latitude'], $facility['longitude']);
                if (! $timezoneInfo || ! array_key_exists('timeZoneId', $timezoneInfo)) {
                    $this->newLine();
                    $this->error('Unable to find timezone for '.html_entity_decode($facility['name']));
                    $bar->advance();

                    continue;
                }

                $course = new Course;
                $course->timezone = $timezoneInfo['timeZoneId'];
                $course->course_id = $facility['id'];
                $course->name = html_entity_decode($facility['name']);
                $course->city = $facility['address']['city'];
                $course->state = $facility['address']['stateProvinceCode'] === 'DC' ? USState::MD : $facility['address']['stateProvinceCode'];
                $course->location = new Point($facility['latitude'], $facility['longitude']);
                $course->is_simulator = $facility['isSimulator'];
                $course->tee_time_service = TeeTimeService::GOLF_NOW;
                $course->save();
                $bar->advance();
            }
        }

        $this->info('Done!');

        return self::SUCCESS;
    }
}
