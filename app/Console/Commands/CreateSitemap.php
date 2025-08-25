<?php

namespace App\Console\Commands;

use App\Models\Course;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class CreateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-sitemap';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Generates the application's sitemap.xml file.";

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $sitemap = Sitemap::create()
            ->add(Url::create('/')->setPriority(1)->setChangeFrequency('daily'))
            ->add(Url::create('/courses')->setPriority(0.9)->setChangeFrequency('daily'))
            ->add(Url::create('/contact')->setPriority(0.8)->setChangeFrequency('monthly'))
            ->add(Url::create('/request-course')->setPriority(0.8)->setChangeFrequency('monthly'));

        Course::chunkById(1000, function (Collection $courses) use ($sitemap) {
            $courses->each(function (Course $course) use ($sitemap) {
                $sitemap->add(Url::create("/courses/{$course->slug}")->setPriority(0.9)->setChangeFrequency('daily'));
            });
        });

        $sitemap->writeToFile(public_path('sitemap.xml'));

        return self::SUCCESS;
    }
}
