#ifndef CAMERA_H
#define CAMERA_H

#include "gfx.h"
#include "util.h"

enum Camera_Movement {
    FORWARD,
    BACKWARD,
    LEFT,
    RIGHT
};

#define YAW        -90.0f
#define PITCH       0.0f
#define SPEED       2.5f
#define SENSITIVITY 0.1f
#define ZOOM        45.0f

#define INIT_CAM_POS (vec3){0.f, 0.f, 4.f}
#define CAM_UP (vec3){0.f, 1.f, 0.f}

typedef struct {
    // camera Attributes
    vec3 Position, Front, Up, Right, WorldUp;
    // euler Angles
    float Yaw, Pitch;
    // camera options
    float MovementSpeed;
    float MouseSensitivity;
    float Zoom;
} Camera;

Camera camera_from_vec(vec3 position, vec3 up, float yaw, float pitch);

Camera camera_from_float(float posX, float posY, float posZ, float upX, float upY, float upZ, float yaw, float pitch);

void get_view_matrix(Camera *camera, mat4 view);

void process_keyboard(Camera *camera, enum Camera_Movement direction, float deltaTime);

void process_mouse_movement(Camera *camera, float xoffset, float yoffset, GLboolean constrainPitch);

void process_mouse_scroll(Camera *camera, float yoffset);

#endif