<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        {{-- Telegram Mini App: учитываем безопасную зону под плавающей шапкой
             Telegram (кнопки закрытия/меню), чтобы контент не прижимался к верху.
             В обычном браузере скрипт ничего не меняет (--app-top-inset остаётся
             равным env(safe-area-inset-top) из app.css). --}}
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <script>
            (function () {
                var tg = window.Telegram && window.Telegram.WebApp;

                if (!tg || !tg.platform || tg.platform === 'unknown') {
                    return;
                }

                try { tg.ready(); } catch (e) {}
                try { tg.expand(); } catch (e) {}

                var root = document.documentElement;
                root.classList.add('tg-mini-app');

                function applyInsets() {
                    var safe = tg.safeAreaInset || {};
                    var content = tg.contentSafeAreaInset || {};
                    var top = (Number(safe.top) || 0) + (Number(content.top) || 0);
                    var bottom = (Number(safe.bottom) || 0) + (Number(content.bottom) || 0);
                    root.style.setProperty('--app-top-inset', top + 'px');
                    root.style.setProperty('--app-bottom-inset', bottom + 'px');
                }

                applyInsets();

                ['safeAreaChanged', 'contentSafeAreaChanged', 'viewportChanged'].forEach(function (evt) {
                    try { tg.onEvent(evt, applyInsets); } catch (e) {}
                });
            })();
        </script>

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'NHC') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
