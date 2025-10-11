<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Carme&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
    <style>
      /* Ensure proper mobile scrolling */
      html {
        height: 100%;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        touch-action: manipulation;
      }
      
      body {
        height: auto !important;
        min-height: 100%;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        touch-action: manipulation;
        position: relative;
      }
      
      /* Fix for Material-UI containers */
      .MuiContainer-root, .MuiBox-root {
        -webkit-overflow-scrolling: touch !important;
        touch-action: auto !important;
      }
      
      /* Ensure all content is scrollable on mobile */
      #app, [data-reactroot] {
        height: auto !important;
        min-height: 100vh;
        overflow: visible;
        -webkit-overflow-scrolling: touch;
      }
    </style>
  </head>
  <body>
    @inertia
  </body>
</html>