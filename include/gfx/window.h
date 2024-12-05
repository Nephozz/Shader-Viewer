#ifndef WINDOW_H
#define WINDOW_H

#include "gfx.h"

#include "util.h"
#include "camera.h"

#define SCR_WIDTH 1280
#define SCR_HEIGHT 800

extern Camera camera;

extern bool first_mouse;
extern float last_x;
extern float last_y;

void framebuffer_size_callback(GLFWwindow* window, int width, int height);

void mouse_callback(GLFWwindow* window, double xpos, double ypos);

GLFWwindow* window_create();

void window_loop();

#endif