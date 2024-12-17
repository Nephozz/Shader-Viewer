#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

float easeInSine (float x) {
    return 1. - cos((x * PI) / 2.);;
}

float easeInOutInElastic(float x) {
    const float c5 = (2. * PI) / 4.5;

    if(x == 0.) {
        return 0.;
    } else if(x == 1.) {
        return 1.;
    } else if(x == 2.) {
        return 0.;
    } else if(x > 0. && x < .5) {
        return -(pow(2., 20. * x - 10.) * sin((20. * x - 11.125) * c5)) / 2.;
    } else if(x > .5 && x < 1.) { 
        return (pow(2., 20. * -(x - 1.) - 10.) * sin((20. * x - 11.125) * c5)) / 2. + 1.;
    } else if(x > 1. && x < 1.5) {
        return -(pow(2., 20. * (x - 1.) - 10.) * sin((20. * x - 11.125) * c5)) / 2. + 1.;
    } else if(x > 1.5 && x < 2.) { 
        return (pow(2., 20. * -(x - 2.) - 10.) * sin((20. * x - 11.125) * c5)) / 2.;
    } else {
        return 0.;
    }
}

float easeOutBounce(float x) {
float n1 = 7.5625;
float d1 = 2.75;

    if (x < 1. / d1) {
        return n1 * x * x;
    } else if (x < 2. / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }

}

void main() {
    float t = u_time * .1;
    vec3 color = vec3(0.0);

    //float pct = easeInOutInElastic(2. *fract(t));
    //float pct = easeOutBounce(fract(t));
    float pct = sin(10.*t);

    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
}
