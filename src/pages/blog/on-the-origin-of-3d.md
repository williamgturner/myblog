---
layout: ../../layouts/PostLayout.astro
title: "devDiary 0.1: On the Origin of 3D"
pubDate: 2025-06-20T20:14:30+12:00
description: "2D Walls to 3D Halls"
author: "Will Turner"
image:
  url: "/images/posts/devDiary0/0.1/0.1.png"
  alt: "Raygun"
tags: ["devlog", "devDiary0"]
draft: false
---
Over the course of this dev diary I'll walk through creating 3D graphics from scratch. I'll be creating a raycast renderer to draw a 3D environment with nothing but a buffer of pixels, and maths (rad right?).
<br/>
<br/>
3D graphics are so commonplace today that those of my generation take them for granted. We can create entire environments in the browser with WebGL, and photorealistic environments with recent breakthroughs in technologies such as ray tracing, and geometry systems like *Nanite.*
<br/>
<br/>
Wait, *ray tracing*? I thought this was about *raycasting?* As a matter of fact, what's the difference?
<br/>
<br/>
I can't fault you for getting confused; both techniques are very similar, and have been around for quite a while now. Both techniques involve casting rays to generate 3D environments, but ray tracing is generally more complex. Raycasting can create simple pseudo-3D (we'll get to this) environments made of walls, ceilings, and floors; while ray tracing is often used to simulate light. In raytracing, rays bounce off objects to illuminate a scene and produce shadows, highlights, and reflections. This series, however, is about raycasting.
<br/>
<br/>

## How Did We Get Here?

Tracing the origin of 3D graphics leads us to *Maze*, a game developed at MIT in 1973, that used vector graphics to simulate 3D environments. *Maze* was revolutionary for its time, but was certainly a product of the technological landscape at its inception. The player's view was restricted to the four cardinal directions, and the graphics were closer to a set of images mimicking depth than the result of live computations.

<div class="flex flex-col items-center my-4">
  <img src="/images/posts/devDiary0/0.1/MazeWar.jpg" alt="MazeWar 3D" class="w-1/2 h-auto" />
  <small class="block text-center text-sm text-gray-500">Maze (1973)</small>
</div>

It's not until *Hovertank 3D* (1991) that we find the first instance of **raycasting** in the wild. Legend John Carmack developed the game engine in six weeks, which would go on to power games *Catacomb 3-D* and the infamous *Wolfenstein 3D*.
<br/>
<br/>

## How Does it Work?
Raycasting is a technique to render 2.5D environments from 2D data. A camera is positioned at a point in a Cartesian plane, enclosed within a series of walls along grid lines. One "ray" is cast (hence the name) for each pixel column of the display. These rays extend until they hit a wall. The length of the ray is calculated, which then corresponds to the height of the wall on the screen. Walls that are further away appear smaller, creating the illusion of depth. Because our data only stores information in two axes, raycasting is not truly 3D, and commonly referred to as 2.5D

<div class="text-center my-4">
  <img alt="Hovertank 3D" src="/images/posts/devDiary0/0.1/Hovertank.jpg" class="inline-block" />
  <small class="block text-center">Hovertank 3D (1991)</small>
</div>

The advantage of the raycasting approach is efficient computations, vital back when RAM was measured in kilobytes rather than gigabytes.
<br/>
<br/>
This isn't without its drawbacks though. Raycasting works best with walls at 90-degree angles, and lacks any real ability to simulate height differences, like stairs or slopes.
<br/>
<br/>
## What's Coming
In this series of blog posts, I'll be diving in to depth on how raycasting works, and writing my own raycaster.
<br/>
<br/>
Stay tuned, or don't, I'll post anyway.