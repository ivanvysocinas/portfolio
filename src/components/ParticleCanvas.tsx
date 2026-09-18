import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';

interface Props {
  text?: string;
  fontSize?: number;
  particleCount?: number;
}

export default function ParticleCanvas({
  text = 'IV',
  fontSize = 160,
  particleCount = 8000,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---- Renderer ----
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ---- Scene + Camera ----
    const scene = new Scene();
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 5;
    const camera = new OrthographicCamera(
      -frustumSize * aspect,
      frustumSize * aspect,
      frustumSize,
      -frustumSize,
      0.1,
      100,
    );
    camera.position.z = 10;

    // ---- Sample text pixels from offscreen canvas ----
    function sampleTextPositions(): Float32Array {
      // Use a small fixed-size canvas to avoid ClearType subpixel noise
      const offCanvas = document.createElement('canvas');
      const cw = 1024;
      const ch = 512;
      offCanvas.width = cw;
      offCanvas.height = ch;

      const ctx = offCanvas.getContext('2d', { willReadFrequently: true })!;

      // Clear to black
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);

      // Draw white text
      const scaledFont = Math.round(fontSize * (cw / container!.clientWidth));
      ctx.font = `800 ${scaledFont}px Inter, sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, cw / 2, ch * 0.35);

      const imageData = ctx.getImageData(0, 0, cw, ch);
      const pixels = imageData.data;

      // Strict check: average of R+G+B must be > 200 to avoid ClearType artifacts
      const allPositions: [number, number][] = [];

      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const i = (y * cw + x) * 4;
          const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          if (avg > 200) {
            const wx = ((x / cw) - 0.5) * frustumSize * 2 * aspect;
            const wy = (0.5 - (y / ch)) * frustumSize * 2;
            allPositions.push([wx, wy]);
          }
        }
      }

      const result = new Float32Array(particleCount * 3);
      if (allPositions.length === 0) return result;

      for (let i = 0; i < particleCount; i++) {
        const srcIdx = Math.floor((i / particleCount) * allPositions.length);
        const src = allPositions[Math.min(srcIdx, allPositions.length - 1)];
        result[i * 3] = src[0] + (Math.random() - 0.5) * 0.02;
        result[i * 3 + 1] = src[1] + (Math.random() - 0.5) * 0.02;
        result[i * 3 + 2] = 0;
      }

      return result;
    }

    // ---- Build particles ----
    let targetPositions = sampleTextPositions();

    const currentPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const randomOffsets = new Float32Array(particleCount);

    // Start particles already in text shape
    for (let i = 0; i < particleCount; i++) {
      currentPositions[i * 3] = targetPositions[i * 3];
      currentPositions[i * 3 + 1] = targetPositions[i * 3 + 1];
      currentPositions[i * 3 + 2] = 0;
      randomOffsets[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(currentPositions, 3));

    // Custom shader for warm particles
    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aOffset;
        varying float vAlpha;

        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          float size = 3.75 * uPixelRatio;

          // Vary size slightly
          size *= 0.7 + 0.3 * sin(uTime * 0.5 + position.x * 10.0);

          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPos;

          // Depth-based alpha
          vAlpha = 0.6 + 0.4 * sin(uTime + position.y * 3.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;

        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;

          float alpha = smoothstep(0.5, 0.1, d) * vAlpha;

          // Warm gradient: amber core, orange edge
          vec3 color = mix(
            vec3(1.0, 0.65, 0.2),   // orange
            vec3(1.0, 0.85, 0.5),   // amber/gold
            smoothstep(0.3, 0.0, d)
          );

          gl_FragColor = vec4(color, alpha * 0.8);
        }
      `,
    });

    geometry.setAttribute('aOffset', new BufferAttribute(randomOffsets, 1));
    const points = new Points(geometry, material);
    scene.add(points);

    // ---- Mouse tracking ----
    const mouseWorld = new Vector2(9999, 9999);
    const mouseRadius = 1.5;
    const mouseForce = 0.08;

    function pointerToWorld(clientX: number, clientY: number) {
      const rect = container!.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width - 0.5) * frustumSize * 2 * aspect;
      const ny = (0.5 - (clientY - rect.top) / rect.height) * frustumSize * 2;
      mouseWorld.set(nx, ny);
    }

    function onMouseMove(e: MouseEvent) {
      pointerToWorld(e.clientX, e.clientY);
    }
    function onMouseLeave() {
      mouseWorld.set(9999, 9999);
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        pointerToWorld(e.touches[0].clientX, e.touches[0].clientY);
      }
    }
    function onTouchEnd() {
      mouseWorld.set(9999, 9999);
    }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);

    // ---- Animation ----
    const clock = new Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;

      const pos = geometry.attributes.position as BufferAttribute;

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const iy = ix + 1;
        const iz = ix + 2;

        let tx = targetPositions[ix];
        let ty = targetPositions[iy];

        // Subtle idle floating
        tx += Math.sin(t * 0.3 + randomOffsets[i] * 6.28) * 0.03;
        ty += Math.cos(t * 0.4 + randomOffsets[i] * 3.14) * 0.03;

        // Spring toward target
        let ax = (tx - currentPositions[ix]) * 0.04;
        let ay = (ty - currentPositions[iy]) * 0.04;
        let az = (0 - currentPositions[iz]) * 0.04;

        // Mouse repulsion
        const dx = currentPositions[ix] - mouseWorld.x;
        const dy = currentPositions[iy] - mouseWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (1 - dist / mouseRadius) * mouseForce;
          const ndx = dx / (dist + 0.001);
          const ndy = dy / (dist + 0.001);
          ax += ndx * force;
          ay += ndy * force;
          az += (Math.random() - 0.5) * force * 0.5;
        }

        // Apply velocity with damping
        velocities[ix] = (velocities[ix] + ax) * 0.88;
        velocities[iy] = (velocities[iy] + ay) * 0.88;
        velocities[iz] = (velocities[iz] + az) * 0.88;

        currentPositions[ix] += velocities[ix];
        currentPositions[iy] += velocities[iy];
        currentPositions[iz] += velocities[iz];
      }

      pos.array = currentPositions;
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    // ---- Resize ----
    function onResize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      const a = w / h;

      renderer.setSize(w, h);
      camera.left = -frustumSize * a;
      camera.right = frustumSize * a;
      camera.top = frustumSize;
      camera.bottom = -frustumSize;
      camera.updateProjectionMatrix();

      // Re-sample text positions for new size
      targetPositions = sampleTextPositions();
    }

    window.addEventListener('resize', onResize);

    // ---- Cleanup ----
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [text, fontSize, particleCount]);

  return <div ref={containerRef} className="particle-canvas" />;
}
