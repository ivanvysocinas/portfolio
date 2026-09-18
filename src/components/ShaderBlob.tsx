import { useEffect, useRef } from 'react';
import {
  WebGLRenderer, Scene, PerspectiveCamera,
  IcosahedronGeometry, TorusGeometry,
  ShaderMaterial, MeshBasicMaterial, Mesh,
  AmbientLight, PointLight, Vector2, Clock, FrontSide,
} from 'three';

export default function ShaderBlob() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wait a frame so container has real dimensions
    const w = container.clientWidth || 500;
    const h = container.clientHeight || 400;

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Scene + Camera
    const scene = new Scene();
    const camera = new PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.z = 5;

    // Blob — bigger, lower detail for perf
    const geo = new IcosahedronGeometry(1.3, 16);
    const mat = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0, 0) },
        uHover: { value: 0 },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying float vDisp;

        // Simplex-style 3D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314*r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g, l.zxy);
          vec3 i2 = max(g, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0*floor(p*ns.z*ns.z);
          vec4 x_ = floor(j*ns.z);
          vec4 y_ = floor(j - 7.0*x_);
          vec4 x2_ = x_*ns.x + ns.yyyy;
          vec4 y2_ = y_*ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x2_) - abs(y2_);
          vec4 b0 = vec4(x2_.xy, y2_.xy);
          vec4 b1 = vec4(x2_.zw, y2_.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
          m = m*m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }

        void main() {
          float t = uTime * 0.4;

          // Multi-octave displacement
          float n1 = snoise(position * 1.5 + t) * 0.25;
          float n2 = snoise(position * 3.0 - t * 0.7) * 0.1;
          float n3 = snoise(position * 5.0 + t * 1.3) * 0.04;

          // Mouse: stretch surface TOWARD cursor position
          vec3 mouseWorld = vec3(uMouse * 1.5, 0.0);
          vec3 toMouse = mouseWorld - position;
          float mouseDist = length(toMouse);
          float mouseInfluence = smoothstep(2.5, 0.0, mouseDist) * uHover;

          // Pull vertices toward mouse — closer vertices get pulled more
          vec3 stretch = normalize(toMouse) * mouseInfluence * 0.5;

          float disp = n1 + n2 + n3;
          vDisp = disp + mouseInfluence * 0.2;

          vec3 newPos = position + normal * disp + stretch;
          vNormal = normalize(normalMatrix * normal);
          vWorldPos = (modelMatrix * vec4(newPos, 1.0)).xyz;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uHover;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying float vDisp;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos);

          // Fresnel rim
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);

          // Base colors: dark amber interior → bright orange rim
          vec3 coreColor = vec3(0.4, 0.15, 0.02);      // deep brown-amber
          vec3 midColor = vec3(0.9, 0.45, 0.05);        // orange
          vec3 rimColor = vec3(1.0, 0.7, 0.2);          // bright amber

          // Mix based on displacement + fresnel
          float dispNorm = smoothstep(-0.2, 0.3, vDisp);
          vec3 color = mix(coreColor, midColor, dispNorm);
          color = mix(color, rimColor, fresnel);

          // Pulse glow
          float pulse = sin(uTime * 1.2 + vWorldPos.y * 4.0) * 0.5 + 0.5;
          color += rimColor * fresnel * 0.6 * (0.7 + pulse * 0.3);

          // Hover brightens everything
          color += vec3(0.15, 0.08, 0.01) * uHover * fresnel;

          // Subtle subsurface scatter
          float sss = pow(max(dot(viewDir, -vNormal), 0.0), 3.0) * 0.12;
          color += vec3(1.0, 0.5, 0.1) * sss;

          float alpha = 0.85 + fresnel * 0.15;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: FrontSide,
    });

    const blob = new Mesh(geo, mat);
    scene.add(blob);

    // Wireframe overlay
    const wireGeo = new IcosahedronGeometry(1.22, 16);
    const wireMat = new MeshBasicMaterial({
      color: 0xe8860c,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
    });
    const wire = new Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Ambient light ring (subtle)
    const ringGeo = new TorusGeometry(1.8, 0.005, 8, 80);
    const ringMat = new MeshBasicMaterial({
      color: 0xe8860c,
      transparent: true,
      opacity: 0.15,
    });
    const ring = new Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.5;
    scene.add(ring);

    // Lights
    scene.add(new AmbientLight(0x332200, 0.3));
    const keyLight = new PointLight(0xffaa44, 2, 10);
    keyLight.position.set(2, 2, 3);
    scene.add(keyLight);
    const rimLight = new PointLight(0xff6600, 1, 10);
    rimLight.position.set(-2, -1, -2);
    scene.add(rimLight);

    // Mouse — target (instant) vs smoothed (lerped each frame)
    let targetMx = 0, targetMy = 0, targetHover = 0;
    let smoothMx = 0, smoothMy = 0, smoothHover = 0;

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      targetMx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMy = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    function onEnter() { targetHover = 1; }
    function onLeave() { targetHover = 0; targetMx = 0; targetMy = 0; }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    // Animate
    const clock = new Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Fast stretch in, slow retract out
      const lerpIn = 0.12;
      const lerpOut = 0.025;
      const hLerp = targetHover > smoothHover ? lerpIn : lerpOut;
      const mLerp = targetHover > 0.5 ? lerpIn : lerpOut;

      smoothHover += (targetHover - smoothHover) * hLerp;
      smoothMx += (targetMx - smoothMx) * mLerp;
      smoothMy += (targetMy - smoothMy) * mLerp;

      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.set(smoothMx, smoothMy);
      mat.uniforms.uHover.value = smoothHover;

      blob.rotation.y = t * 0.15;
      blob.rotation.x = Math.sin(t * 0.1) * 0.15;

      wire.rotation.y = -t * 0.08;
      wire.rotation.x = Math.cos(t * 0.07) * 0.1;

      ring.rotation.z = t * 0.05;

      renderer.render(scene, camera);
    }

    animate();

    // Resize
    function onResize() {
      const cw = container!.clientWidth;
      const ch = container!.clientHeight;
      renderer.setSize(cw, ch);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      geo.dispose();
      mat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="shader-blob" />;
}
