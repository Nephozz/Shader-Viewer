#ifndef TEXTURE_H
#define TEXTURE_H

#include "gfx.h"

typedef struct {
    // holds the ID of the texture object, used for all texture operations to reference to this particular texture
    GLuint id;
    // texture image dimensions
    int width, height, nb_channels; // width and height of loaded image in pixels
    char* path;
    // texture Format
    GLuint internal_format; // format of texture object
    GLuint image_format; // format of loaded image
    // texture configuration
    GLuint wrap_S; // wrapping mode on S axis
    GLuint wrap_T; // wrapping mode on T axis
    GLuint filter_min; // filtering mode if texture pixels < screen pixels
    GLuint filter_max; // filtering mode if texture pixels > screen pixels
} Texture2D;

Texture2D texture_create(GLuint internal_format, GLuint image_format, char *texture_path);

void texture_generate(Texture2D *texture, int width, int height, unsigned char* data);

void texture_bind(Texture2D *texture);

unsigned char* texture_load(Texture2D *texture);

#endif