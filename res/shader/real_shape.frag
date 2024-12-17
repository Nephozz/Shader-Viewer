#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float invstep(float edge, float x) {
    return step(0., edge - x);
}

vec2 invstep(vec2 edge, vec2 x) {
    return vec2(invstep(edge.x, x.x), invstep(edge.y, x.y));
}
// Create a rectangular shape according to the width and height at a given center position
float rectangle_shape(vec2 uv, vec2 center, float width, float height) {
    vec2 size = .5 * vec2(width, height);

    vec2 left_bottom = center - size;
    vec2 right_top = center + size;

    vec2 shaper = step(left_bottom, uv);
    shaper *= step(-right_top, - uv);

    return shaper.x * shaper.y;
}

//Overload of the rectangle_shape which now support vec2 for the size
float rectangle_shape(vec2 uv, vec2 center, vec2 size) {
    return rectangle_shape(uv, center, size.x, size.y);
}


float rectangle_outline(vec2 uv, vec2 center, float width, float height, float thickness) {
    vec2 size = .5 * vec2(width, height);

    vec2 left_bottom = center - size;
    vec2 right_top = center + size;

    vec2 shaper = step(left_bottom, uv) * invstep(left_bottom, uv);
    //shaper *= step(-right_top, - uv);
    //shaper *= invstep(-right_top, - uv - thickness);

    return shaper.x * shaper.y;
}

mat2 rot(float a) {
    return mat2(cos(a), sin(a), -sin(a), cos(a));
}

vec3 anim_sympa(float size, float time, vec2 uv) {
    vec3 color = vec3(0);

    float s = fract(time) * size;
    float delay = size / 3.;
    float offs = -size / 2.;

    vec2 centerR = vec2(mod(s - delay, size) + offs);
    vec2 centerG = vec2(mod(s, size) + offs);
    vec2 centerB = vec2(mod(s + delay, size) + offs);

    color += rectangle_shape(uv, centerR, vec2(size)) * vec3(1., 0., 0.);
    color += rectangle_shape(uv, centerG, vec2(size)) * vec3(0., 1., 0.);
    color += rectangle_shape(uv, centerB, vec2(size)) * vec3(0., 0., 1.);

    return color;
}

void main() {
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution) / u_resolution.y;
    float t = -u_time * .5;

    vec3 col = vec3(0);

    //uv *= rot(t/ .2);
    
    col = anim_sympa(1., t, uv);

    //col += rectangle_outline(uv, vec2(0), .5, .5, .1);

    //col *= step(0., a -st.x);

    gl_FragColor = vec4(col, 1.);
}