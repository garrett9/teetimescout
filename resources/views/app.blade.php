<!DOCTYPE html>
<html lang="en">

<head>
    @production
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-88FHR43HKL"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());

            gtag('config', 'G-88FHR43HKL');
        </script>
    @endproduction

    <meta charset="UTF-8">
    @if(isset($title))
        <title>{{ $title }}</title>
    @else
        <title>Tee Time Scout | Find & Book Golf Tee Times Near You</title>
    @endif

    @if(isset($description))
        <meta name="description" content="{{ $description }}">
    @else
        <meta name="description"
            content="Find and book the best golf tee times near you with Tee Time Scout. Instantly compare local courses in one view and secure your ideal tee time today.">
    @endif
    <meta name="keywords"
        content="golf tee times, book tee times, golf courses near me, golf booking, tee time search, golf deals, golf tee time comparison">
    <meta name="author" content="Tee Time Scout">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>

<body>
    <div id="app"></div>
</body>

</html>