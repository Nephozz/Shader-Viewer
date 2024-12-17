#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

/*
#define PI 3.1415926535

float circleshape(vec2 position, float radius){
    return step(radius, length(position - vec2(0.5)));
}

float rectshape(vec2 position, vec2 scale){
    scale = vec2(0.5) - scale * 0.5;
    vec2 shaper = vec2(step(scale.x, position.x), step(scale.y, position.y));
    shaper *= vec2(step(scale.x, 1.0 - position.x), step(scale.y, 1.0 - position.y));
    return shaper.x * shaper.y;
}

float polygonshape(vec2 position, float radius, float sides){
    position = position * 2.0 - 1.0;
    float angle = atan(position.x, position.y);
    float slice = PI * 2.0 / sides;
    return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
}
*/

vec3 palette(float t) {
    vec3 a = vec3(.5, .5, .5);
    vec3 b = vec3(.5, .5, .5);
    vec3 c = vec3(1., 1., 1.);
    vec3 d = vec3(.263, .416, .557);

    return a + b * cos(6.28318*(c*t*d));
}

void main(){
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution) / u_resolution.y;
    vec2 uv0 = uv;
    float t = u_time * 2.;
    vec3 finalColor = vec3(0);

    for (float i = 0.; i < 4.; i++) {
        uv = fract(uv*1.5) - .5;

        float d = length(uv) * exp(-length(uv));

        vec3 col = palette(length(uv0) + i * .4 + t * .4);

        d = cos(d*8. + t) / 8.;
        d = abs(d);

        d = pow(0.01 / d, 1.2);

        finalColor += col * d;
    }

    gl_FragColor = vec4(finalColor, 1.);
}