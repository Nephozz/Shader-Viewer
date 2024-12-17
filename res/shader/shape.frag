#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
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

float raisedCosine(float T, float alpha, float f) {
    float k = (1. - alpha) / (2. * T);
    float k_p = (1. + alpha) / (2. * T);

    if(abs(f) <= k) {
        return 1.;
    } else if(abs(f) > k && abs(f) <= k_p){
        return .5 *(1. + cos(PI*T/alpha * (abs(f) - k)));
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
    vec2 st = (gl_FragCoord.xy * 2. - u_resolution.xy) / u_resolution.y;
    st *= 2.;
    float t = u_time*.1;

    float y = .8 * easeInOutInElastic(st.x + 1.);
    //float y = st.x*exp(-st.x);
    //float y = log(st.x);
    //float y = raisedCosine(.5, .5, st.x);
    //float y = 2. * sin(PI*st.x)/(PI*st.x);
    //float y = easeOutBounce(st.x + 1.);

    vec3 color = vec3(y);

    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4(color,1.0);
}