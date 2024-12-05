#include "gfx/texture.h"
#include "util.h"

Texture2D texture_create(GLuint internal_format, GLuint image_format, char *texture_path) {
    Texture2D texture;
    texture.internal_format = internal_format;
    texture.image_format = image_format;
    texture.wrap_S = GL_REPEAT;
    texture.wrap_T = GL_REPEAT;
    texture.filter_min = GL_LINEAR;
    texture.filter_max = GL_LINEAR;
    texture.path = texture_path;
    return texture;
}

// generates texture from image data
void texture_generate(Texture2D *texture, int width, int height, unsigned char* data) {
    if (texture->id == 0) {
        glGenTextures(1, &texture->id);  // Generate the texture if not already generated
    }
    
    texture->width = width;
    texture->height = height;
    
    // create Texture
    glBindTexture(GL_TEXTURE_2D, texture->id);
    glTexImage2D(GL_TEXTURE_2D, 0, texture->internal_format, width, height, 0, texture->image_format, GL_UNSIGNED_BYTE, data);
    
    // set Texture wrap and filter modes
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, texture->wrap_S);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, texture->wrap_T);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, texture->filter_min);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, texture->filter_max);
    
    // Optionally generate mipmaps (this depends on your use case)
    glGenerateMipmap(GL_TEXTURE_2D);

    // unbind texture
    glBindTexture(GL_TEXTURE_2D, 0);
    log_info("Texture %d generated\n", texture->id);
}

// binds the texture as the current active GL_TEXTURE_2D texture object
void texture_bind(Texture2D *texture) {
    glBindTexture(GL_TEXTURE_2D, texture->id);
}

unsigned char* texture_load(Texture2D *texture) {
    unsigned char* data;

    stbi_set_flip_vertically_on_load(true);

    data = stbi_load(texture->path, &texture->width, &texture->height, &texture->nb_channels, 0);
	if (data) {
		texture_generate(texture, texture->width, texture->height, data);
        log_info("Texture loaded from \"%s\"\n", texture->path);
	} else {
		log_error("Failed to load texture at \"%s\"\n", texture->path);
	}

    return data;
}