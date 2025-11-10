<?php

use Illuminate\Support\Facades\Route;

Route::get('/api/documentation', function () {
    return view('l5-swagger::index', [
        'documentation'      => 'default',
        'documentationTitle' => config('l5-swagger.documentations.default.api.title', 'API Docs'),
        'urlsToDocs'         => [
            config('l5-swagger.documentations.default.api.title', 'API Docs')
                => route('l5-swagger.default.docs', [], false),
        ],
        'useAbsolutePath'    => false,
    ]);
});

