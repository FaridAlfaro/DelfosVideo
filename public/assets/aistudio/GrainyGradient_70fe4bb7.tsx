import React, { useEffect, useRef, useState } from 'react';

export type GradientTone = 'cobalt' | 'aurora' | 'violet' | 'emerald' | 'crimson' | 'sapphire' | 'silver';

export interface TonePreset {
  id: GradientTone;
  label: { ES: string; EN: string; PT: string };
  swatch: string;
  // RGB normalized [0..1]
  abyss: [number, number, number];
  deep: [number, number, number];
  primary: [number, number, number];
  highlight: [number, number, number];
  undertone: [number, number, number];
}

export const GRADIENT_TONES: Record<GradientTone, TonePreset> = {
  // Home: Azules más oscuros y profundos (Abisal -> Azul Noche -> Cobalto Profundo)
  cobalt: {
    id: 'cobalt',
    label: { ES: 'Cobalto Abisal', EN: 'Abyssal Cobalt', PT: 'Cobalto Abissal' },
    swatch: '#0026d6',
    abyss: [0.004, 0.009, 0.032],      // #010208 (azul abisal casi negro)
    deep: [0.010, 0.038, 0.18],        // #030a2e (azul marino muy oscuro)
    primary: [0.0, 0.16, 0.78],        // #0029c7 (azul cobalto profundo)
    highlight: [0.08, 0.38, 0.88],     // #1461e0 (cresta azul real oscuro)
    undertone: [0.012, 0.065, 0.28],   // #031047 (subtono azul medianoche profundo)
  },
  aurora: {
    id: 'aurora',
    label: { ES: 'Océano Ártico', EN: 'Arctic Ocean', PT: 'Oceano Ártico' },
    swatch: '#00b4d8',
    abyss: [0.006, 0.024, 0.055],
    deep: [0.02, 0.13, 0.28],
    primary: [0.0, 0.45, 0.88],
    highlight: [0.08, 0.85, 0.96],
    undertone: [0.04, 0.32, 0.36],
  },
  violet: {
    id: 'violet',
    label: { ES: 'Índigo Nocturno', EN: 'Night Indigo', PT: 'Índigo Noturno' },
    swatch: '#6d28d9',
    abyss: [0.02, 0.01, 0.05],
    deep: [0.09, 0.04, 0.24],
    primary: [0.32, 0.12, 0.85],
    highlight: [0.58, 0.28, 0.98],
    undertone: [0.48, 0.07, 0.28],
  },
  emerald: {
    id: 'emerald',
    label: { ES: 'Esmeralda Profundo', EN: 'Deep Emerald', PT: 'Esmeralda Profundo' },
    swatch: '#10b981',
    abyss: [0.008, 0.03, 0.04],
    deep: [0.02, 0.14, 0.20],
    primary: [0.02, 0.46, 0.52],
    highlight: [0.22, 0.82, 0.62],
    undertone: [0.04, 0.24, 0.38],
  },
  crimson: {
    id: 'crimson',
    label: { ES: 'Carmesí Ejecutivo', EN: 'Executive Crimson', PT: 'Carmesim Executivo' },
    swatch: '#e11d48',
    abyss: [0.035, 0.008, 0.025],
    deep: [0.16, 0.02, 0.12],
    primary: [0.68, 0.08, 0.28],
    highlight: [0.95, 0.32, 0.22],
    undertone: [0.28, 0.04, 0.36],
  },
  sapphire: {
    id: 'sapphire',
    label: { ES: 'Zafiro Imperial', EN: 'Imperial Sapphire', PT: 'Safira Imperial' },
    swatch: '#2563eb',
    abyss: [0.005, 0.018, 0.06],
    deep: [0.03, 0.10, 0.32],
    primary: [0.12, 0.32, 0.92],
    highlight: [0.38, 0.72, 0.98],
    undertone: [0.18, 0.12, 0.48],
  },
  silver: {
    id: 'silver',
    label: { ES: 'Blanco & Gris Arquitectónico', EN: 'Architectural White & Grey', PT: 'Branco & Cinza Arquitetônico' },
    swatch: '#e2e8f0',
    abyss: [0.78, 0.80, 0.84],          // #c7ccd6 (pliegue gris plata arquitectónico)
    deep: [0.88, 0.90, 0.93],           // #e0e6ed (gris perla suave)
    primary: [0.95, 0.96, 0.98],        // #f2f5fa (blanco alabastro luminoso)
    highlight: [1.0, 1.0, 1.0],         // #ffffff (cresta blanco puro)
    undertone: [0.83, 0.85, 0.89],      // #d4d9e3 (subtono gris platino frío)
  },
};

