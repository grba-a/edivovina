/**
 * Obrastaj. Drugi mesh preko boce; noise threshold pada s uCrust pa mrlje
 * RASTU dok boca pada. To je cijela poanta koncepta: pad JE starenje.
 *
 * Value noise s tri oktave umjesto punog simplexa — 20 linija manje, a na
 * ovoj skali (kamenice i koralina) razlika se ne vidi.
 */

export const crustVertex = /* glsl */ `
  uniform float uCrust;
  varying float vCov;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float vnoise(vec3 x) {
    vec3 i = floor(x), f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) { return 0.55 * vnoise(p) + 0.28 * vnoise(p * 2.1) + 0.17 * vnoise(p * 4.3); }

  void main() {
    float n = fbm(position * 4.6);
    // sediment se sklada odozdo -> dno boce obraste prvo
    float bias = (1.0 - clamp(position.y / 3.0, 0.0, 1.0)) * 0.22;
    vCov = n + bias;

    float grow = smoothstep(1.0 - uCrust * 1.05, 1.05 - uCrust * 1.05, vCov);
    vec3 displaced = position + normal * fbm(position * 6.4) * grow * uCrust * 0.045;

    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(displaced, 1.0);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const crustFragment = /* glsl */ `
  uniform float uCrust;
  uniform vec3 uShell;
  uniform vec3 uCoral;
  uniform vec3 uWater;
  varying float vCov;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    // ispod pokrivenosti nema obrastaja — cisto staklo se vidi kroz
    if (vCov < 1.0 - uCrust * 1.02) discard;

    vec3 n = normalize(vNormalW);
    float lambert = clamp(dot(n, normalize(vec3(-0.35, 0.9, 0.45))), 0.0, 1.0);
    float wrap = 0.42 + 0.58 * lambert;
    float fres = pow(1.0 - clamp(dot(n, normalize(vViewDir)), 0.0, 1.0), 2.4);

    // Kalcificirana kora: bijela do sivo-pjescana, kao na fotografijama.
    vec3 base = mix(uShell, uCoral, smoothstep(0.46, 0.9, vCov));
    vec3 col = base * wrap;
    col = mix(col, uWater, fres * 0.42);          // rub upada u vodu
    col *= mix(1.0, 0.58, 1.0 - uCrust);          // svjezi obrastaj je tamniji

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`
