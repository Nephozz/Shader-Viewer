#include "gfx/camera.h"

// calculates the front vector from the Camera's (updated) Euler Angles
static void _updateCameraVectors(Camera *camera) {
    // calculate the new Front vector
    vec3 front;
    front[0] = cos(glm_rad(camera->Yaw)) * cos(glm_rad(camera->Pitch));
    front[1] = sin(glm_rad(camera->Pitch));
    front[2] = sin(glm_rad(camera->Yaw)) * cos(glm_rad(camera->Pitch));
    glm_normalize(front);
    glm_vec3_copy(front, camera->Front);
    // also re-calculate the Right and Up vector
    glm_cross(camera->Front, camera->WorldUp, camera->Right);
    glm_normalize(camera->Right);  // normalize the vectors, because their length gets closer to 0 the more you look up or down which results in slower movement.
    glm_cross(camera->Right, camera->Front, camera->Up);
    glm_normalize(camera->Up);
}

// constructor with vectors
Camera camera_from_vec(vec3 position, vec3 up, float yaw, float pitch) {
    Camera self;
    glm_vec3_copy(position, self.Position);
    glm_vec3_copy(up, self.WorldUp);
    self.Yaw = yaw;
    self.Pitch = pitch;

    glm_vec3_zero(self.Front);
    self.Front[2] = -1.0f;

    self.MovementSpeed = SPEED;
    self.MouseSensitivity = SENSITIVITY;
    self.Zoom = ZOOM;

    _updateCameraVectors(&self);
    return self;
}
// constructor with scalar values
Camera camera_from_float(float posX, float posY, float posZ, float upX, float upY, float upZ, float yaw, float pitch) {
    Camera self;

    vec3 position = {posX, posY, posZ};
    glm_vec3_copy(position, self.Position);
    vec3 up = {upX, upY, upZ};
    glm_vec3_copy(up, self.WorldUp);
    self.Yaw = yaw;
    self.Pitch = pitch;

    glm_vec3_zero(self.Front);
    self.Front[2] = -1.0f;

    self.MovementSpeed = SPEED;
    self.MouseSensitivity = SENSITIVITY;
    self.Zoom = ZOOM;

    _updateCameraVectors(&self);
    return self;
}

// returns the view matrix calculated using Euler Angles and the LookAt Matrix
void get_view_matrix(Camera *camera, mat4 view) {
    vec3 cameraCenter;
    glm_vec3_add(camera->Position, camera->Front, cameraCenter);
    glm_lookat(camera->Position, cameraCenter, camera->Up, view);
}

// processes input received from any keyboard-like input system. Accepts input parameter in the form of camera defined ENUM (to abstract it from windowing systems)
void process_keyboard(Camera *camera, enum Camera_Movement direction, float deltaTime) {
    float velocity = camera->MovementSpeed * deltaTime;
    vec3 rectifiedFront;
    if (direction == FORWARD) {
        glm_vec3_scale(camera->Front, velocity, rectifiedFront);
        glm_vec3_add(camera->Position, rectifiedFront, camera->Position);
    }
    if (direction == BACKWARD) {
        glm_vec3_scale(camera->Front, velocity, rectifiedFront);
        glm_vec3_sub(camera->Position, rectifiedFront, camera->Position);
    }
    if (direction == LEFT) {
        glm_vec3_cross(camera->Front, camera->WorldUp, rectifiedFront);
        glm_vec3_normalize(rectifiedFront);
        glm_vec3_scale(rectifiedFront, velocity, rectifiedFront);
        glm_vec3_sub(camera->Position, rectifiedFront, camera->Position);
    }
    if (direction == RIGHT) {
        glm_vec3_cross(camera->Front, camera->WorldUp, rectifiedFront);
        glm_vec3_normalize(rectifiedFront);
        glm_vec3_scale(rectifiedFront, velocity, rectifiedFront);
        glm_vec3_add(camera->Position, rectifiedFront, camera->Position);
    }
}

// processes input received from a mouse input system. Expects the offset value in both the x and y direction.
void process_mouse_movement(Camera *camera, float xoffset, float yoffset, GLboolean constrainPitch) {
    xoffset *= camera->MouseSensitivity;
    yoffset *= camera->MouseSensitivity;

    camera->Yaw   += xoffset;
    camera->Pitch += yoffset;

    // make sure that when pitch is out of bounds, screen doesn't get flipped
    if (constrainPitch)
    {
        if (camera->Pitch > 89.0f)
            camera->Pitch = 89.0f;
        if (camera->Pitch < -89.0f)
            camera->Pitch = -89.0f;
    }

    // update Front, Right and Up Vectors using the updated Euler angles
    _updateCameraVectors(camera);
}

// processes input received from a mouse scroll-wheel event. Only requires input on the vertical wheel-axis
void process_mouse_scroll(Camera *camera, float yoffset) {
    camera->Zoom -= (float)yoffset;
    if (camera->Zoom < 1.0f)
        camera->Zoom = 1.0f;
    if (camera->Zoom > 45.0f)
        camera->Zoom = 45.0f;
}