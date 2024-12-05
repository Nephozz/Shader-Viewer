#ifndef VAO_H
#define VAO_H

#include "gfx.h"
#include "util.h"
#include "vbo.h"

typedef struct {
    GLuint handle;
} VAO;

VAO vao_create();

void vao_destroy(VAO self);

void vao_bind(VAO self);

void vao_attr(
    VAO self, VBO vbo, GLuint index, GLint size, GLenum type,
    GLsizei stride, size_t offset);

#endif