interface GrainyGradientProps {
  className?: string;
  grainOpacity?: number;
  hoverIntensity?: number;
  tone?: GradientTone;
  children?: React.ReactNode;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader que simula una malla líquida tridimensional (Domain-Warped Liquid Mesh)
// donde el movimiento del cursor deforma las corrientes y cada click inyecta ondas elásticas y vórtices reales
const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_mouseVel;
  uniform float u_press;
  uniform float u_grainOpacity;

  // Hasta 8 ondas de click simultáneas: xy = posición, z = tiempo desde el click, w = intensidad/dirección
  uniform vec4 u_ripples[8];

  uniform vec3 u_abyss;
  uniform vec3 u_deep;
  uniform vec3 u_primary;
  uniform vec3 u_highlight;
  uniform vec3 u_undertone;

  // Simplex 2D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Hash rápido para grano cinematográfico fino
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    vec2 mouseP = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);

    // 1. DEFORMACIÓN FLUIDA DEL CURSOR (sin halo luminoso artificial, sino arrastre elástico de la malla)
    vec2 toMouse = p - mouseP;
    float distMouse = length(toMouse);
    float mouseInfluence = exp(-distMouse * distMouse * 4.5);

    // El movimiento del cursor arrastra el tejido de la malla en la dirección de su velocidad
    vec2 meshWarp = u_mouseVel * mouseInfluence * 0.65;

    // Al mantener presionado el click, la malla se contrae y gira como un vórtice líquido
    vec2 perpMouse = vec2(-toMouse.y, toMouse.x);
    meshWarp -= toMouse * u_press * mouseInfluence * 0.55;
    meshWarp += perpMouse * u_press * mouseInfluence * 0.65;

    // 2. ONDAS FÍSICAS Y DEFORMACIÓN POR CLICKS (efecto malla líquida reactiva)
    float clickElevation = 0.0;
    for (int i = 0; i < 8; i++) {
      vec4 rip = u_ripples[i];
      float age = rip.z;
      if (age > 0.0 && age < 4.5) {
        vec2 ripP = vec2((rip.x - 0.5) * aspect, rip.y - 0.5);
        vec2 dVec = p - ripP;
        float dist = length(dVec);
        vec2 dir = dist > 0.0001 ? dVec / dist : vec2(0.0);
        vec2 swirlDir = vec2(-dir.y, dir.x);

        // Frente de onda líquido que se expande y deforma los pliegues del gradiente
        float waveRadius = age * 0.58;
        float ringDist = dist - waveRadius;
        float envelope = exp(-ringDist * ringDist * 14.0) * exp(-age * 0.85) * rip.w;
        float oscillation = sin(ringDist * 22.0 - age * 7.0);

        // Desplazamiento radial + torsión de malla en el lugar del click
        float corePull = exp(-dist * dist * 6.0) * exp(-age * 1.4) * rip.w;
        meshWarp += dir * (oscillation * envelope * 0.14 - corePull * 0.16);
        meshWarp += swirlDir * (corePull * 0.22 + envelope * oscillation * 0.06);
        clickElevation += (oscillation * envelope * 0.38 + corePull * 0.45);
      }
    }

    vec2 warpedUV = uv + meshWarp;
    vec2 wp = vec2((warpedUV.x - 0.5) * aspect, warpedUV.y - 0.5);

    // 3. ESTRUCTURA DE PLIEGUES DIAGONALES (inspirada en Screenshot 2026-10-22 212834.png)
    float t = u_time * 0.14;

    // Coordenadas de dominio curvado (Domain Warping de 2 niveles)
    float n1 = snoise(wp * 1.35 + vec2(t * 0.7, -t * 0.5));
    float n2 = snoise(wp * 2.1 - vec2(t * 0.6, t * 0.8) + n1 * 0.65);
    float n3 = snoise(wp * 0.85 + vec2(-t * 0.4, t * 0.5) + vec2(n1, n2) * 0.55);

    vec2 q = warpedUV + vec2(n1, n2) * 0.22 + meshWarp * 0.4;

    // Cresta diagonal izquierda-superior a centro-izquierda (azul eléctrico profundo)
    float diagCrest1 = sin((q.x * 1.65 - q.y * 1.25 + n3 * 0.55 + clickElevation * 0.6) * 3.14159);
    diagCrest1 = smoothstep(-0.45, 0.85, diagCrest1);

    // Valle diagonal central-derecho (pliegue abisal oscuro como en el screenshot)
    float abyssalFold = exp(-pow((q.x - 0.54) * 1.45 + (q.y - 0.42) * 1.1 + n2 * 0.28 - clickElevation * 0.35, 2.0) * 3.4);

    // Cresta luminosa superior derecha (azul azur brillante hacia la esquina superior derecha)
    float topRightGlow = smoothstep(0.95, 0.0, length((q - vec2(0.92, 0.88)) * vec2(1.1, 1.35)) - n1 * 0.18 - clickElevation * 0.2);

    // Cresta luminosa izquierda media/alta
    float leftWave = smoothstep(0.88, 0.05, length((q - vec2(0.12, 0.55)) * vec2(1.0, 1.1)) + n2 * 0.16);

    // Subtono cálido ciruela/carmesí en la zona inferior izquierda (como en Screenshot 2026-10-22 212834.png)
    float bottomLeftWarmth = smoothstep(0.68, 0.0, length((q - vec2(0.24, 0.10)) * vec2(1.3, 1.5)) + n1 * 0.14);

    // Composición cromática multicapa de la malla líquida
    vec3 col = mix(u_deep, u_primary, diagCrest1);
    col = mix(col, u_primary * 1.12, leftWave * 0.65);
    col = mix(col, u_highlight, pow(topRightGlow, 1.35) * 0.88);

    // Aplicar el pliegue abisal profundo que cruza en diagonal
    col = mix(col, u_abyss, clamp(abyssalFold * 0.92, 0.0, 1.0));

    // Inyectar el matiz cálido profundo en la base izquierda
    col = mix(col, u_undertone, bottomLeftWarmth * 0.62);

    // Respuesta cromática real a las ondas de click (iridiscencia líquida en las crestas de la onda)
    col = mix(col, u_highlight, clamp(clickElevation * 0.55, 0.0, 0.65));
    col = mix(col, u_abyss, clamp(-clickElevation * 0.5, 0.0, 0.6));

    // Grano analógico sutil
    float grain = (hash(gl_FragCoord.xy + fract(u_time) * 100.0) - 0.5) * u_grainOpacity * 0.16;
    col += grain;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

