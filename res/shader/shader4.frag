#version 330 core

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

uniform int u_twist;
uniform int u_taper;

const float FOV = 1.;
const int MAX_STEPS = 256;
const float MAX_DIST = 500;
const float EPSILON = 0.0001;

const float PI = 3.14159265359;

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float sdBox(vec3 p, vec3 b){
    vec3 q = abs(p) - b;
    return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
}

float sdTorus(vec3 p, vec2 t){
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float sdPlane (vec3 p, vec3 n, float h) {
    return dot(p,n) + h;
}

float sdCappedCylinder(vec3 p, float h, float r) {
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

vec4 fOpUnionID(vec4 res1, vec4 res2) {
    return (res1.x < res2.x) ? res1 : res2;
}

vec4 fOpBlobbyID(vec4 res1, vec4 res2, float k) {
    k *= 1.0;
    float r = exp2(-res1.x/k) + exp2(-res2.x/k);
    float d = -k*log2(r);
    float blendFactor = clamp(0.5 + 0.5 * (res2.x - res1.x) / k, 0., 1.);
    vec3 blendedColor = mix(res2.yzw, res1.yzw, blendFactor);
    return vec4(d, blendedColor);
}

vec4 fOpIntersectID(vec4 res1, vec4 res2) {
    return (res1.x > res2.x) ? res1 : res2;
}

vec4 fOpSubtractID(vec4 res1, vec4 res2) {
    return (res1.x > -res2.x) ? res1 : vec4(-res2.x, res2.yzw);
}

mat2 rot2D(float angle){
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

vec3 twist(vec3 p, float a) {
    vec3 q = p;

    q.xz *= rot2D(a * p.y);

    return q;
}

vec3 taper(vec3 p, float max_a, float min_a) {
    float s = mix(min_a, max_a, ((max_a - min_a) + p.y) / (max_a + min_a));
    vec3 q = p;
    q.xz *= s;
    return q;
}

vec3 bend(vec3 p, float a) {
    vec3 q = p;

    float c = cos(a);
    float s = sin(a);

    return q;
}

vec4 map(vec3 p) {
    float scale = 1.2;
    vec2 m = (u_mouse.xy * 2. - u_resolution.xy) / u_resolution.y;

    float plane_dist = sdPlane(p, vec3(0.,1.,0.), 1.);
    vec3 plane_color = vec3(0.2 + 0.4 * mod(floor(p.x) + floor(p.z), 2.));
    vec4 plane = vec4(plane_dist, plane_color);

    float box_dist = sdBox(p, vec3(1.));
    vec3 box_color = vec3(0.0118, 0.298, 0.7294);
    vec4 box = vec4(box_dist, box_color);

    float sphere_dist = sdSphere(p, 1.25);
    vec3 sphere_color = vec3(.9, .1, .0);
    vec4 sphere = vec4(sphere_dist, sphere_color);

    int mode = u_twist + u_taper;

    vec4 obj;

    switch (mode) {
        case 0:
            obj = fOpUnionID(box, sphere);
            break;
        case 1:
            obj = fOpIntersectID(box, sphere);
            break;
        case 2:
            obj = fOpSubtractID(box, sphere);
            break;
    }

    vec4 res = fOpUnionID(obj, plane);

    return res;
}

vec4 rayMarch(vec3 ray_origin, vec3 ray_direction) {
    vec4 hit = vec4(0.);
    vec4 object = vec4(0.);

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ray_origin + ray_direction * object.x;
        
        hit = map(p);
        object.x += hit.x;
        object.yzw = hit.yzw;

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

    vec3 spec_color = vec3(.5);
    vec3 specular = spec_color * pow(clamp(dot(R, V), 0., 1.), 10.);
    vec3 diffuse = color * clamp(dot(L, N), 0., 1.);
    vec3 ambient = color * .05;

    // shadows
    float d = rayMarch(p + N * .02, normalize(lightPos)).x;
    if (d < length(lightPos - p)) return ambient;

    return diffuse + ambient + specular;
}

mat3 getCam(vec3 ro, vec3 lookAt) {
    vec3 camFront = normalize(vec3(lookAt -ro));
    vec3 camRight = normalize(cross(vec3(0,1,0), camFront));
    vec3 camUp = cross(camFront, camRight);

    return mat3(camRight, camUp, camFront);
}

void render(inout vec3 col, in vec2 uv) {
    vec3 ro = vec3(1.5, 3.,-3);
    vec3 lookAt = vec3(0,0,0);
    vec3 rd = getCam(ro, lookAt) * normalize(vec3(uv, FOV));

    vec4 object = rayMarch(ro, rd);

    vec3 background = vec3(.5, .8, .9);
    if (object.x < MAX_DIST) {
        vec3 p = ro + object.x * rd;
        vec3 material = object.yzw;
        col += getLight(p, rd, material);
        // fog
        col = mix(col, background, 1. - exp(-.0008 * object.x * object.x));
    } else {
        col += background - max(.8 * rd.y, 0.);
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