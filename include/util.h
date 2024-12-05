#ifndef UTIL_H
#define UTIL_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#include <cglm/cglm.h>
#include <cglm/call.h>

#include <stb_image.h>

#define true 1
#define false 0

#define ENABLE_DEBUG true

#if ENABLE_DEBUG
    #define log_info(...) fprintf(stdout, __VA_ARGS__)
    #define log_error(...) fprintf(stderr, __VA_ARGS__)
#else
    #define log_info(...)
    #define log_error(...)
#endif

#endif