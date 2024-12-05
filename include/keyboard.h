#ifndef KEYBOARD_H
#define KEYBOARD_H

#include "gfx/gfx.h"

#include "util.h"
#include "gfx/camera.h"

extern bool wireframe;
extern bool twist;
extern bool tape;

extern bool z_pressed;
extern bool t_pressed;
extern bool f_pressed;

void processInput(GLFWwindow *window, Camera *camera, float delta_time, int *selected_shader);

#endif