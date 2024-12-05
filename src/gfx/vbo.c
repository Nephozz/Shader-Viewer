#include "gfx/vbo.h"

VBO vbo_create(GLint type) {
    VBO vbo;

    glGenBuffers(1, &vbo.handle);
    vbo.type = type;

    return vbo;
}

void vbo_bind(VBO self) {
    glBindBuffer(self.type, self.handle);
}

void vbo_destroy(VBO self) {
    glDeleteBuffers(1, &self.handle);
}

void vbo_buffer(VBO self, void *data, size_t size) {
    vbo_bind(self);
    glBufferData(self.type, size, data, GL_STATIC_DRAW);
}
