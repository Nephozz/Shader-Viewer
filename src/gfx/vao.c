#include "gfx/vao.h"

VAO vao_create() {
    VAO vao;

    glGenVertexArrays(1, &vao.handle);

    return vao;
}

void vao_destroy(VAO self) {
    glDeleteVertexArrays(1, &self.handle);
}

void vao_bind(VAO self) {
    glBindVertexArray(self.handle);
}

void vao_attr(
    VAO self, VBO vbo, GLuint index, GLint size, GLenum type,
    GLsizei stride, size_t offset) {
    vao_bind(self);
    vbo_bind(vbo);

    glVertexAttribPointer(index, size, type, GL_FALSE, stride, (void*) offset);
    
    glEnableVertexAttribArray(index);
}