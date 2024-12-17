#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = (gl_FragCoord.xy * 2. - u_resolution.xy) / u_resolution.y;
    st *= .5;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    //vec3 pct = vec3(sin(st.x), sin(st.x + .5), sin(st.x + 1.));

    float a = 1.;
    float offs = .5;

    pct.g = a*cos(2.*PI*st.x) + offs;
    pct.b = a*cos(2.*PI*(st.x - .333333)) + offs;
    pct.r = a*cos(2.*PI*(st.x - .666666)) + offs;

    //pct.r = smoothstep(0.0,1.0, st.x);
    //pct.g = sin(st.x*PI);
    //pct.b = pow(st.x,0.5);

    //color = mix(colorA, colorE, pct);
    color = pct;

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
}