export const GrainyGradient: React.FC<GrainyGradientProps> = ({
  className = '',
  grainOpacity = 0.35,
  hoverIntensity = 1.0,
  tone = 'cobalt',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetToneRef = useRef<TonePreset>(GRADIENT_TONES[tone] || GRADIENT_TONES.cobalt);

  useEffect(() => {
    targetToneRef.current = GRADIENT_TONES[tone] || GRADIENT_TONES.cobalt;
  }, [tone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Quad de pantalla completa
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uMouseVel = gl.getUniformLocation(program, 'u_mouseVel');
    const uPress = gl.getUniformLocation(program, 'u_press');
    const uGrain = gl.getUniformLocation(program, 'u_grainOpacity');
    const uAbyss = gl.getUniformLocation(program, 'u_abyss');
    const uDeep = gl.getUniformLocation(program, 'u_deep');
    const uPrimary = gl.getUniformLocation(program, 'u_primary');
    const uHighlight = gl.getUniformLocation(program, 'u_highlight');
    const uUndertone = gl.getUniformLocation(program, 'u_undertone');
    const uRipples = Array.from({ length: 8 }, (_, i) =>
      gl.getUniformLocation(program, `u_ripples[${i}]`)
    );

    // Estado de física líquida y ondas por click
    const mouse = {
      targetX: 0.5,
      targetY: 0.5,
      x: 0.5,
      y: 0.5,
      velX: 0,
      velY: 0,
      isPressed: false,
      pressStrength: 0,
    };

    interface Ripple {
      x: number;
      y: number;
      startTime: number;
      strength: number;
    }

    const ripples: Ripple[] = Array.from({ length: 8 }, () => ({
      x: 0.5,
      y: 0.5,
      startTime: -100,
      strength: 0,
    }));
    let rippleIndex = 0;

    const spawnRipple = (normX: number, normY: number, strength = 1.0) => {
      ripples[rippleIndex] = {
        x: normX,
        y: normY,
        startTime: performance.now() / 1000,
        strength,
      };
      rippleIndex = (rippleIndex + 1) % ripples.length;
    };

    // Colores actuales interpolados suavemente al cambiar de tono
    const initialPreset = targetToneRef.current;
    const currentColors = {
      abyss: [...initialPreset.abyss] as [number, number, number],
      deep: [...initialPreset.deep] as [number, number, number],
      primary: [...initialPreset.primary] as [number, number, number],
      highlight: [...initialPreset.highlight] as [number, number, number],
      undertone: [...initialPreset.undertone] as [number, number, number],
    };

    const updateSize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(container.clientWidth * dpr));
      const h = Math.max(1, Math.floor(container.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const getNormalizedCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const nx = (clientX - rect.left) / Math.max(rect.width, 1);
      // Invertir Y para coordenadas WebGL (0 abajo, 1 arriba)
      const ny = 1.0 - (clientY - rect.top) / Math.max(rect.height, 1);
      return { nx, ny, inside: nx >= -0.1 && nx <= 1.1 && ny >= -0.1 && ny <= 1.1 };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const { nx, ny, inside } = getNormalizedCoords(e.clientX, e.clientY);
      if (!inside) return;
      mouse.targetX = Math.max(0, Math.min(1, nx));
      mouse.targetY = Math.max(0, Math.min(1, ny));
    };

    const handlePointerDown = (e: PointerEvent) => {
      const { nx, ny, inside } = getNormalizedCoords(e.clientX, e.clientY);
      if (!inside) return;
      mouse.targetX = Math.max(0, Math.min(1, nx));
      mouse.targetY = Math.max(0, Math.min(1, ny));
      mouse.isPressed = true;
      // Inyectar onda de impacto real en la malla líquida al hacer click
      spawnRipple(mouse.targetX, mouse.targetY, 1.15);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!mouse.isPressed) return;
      mouse.isPressed = false;
      const { nx, ny, inside } = getNormalizedCoords(e.clientX, e.clientY);
      if (inside) {
        // Rebote elástico de la malla al soltar el click
        spawnRipple(Math.max(0, Math.min(1, nx)), Math.max(0, Math.min(1, ny)), -0.75);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    let isVisible = true;
    let animationFrameId = 0;
    const startTime = performance.now() / 1000;
    let lastTime = startTime;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const lerp3 = (
      curr: [number, number, number],
      target: [number, number, number],
      t: number
    ) => {
      curr[0] += (target[0] - curr[0]) * t;
      curr[1] += (target[1] - curr[1]) * t;
      curr[2] += (target[2] - curr[2]) * t;
    };

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const now = performance.now() / 1000;
      const dt = Math.min(now - lastTime, 0.1);
      lastTime = now;

      // Suavizado cinético del cursor y su velocidad de arrastre sobre el fluido
      const smooth = 1.0 - Math.exp(-10.0 * dt);
      const prevX = mouse.x;
      const prevY = mouse.y;
      mouse.x += (mouse.targetX - mouse.x) * smooth;
      mouse.y += (mouse.targetY - mouse.y) * smooth;

      const instVelX = (mouse.x - prevX) / Math.max(dt, 0.001);
      const instVelY = (mouse.y - prevY) / Math.max(dt, 0.001);
      mouse.velX += (instVelX * 0.12 * hoverIntensity - mouse.velX) * (1.0 - Math.exp(-8.0 * dt));
      mouse.velY += (instVelY * 0.12 * hoverIntensity - mouse.velY) * (1.0 - Math.exp(-8.0 * dt));

      const targetPress = mouse.isPressed ? 1.0 : 0.0;
      mouse.pressStrength += (targetPress - mouse.pressStrength) * (1.0 - Math.exp(-12.0 * dt));

      // Interpolar colores hacia el tono seleccionado
      const colorLerp = 1.0 - Math.exp(-5.0 * dt);
      const targetPreset = targetToneRef.current;
      lerp3(currentColors.abyss, targetPreset.abyss, colorLerp);
      lerp3(currentColors.deep, targetPreset.deep, colorLerp);
      lerp3(currentColors.primary, targetPreset.primary, colorLerp);
      lerp3(currentColors.highlight, targetPreset.highlight, colorLerp);
      lerp3(currentColors.undertone, targetPreset.undertone, colorLerp);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now - startTime);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform2f(uMouseVel, mouse.velX, mouse.velY);
      gl.uniform1f(uPress, mouse.pressStrength);
      gl.uniform1f(uGrain, grainOpacity);

      gl.uniform3fv(uAbyss, currentColors.abyss);
      gl.uniform3fv(uDeep, currentColors.deep);
      gl.uniform3fv(uPrimary, currentColors.primary);
      gl.uniform3fv(uHighlight, currentColors.highlight);
      gl.uniform3fv(uUndertone, currentColors.undertone);

      for (let i = 0; i < 8; i++) {
        const r = ripples[i];
        const age = r.startTime < 0 ? 99.0 : now - r.startTime;
        if (uRipples[i]) {
          gl.uniform4f(uRipples[i], r.x, r.y, age, r.strength);
        }
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [grainOpacity, hoverIntensity]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-screen overflow-hidden select-none ${
        tone === 'silver' ? 'bg-[#eef2f6]' : 'bg-[#02040c]'
      } ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};

export default GrainyGradient;
