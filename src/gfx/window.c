#include "gfx/window.h"

Camera camera;

bool first_mouse;
float last_x;
float last_y;

void framebuffer_size_callback(GLFWwindow* window, int width, int height) {
    glViewport(0, 0, width, height);
}

void mouse_callback(GLFWwindow* window, double xpos, double ypos) {
    if (first_mouse)
    {
        last_x = xpos;
        last_y = ypos;
        first_mouse = false;
    }
  
    float xoffset = xpos - last_x;
    float yoffset = last_y - ypos; 
    last_x = xpos;
    last_y = ypos;

    process_mouse_movement(&camera, xoffset, yoffset, true);
}  

GLFWwindow* window_create() {
    
    if (!glfwInit()) {
        log_error("Failed to initialize GLFW\n");
        return NULL;
    }
    log_info("GLFW initialized\n");
    log_info("GLFW %d.%d.%d\n", GLFW_VERSION_MAJOR, GLFW_VERSION_MINOR, GLFW_VERSION_REVISION);

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    log_info("OpenGL version %d.%d, core profile\n", 4, 6);
    log_info("GLFW hints set\n");

    GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "Shaders Viewer", NULL, NULL);
    if (window == NULL) {
        log_error("Failed to create GLFW window\n");
        glfwTerminate();
        return NULL;
    }
    log_info("GLFW window created\n");

    glfwMakeContextCurrent(window);
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
    glfwSetCursorPosCallback(window, mouse_callback);
    log_info("GLFW context set\n");

    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        log_error("Failed to initialize GLAD\n");
        return NULL;
    }
    log_info("GLAD initialized\n");

    glEnable(GL_DEPTH_TEST);

    return window;
}

void window_loop() {}
