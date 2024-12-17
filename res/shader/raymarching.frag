#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform int u_mouse_btn;

float sdSphere(vec3 p, float s){
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

float sdOctahedron(vec3 p, float s){
    p = abs(p);
    return (p.x + p.y + p.z - s) * .57735027;
}

float smin(float a, float b, float k){
    float h = max(k - abs(a - b), 0.) / k;
    return min(a, b) - h * h * h * k * (1. / 6.);
}

vec3 palette(float t) {
    vec3 a = vec3(.5);
    vec3 b = vec3(.5);
    vec3 c = vec3(1.);
    vec3 d = vec3(1.) - vec3(.263, .416, .557);

    float reversed_t = 1. - t;

    return a + b * cos(6.28318*(c*reversed_t*d));
}

vec3 palette2(float t) {
    vec3 a = vec3(0.5 + 0.5 * sin(t), 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5 + 0.5 * sin(t + 2.0 * 3.14159 / 3.0), 0.5);
    vec3 c = vec3(0.4706, 0.4706, 0.4706);
    vec3 d = vec3(0.263, 0.416, 0.557);

    float reversed_t = 1. - t;

    return a + b * cos(6.28318 * (c * reversed_t * d));
}


mat2 rot2D(float angle){
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

/*
mat3 rot3D(vec3 axis, float angle){
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1. - c;

    return mat3(
        oc * axis.x * axis.x + c,
        oc * axis.x * axis.y - axis.z * s, 
        oc * axis.z * axis.x + axis.y * s,
        oc * axis.x * axis.y + axis.z * s, 
        oc * axis.y * axis.y + c, 
        oc * axis.y * axis.z - axis.x * s,
        oc * axis.z * axis.x - axis.y * s, 
        oc * axis.y * axis.z + axis.x * s,
        oc * axis.z * axis.z + c
    );
}
*/

vec3 rot3D(vec3 p, vec3 axis, float angle){
    // Rodrigues' rotation formula
    return mix(dot(axis, p) * axis, p, cos(angle)) 
    + cross(axis, p) * sin(angle);
}

// Distance to the scene
float map(vec3 p){
    p.z += u_time * .4;   // animate

    // Space repetition
    p.xy = (fract(p.xy) - .5);
    p.z = mod(p.z, .25) - .125;

    float box = sdOctahedron(p, .15);  // octahedron SDF

    // Closest distance to the scene
    return box;
}

void main(){
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution.xy) / u_resolution.y;
    vec2 m = (u_mouse.xy * 2. - u_resolution.xy) / u_resolution.y;

    // Initialization
    vec3 ro = vec3(0, 0, -3);   //ray origin
    vec3 rd = normalize(vec3(uv * 1.5, 1));   // ray direction
    vec3 col = vec3(0);   // final pixel color
    
    float t = 0.;   // total distance along the ray

    // Default circular motion if mouse not clicked
    if (u_mouse_btn != 1) m = vec2(cos(u_time * .2), sin(u_time * .2));

    // Raymarching
    float i_float = 0.;
    int i;
    for (i = 0; i < 80; i++){
        vec3 p = ro + rd * t;   //position along the ray

        p.xy *= rot2D(t*.2 * m.x); // rotate ray

        p.y += sin(t*(m.y+1.)*.5)*.35;  // wiggle ray

        float d = map(p);   // current distance to the scene

        t += d*1.;   // move along the ray

        if (d < .001 || t > 100.) break;   // ealry stop

        i_float += 1.;   // convert to float
    }

    // Coloring
    col = palette(t*.04 + i_float * .005);

    gl_FragColor = vec4(col, 1);
}