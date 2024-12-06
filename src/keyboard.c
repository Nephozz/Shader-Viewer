#include "keyboard.h"

bool wireframe;
bool twist;
bool tape;

bool z_pressed;
bool t_pressed;
bool f_pressed;

void processInput(GLFWwindow *window, Camera *camera, float delta_time, int *selected_shader) {
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);

    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS) {
        process_keyboard(camera, FORWARD, delta_time);
    }
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS) {
        process_keyboard(camera, BACKWARD, delta_time);
    }
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS) {
        process_keyboard(camera, LEFT, delta_time);
    }
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS) {
        process_keyboard(camera, RIGHT, delta_time);
    }

    if (glfwGetKey(window, GLFW_KEY_1) == GLFW_PRESS) {
        if (*selected_shader != 0) {
            *selected_shader = 0;
        }
    }
    if (glfwGetKey(window, GLFW_KEY_2) == GLFW_PRESS) {
        if (*selected_shader != 1) {
            *selected_shader = 1;
        }
    }
    if (glfwGetKey(window, GLFW_KEY_3) == GLFW_PRESS) {
        if (*selected_shader != 2) {
            *selected_shader = 2;
        }
    }
    if (glfwGetKey(window, GLFW_KEY_4) == GLFW_PRESS) {
        if (*selected_shader != 3) {
            *selected_shader = 3;
        }
    }

    if (glfwGetKey(window, GLFW_KEY_Z) == GLFW_PRESS) {
        if (!z_pressed) {
            wireframe = !wireframe;
        }
        if (!wireframe) {
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
        } else {
            glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        }
        z_pressed = true;
    } else {
        z_pressed = false;
    }

    if (glfwGetKey(window, GLFW_KEY_T) == GLFW_PRESS) {
        if (!t_pressed) {
            twist = !twist;
        }
        t_pressed = true;
    } else {
        t_pressed = false;
    }

    if (glfwGetKey(window, GLFW_KEY_F) == GLFW_PRESS) {
        if (!f_pressed) {
            tape = !tape;
        }
        f_pressed = true;
    } else {
        f_pressed = false;
    }
}