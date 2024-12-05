#include "gfx/gfx.h"

#include "util.h"

#include "gfx/shader.h"
#include "gfx/camera.h"
#include "gfx/texture.h"
#include "keyboard.h"
#include "gfx/window.h"
#include "gfx/vbo.h"
#include "gfx/vao.h"
#include "obj.h"

float delta_time = 0.f;
float last_frame = 0.f;

vec2 u_resolution = {SCR_WIDTH, SCR_HEIGHT};

int main() {
    
    GLFWwindow* window = window_create();

    if (window == NULL) {
        return EXIT_FAILURE;
    }

    Shader shader = shader_create("res/shader/shader.vert", "res/shader/shader.frag");

    float vertices[] = {
         1.f,  1.f, 0.0f,
         1.f, -1.f, 0.0f,
        -1.f, -1.f, 0.0f,
        -1.f,  1.f, 0.0f 
    };
    unsigned int indices[] = {
        0, 1, 3, // first triangle
        1, 2, 3  // second triangle
    };

    VBO vbo = vbo_create(GL_ARRAY_BUFFER);
    VAO vao = vao_create();
    unsigned int EBO;
    glGenBuffers(1, &EBO);

    vao_bind(vao);
    vbo_buffer(vbo, vertices, sizeof(vertices));

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

    // position attribute
    vao_attr(vao, vbo, 0, 3, GL_FLOAT, 3 * sizeof(float), 0);
    log_info("Buffers configured\n");

    camera = camera_from_vec(INIT_CAM_POS, CAM_UP, YAW, PITCH);

    wireframe = false;
    z_pressed = false;

    first_mouse = true;
    last_x = (float)SCR_WIDTH / 2.;
    last_y = (float)SCR_HEIGHT / 2.;
    
    while(!glfwWindowShouldClose(window)) {
        float current_frame = glfwGetTime();
        delta_time = current_frame - last_frame;
        last_frame = current_frame;
        vec2 u_mouse = {last_x, last_y}; 

        processInput(window, &camera, delta_time);

        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        shader_use(shader);
        shader_uniform_float(shader, "u_time", current_frame);
        shader_uniform_vec2(shader, "u_resolution", u_resolution);
        shader_uniform_vec2(shader, "u_mouse", u_mouse);
        
        mat4 view;
        get_view_matrix(&camera, view);
        mat4 projection = GLM_MAT4_IDENTITY_INIT;
        mat4 mvp;
        // Calculate matrix on CPU before sending to GPU
        glm_perspective(glm_rad(45.0f), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f, projection);

        vao_bind(vao);
        mat4 model = GLM_MAT4_IDENTITY_INIT;
        glm_mat4_mulN((mat4*[]){&projection, &view, &model}, 3, mvp);

        shader_uniform_mat4(shader, "mvp", mvp);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

        glfwSwapBuffers(window);
        glfwPollEvents();   
    }

    shader_destroy(shader);

    vao_destroy(vao);
	vbo_destroy(vbo);
    glDeleteBuffers(1, &EBO);
    log_info("Buffers deleted\n");
    
    glfwTerminate();
    log_info("GLFW terminated\n");
    return EXIT_SUCCESS;
}
