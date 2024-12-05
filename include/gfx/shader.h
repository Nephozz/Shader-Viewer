#ifndef SHADER_H
#define SHADER_H

#include "gfx.h"
#include "util.h"

typedef struct {
    GLuint handle, vs_handle, fs_handle;
} Shader;


Shader shader_create(char *vs_path, char *fs_path);

void shader_destroy(Shader self);

void shader_use(Shader self);

void shader_uniform_float(Shader self, char *name, float f);

void shader_uniform_int(Shader self, char *name, int v);

void shader_uniform_uint(Shader self, char *name, unsigned int v);

void shader_uniform_vec2(Shader self, char *name, vec2 v);

void shader_uniform_vec3(Shader self, char *name, vec3 v);

void shader_uniform_vec4(Shader self, char *name, vec4 v);
    
void shader_uniform_mat2(Shader self, char *name, mat2 m);

void shader_uniform_mat3(Shader self, char *name, mat3 m);

void shader_uniform_mat4(Shader self, char *name, mat4 m);

#endif