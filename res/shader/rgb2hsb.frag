#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

#define PI 3.1415926535897932384

float max3(vec3 rgb) {
    float a = rgb.r;
    float b = rgb.g;
    float c = rgb.b;
    if(a > b && a > c) { return a; }
    else if(b > a && b > c) { return b; }
    else { return c; }
}

float min3(vec3 rgb) {
    float a = rgb.r;
    float b = rgb.g;
    float c = rgb.b;
    if(a < b && a < c) { return a; }
    else if(b < a && b < c) { return b; }
    else { return c; }
}

vec3 hue2rgb(float hue) {
    vec3 rgb;

    if(mod(hue, 360.) < 180.) {
        rgb.r = clamp((120. - hue) / 60.,0.,1.);
    } else {}

    return rgb;
}

vec3 rgb2hsl(vec3 rgb) {
    float M = max3(rgb);
    float m = min3(rgb);
    float C = M - m;

    float T_prime;
    if (M == rgb.r) { T_prime = mod((rgb.g - rgb.b)/C, 6.); }
    else if (M == rgb.g) { T_prime = mod((rgb.b - rgb.r)/C + 2., 6.); }
    else if (M == rgb.b) { T_prime = mod((rgb.r - rgb.g)/C + 4., 6.); }
    else { T_prime = 0.; }

    float T = 60. * T_prime;

    float L = .5 * (M + m);
    
    float S;
    if(L == 1.) { S = 0.; }
    else { S = C / (1. - abs(2. * L - 1.)); }

    return vec3(T, S, L);
}

vec3 hsl2rgb(vec3 hsl) {
    float C = hsl.y * hsl.z;

    float T_prime = hsl.x / 60.;

    float X =  C * (1. - abs(mod(T_prime, 2.) - 1.));

    vec3 rgb;
    if( T_prime > 0. && T_prime < 1.) { rgb = vec3(C, X, 0.); }
    else if( T_prime >= 1. && T_prime < 2.) { rgb = vec3(X, C, 0.); }
    else if( T_prime >= 2. && T_prime < 3.) { rgb = vec3(0., C, X); }
    else if( T_prime >= 3. && T_prime < 4.) { rgb = vec3(0., X, C); }
    else if( T_prime >= 4. && T_prime < 5.) { rgb = vec3(X, 0., C); }
    else if( T_prime >= 5. && T_prime < 6.) { rgb = vec3(C, 0., X); }
    else if(hsl.x == 0.) { rgb = vec3(0.); }

    float m = hsl.z - C;
    return vec3(rgb.r + m, rgb.g + m, rgb.b + m);
}

mat2 rot(float a) {
    return mat2(cos(a), sin(a), -sin(a), cos(a));
} 

void main() {
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution) / u_resolution.y;
    float t = u_time;
    vec2 M = (u_mouse * 2. - u_resolution) / u_resolution.y;

    vec3 col = vec3(0);

    float angle_m = mod(atan(M.y, M.x), 2. * PI);
    uv *= rot(angle_m * 2.);
    
    float radius = length(uv);
    //set the angle between 0. and 1.
    float angle = mod(atan(uv.y,uv.x), 2. * PI) / (2. * PI);

    // Shaping function
    angle = pow(angle, 1.4);

    //set the angle back to the 0° - 360° range 
    angle *= 360.;

    col = hsl2rgb(vec3(angle, radius, 1.));

    if(radius > 1.) { col = vec3(1.); } 

    gl_FragColor = vec4(col, 1.);
}