---
layout: ../../../layouts/PostLayout.astro
title: "devDiary 0.2: Tools of the Trade"
pubDate: 2025-06-20T14:14:30+12:00
description: "Start Your Engines"
author: "Will Turner"
image:
  url: "/images/posts/devDiary0/0.2/icon.png"
  alt: "Raygun"
tags: ["devlog", "devDiary0"]
draft: false
---
To get started with raycasting, I need a few things. I'll be doing everything from 'scratch', but I'm not insane.  
Really all I need is some way to draw individual pixels on the screen. For this I'll be using [SDL3.0](https://wiki.libsdl.org/SDL3/FrontPage).

<br/>

Per their website, SDL3.0 is "*a cross-platform development library designed to provide low level access to audio, keyboard, mouse, joystick, and graphics hardware*". Perfect. In the spirit of doing it myself, I'll be writing in C.

<br/>

## SDL3.0

Since my last foray into SDL, there has been a new release, 3.0. The new update introduces a new paradigm for projects.  
Instead of a `main()` function as your entry point, you can use main callbacks instead. You can read more about this [here](https://wiki.libsdl.org/SDL3/README-main-functions#main-callbacks-in-sdl3). I'll be trying this out; because why not?

<br/>

There's some boilerplate code to copy, thankfully there are some [example programs](https://examples.libsdl.org/SDL3/).  
The *points* program shows me how to draw individual pixels to the screen; here's what I'm aiming for:
<div class="flex flex-col items-center my-4">
  <img src="/images/posts/devDiary0/0.2/pixel.png" alt="Black application window with single white pixel" class="w-1/2 h-auto" />
</div>
<br/>

The render loop is located within the `SDL_AppIterate` function. Each iteration I'll clear the screen by setting my draw colour to black, calling the clear function, changing to the colour I want to draw, drawing my points, and finally calling the `SDL_RenderPresent` function to push to the screen!

<br/>

Here's what it looks like to draw a single white pixel at (x=50, y=50):

```c
SDL_AppResult SDL_AppIterate(void *appState) {
    SDL_SetRenderDrawColor(renderer, 0, 0, 0, SDL_ALPHA_OPAQUE);
    SDL_RenderClear(renderer);
    SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
    SDL_RenderPoint(renderer, 50, 50);
    SDL_RenderPresent(renderer);
    return SDL_APP_CONTINUE;
}
```
<br/>

Next up I'll get into outlining the renderer and laying down some of the foundational functions.