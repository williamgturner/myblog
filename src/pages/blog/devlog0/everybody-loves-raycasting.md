---
layout: ../../../layouts/PostLayout.astro
title: "devDiary 0.3: Everybody Loves Raycasting"
pubDate: 2025-07-6T14:14:30+12:00
description: "2D Walls to 3D Halls"
author: "Will Turner"
image:
  url: "/images/posts/devDiary0/0.png"
  alt: "Raygun"
tags: ["devlog", "devDiary0"]
draft: false
---
To give clarity on the goal, here is raycasting summed up in one diagram:
<div class="flex flex-col items-center my-4">
  <img src="/images/posts/devDiary0/0.3/projection.png" alt="Rays extending from camera position, projecting to create a 3D environment" class="w-1/2 h-auto" />
  <small class="block text-center">The Final Goal</small>
</div>

On the top is the final 3D projection, and on the bottom is how this effect is created. You can see on the bottom the world is actually 2D; everything lives on a grid. Note how the ray that intersects the green wall is shorter than the others, and as a result, the green wall appears closer in the 3D view. The keen eyed might notice that the leftmost ray is longer than the centre ray, and therefore the blue wall should be smaller on the left! You would be absolutely correct, and the most basic raycasters do have this [fisheye](https://gamedev.stackexchange.com/questions/97574/how-can-i-fix-the-fisheye-distortion-in-my-raycast-renderer) effect; which means even when looking at a flat wall, it appears closer/larger in the middle. Thankfully, there are some crafty tricks we can employ later on to correct this.
<br/>
<br/>
One of the neat parts of raycasting is that floors and ceilings are more of an illusion than geometry. All we have to do is find the height of the walls, and fill in the the top and the bottom with any colour we desire to create the floor and ceiling surfaces.
<br/>
<br/>
Hopefully any other questions you have are cleared up as the program takes shape. Time to get our hands dirty with some code! I'll start by defining our camera and our world.
```c
#define MAP_WIDTH 20
#define MAP_HEIGHT 20
#define WORLD_SCALE 64

typedef struct {
    double x;
    double y;
    double theta;
} camera;

int8_t map[MAP_HEIGHT][MAP_WIDTH] = {
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}
};
```
The world will be stored as a 2D binary array. Each entry represents a grid square of 64 * 64 units. '0's represent empty space, and '1's represent a solid square of 64*64 units. If you look closely I've created a small room in the top right, and 3 columns on the left.
<div class="flex flex-col items-center my-4">
  <img src="/images/posts/devDiary0/0.3/angles.png" alt="Camera position with rays and angles extending from the center" class="w-1/2 h-auto" />
  <small class="block text-center">Angle Calculations</small>
</div>

When creating an SDL window you have to define the window size in pixels, I chose 320 x 240px for a 4:3 aspsect ratio.
The basic idea from the image above, is that you shoot rays from A to B, the left edge to the right edge of the screen, one for each pixel width. Each ray needs to be offset by a rayΔ, found by the given formula, which is easily derived. A standard field of view (FOVθ) for a first person camera is 90 degrees, and the length of AB is our screen width, 320. I'll be using this ray delta later.
<div class="flex flex-col items-center my-4">
  <img src="/images/posts/devDiary0/0.3/collisions.png" alt="Rays intersecting at line boundaries" class="w-1/2 h-auto" />
  <small class="block text-center">Ray collisions</small>
</div>

Rather than checking if each ray has hit a wall every unit it advances, instead you can check only where they intersect on a horizontal or vertical grid line. This is because this is the only place that walls can be placed. In the figure above, you can see the ray intersects with horizontal lines at the orange stars, and vertical lines at the pink diamonds.