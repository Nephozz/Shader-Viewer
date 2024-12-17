#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
	vec2 p = gl_FragCoord.xy / u_resolution;
    
    
    vec3 col = pal( p.x, vec3(1., 1., 1.),vec3(1.03, .707, 1.03),vec3(.5, 1., .5),vec3(-1.012, .5, .518) );
    
	gl_FragColor = vec4( col, 1.0 );
}