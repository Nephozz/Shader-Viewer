#ifndef KEYBOARD_H
#define KEYBOARD_H

#include "gfx/gfx.h"

#include "util.h"
#include "gfx/camera.h"

extern bool wireframe;
extern bool z_pressed;

void processInput(GLFWwindow *window, Camera *camera, float delta_time);

#endif