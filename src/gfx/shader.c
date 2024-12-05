#include "gfx/shader.h"

static void _checkShader(unsigned int handle, const char *type) {
    int success;
    char infoLog[1024];
    
    if (strcmp(type, "PROGRAM") != 0) {
        glGetShaderiv(handle, GL_COMPILE_STATUS, &success);
        if (!success) {
            glGetShaderInfoLog(handle, 1024, NULL, infoLog);
            log_error("ERROR::SHADER_COMPILATION_ERROR of type: %s \n %s \n -- --------------------------------------------------- -- \n", type, infoLog);
        }
    } else {
        glGetProgramiv(handle, GL_LINK_STATUS, &success);
        if (!success) {
            glGetProgramInfoLog(handle, 1024, NULL, infoLog);
            log_error("ERROR::SHADER_LINKING_ERROR of type: %s \n %s \n -- --------------------------------------------------- -- \n", type, infoLog);
        }
    }
}

static int _compile(char *path, GLenum type) {
    FILE *f;
    char *text;
    long len;

    f = fopen(path, "rb");
    if (f == NULL) {
        log_error("ERROR::SHADER::FILE_NOT_SUCCESFULLY_READ at %s\n", path);
        exit(EXIT_FAILURE);
    }
    log_info("Shader file \"%s\" opened\n", path);

    fseek(f, 0, SEEK_END);
    len = ftell(f);
    assert(len > 0);
    fseek(f, 0, SEEK_SET);
    text = calloc(1, len + 1);
    assert(text != NULL);
    fread(text, 1, len, f);
    text[len] = '\0';
    assert(strlen(text) > 0);

    if (fclose(f) != 0) {
        log_error("ERROR::SHADER::FILE_CLOSE_FAILED at %s\n", path);
    }

    const char* shaderCode = text;

    unsigned int handle = glCreateShader(type);
    glShaderSource(handle, 1, &shaderCode, NULL);
    glCompileShader(handle);

    _checkShader(handle, "COMPILE");

    free(text);
    return handle;
}

Shader shader_create(char *vs_path, char *fs_path) {
    Shader self;
    self.vs_handle = _compile(vs_path, GL_VERTEX_SHADER);
    log_info("Vertex shader compiled\n");
    self.fs_handle = _compile(fs_path, GL_FRAGMENT_SHADER);
    log_info("Fragment shader compiled\n");
    self.handle = glCreateProgram();

    glAttachShader(self.handle, self.vs_handle);
    glAttachShader(self.handle, self.fs_handle);

    glLinkProgram(self.handle);

    _checkShader(self.handle, "PROGRAM");
    log_info("Shader program linked\n");

    log_info("Shader created\n");
    return self;
}

void shader_destroy(Shader self) {
    glDeleteProgram(self.handle);
    glDeleteShader(self.vs_handle);
    glDeleteShader(self.fs_handle);
    log_info("Shader destroyed\n");
}

void shader_use(Shader self) {
    glUseProgram(self.handle);
}

void shader_uniform_float(Shader self, char *name, float f) {
    glUniform1f(glGetUniformLocation(self.handle, name), f);
}

void shader_uniform_int(Shader self, char *name, int v) {
    glUniform1i(glGetUniformLocation(self.handle, name), v);
}
void shader_uniform_uint(Shader self, char *name, unsigned int v) {
    glUniform1ui(glGetUniformLocation(self.handle, name), v);
}

void shader_uniform_vec2(Shader self, char *name, vec2 v) {
    glUniform2fv(glGetUniformLocation(self.handle, name), 1, v);
}

void shader_uniform_vec3(Shader self, char *name, vec3 v) {
    glUniform3fv(glGetUniformLocation(self.handle, name), 1, v);
}

void shader_uniform_vec4(Shader self, char *name, vec4 v) {
    glUniform4fv(glGetUniformLocation(self.handle, name), 1, v);
}
    
void shader_uniform_mat2(Shader self, char *name, mat2 m) {
     glUniformMatrix2fv(glGetUniformLocation(self.handle, name), 1, GL_FALSE, (float *)m);
}

void shader_uniform_mat3(Shader self, char *name, mat3 m) {
    glUniformMatrix3fv(glGetUniformLocation(self.handle, name), 1, GL_FALSE, (float *)m);
}

void shader_uniform_mat4(Shader self, char *name, mat4 m) {
    glUniformMatrix4fv(glGetUniformLocation(self.handle, name), 1, GL_FALSE, (float *)m);
}