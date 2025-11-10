<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>{{ $documentationTitle ?? 'API Docs' }}</title>

  {{-- Use CDN so assets always load over HTTPS --}}
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *::before, *::after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
  </style>
</head>
<body @if(config('l5-swagger.defaults.ui.display.dark_mode')) id="dark-mode" @endif>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      const urls = [];
      @foreach($urlsToDocs as $title => $url)
        urls.push({ name: "{{ $title }}", url: "{{ $url }}" });
      @endforeach

      const ui = SwaggerUIBundle({
        dom_id: '#swagger-ui',
        urls: urls,
        "urls.primaryName": "{{ $documentationTitle ?? 'API' }}",
        deepLinking: true,
        presets: [ SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset ],
        layout: "StandaloneLayout",
        requestInterceptor: function (req) {
          // keep CSRF for Laravel sessions if needed
          req.headers['X-CSRF-TOKEN'] = '{{ csrf_token() }}';
          return req;
        },
      });

      window.ui = ui;
    };
  </script>
</body>
</html>
