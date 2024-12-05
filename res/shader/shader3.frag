#version 330 core

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

uniform bool u_twist;
uniform bool u_taper;

const float FOV = 1.;
const int MAX_STEPS = 256;
const float MAX_DIST = 500;
const float EPSILON = 0.0001;

const float colourAMix = 0.6;
const float colourBMix = 1. - colourAMix;

const float PI = 3.14159265359;

mat2 rot2D(float angle){
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

vec2 map(vec3 p) {
    vec3 w = p;
    float dr = 1.0;
    float wr = 0.0;

    int nb_iter = 0;

    for (int i = 0; i < 20; i++) {
        nb_iter = i;
        wr = length(w);
        if (wr > 2.) break;

        // extract polar coordinates
        float wo = acos(w.y / wr);
        float wi = atan(w.x, w.z);
        dr =  pow(wr, 7.)*8.0*dr + 1.0;

        // scale and rotate the point
        wr = pow(wr, 8.0);
        wo = wo * 8.0;
        wi = wi * 8.0;

        // convert back to cartesian coordinates
        w.x = wr * sin(wo)*sin(wi);
        w.y = wr * cos(wo);
        w.z = wr * sin(wo)*cos(wi);
        w += p;
    }
    float dist = 0.5 * log(wr) * wr / dr;

    return vec2(dist, float(nb_iter));
}

vec3 palette( in float t)
{
    vec3 a = vec3(1.0, 0.0, 0.0);
    vec3 b = vec3(1.0, 0.0, 0.8667);
    vec3 c = vec3(0.6667, 0.0, 1.0);
    vec3 d = vec3(0.);
    return a + b*cos( 2*PI*(c*t+d) );
}

vec2 rayMarch(vec3 ray_origin, vec3 ray_direction) {
    vec2 hit = vec2(0.);
    vec2 object = vec2(0.);

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ray_origin + ray_direction * object.x;
        
        hit = map(p);
        object.x += hit.x;
        object.y = hit.y;

        if (abs(hit.x) < EPSILON || object.x > MAX_DIST) break;
    }

    return object;
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.);
    vec3 n = vec3(map(p).x) - vec3(map(p - e.xyy).x, map(p - e.yxy).x, map(p - e.yyx).x);
    return normalize(n);
}

vec3 getLight(vec3 p, vec3 rd, vec3 color) {
    vec3 lightPos = vec3(20., 40., -30.);
    vec3 L = normalize(lightPos - p);
    vec3 N = getNormal(p);
    vec3 V = -rd;
    vec3 R = reflect(-L, N);

    // vec3 spec_color = vec3(.5);
    // vec3 specular = spec_color * pow(clamp(dot(R, V), 0., 1.), 10.);
    vec3 diffuse = color * clamp(dot(L, N), 0., 1.);
    vec3 ambient = color * .05;

    // shadows
    float d = rayMarch(p + N * .02, normalize(lightPos)).x;
    if (d < length(lightPos - p)) return ambient;

    return diffuse + ambient;
}

mat3 getCam(vec3 ro, vec3 lookAt) {
    vec3 camFront = normalize(vec3(lookAt -ro));
    vec3 camRight = normalize(cross(vec3(0,1,0), camFront));
    vec3 camUp = cross(camFront, camRight);

    return mat3(camRight, camUp, camFront);
}

void render(inout vec3 col, in vec2 uv) {
    float t = u_time * .1;
    vec3 ro = vec3(sin(t), cos(t), 0.8 + 0.4 * sin(t));
    vec3 lookAt = vec3(0,0,0);
    vec3 rd = getCam(ro, lookAt) * normalize(vec3(uv, FOV));

    vec2 object = rayMarch(ro, rd);

    vec3 background = vec3(0.);
    if (object.x < MAX_DIST) {
        vec3 p = ro + object.x * rd;
        // display a non linear gradient based on the number of iterations
        float c = clamp(exp(- 0.11*object.y), 0., 1.);

        vec3 emission = palette(c);

        // Darken the color based on the number of iterations
        float darkenFactor = clamp(object.y / 26.0, 0.0, 1.0);
        vec3 darkenedColor = mix(vec3(0.0), emission, darkenFactor);

        col = darkenedColor;   

    } else {
        col += background;
    }
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution.xy) /u_resolution.y;
    
    vec3 color;

    render(color, uv);
        
    // gamma correction
    color = pow(color, vec3(0.4545));
    gl_FragColor = vec4(color,1.);
}