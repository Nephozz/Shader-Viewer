#include "keyboard.h"

bool wireframe;
bool z_pressed;

void processInput(GLFWwindow *window, Camera *camera, float delta_time) {
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
}