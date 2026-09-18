import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Mesh, WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Points, Clock, Raycaster, Vector2, Vector3, Matrix4 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export interface ContactModelHandle {
  switchModel: (id: string) => void;
}

interface ContactModelProps {
  initialModel?: string;
}

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
const PARTICLE_COUNT = IS_MOBILE ? 8000 : 60000;
const PIXEL_RATIO = IS_MOBILE ? 1 : Math.min(window.devicePixelRatio, 2);

// ─── Sample random points uniformly on triangle surfaces ───
type V3 = [number, number, number];
type Triangle = [V3, V3, V3];

function triangleArea(a: V3, b: V3, c: V3): number {
  const abx = b[0]-a[0], aby = b[1]-a[1], abz = b[2]-a[2];
  const acx = c[0]-a[0], acy = c[1]-a[1], acz = c[2]-a[2];
  const cx = aby*acz - abz*acy;
  const cy = abz*acx - abx*acz;
  const cz = abx*acy - aby*acx;
  return 0.5 * Math.sqrt(cx*cx + cy*cy + cz*cz);
}

function sampleTriangles(faces: Triangle[], count: number, scale: number): Float32Array {
  // Compute cumulative area for weighted sampling
  const areas = faces.map(([a,b,c]) => triangleArea(a,b,c));
  const totalArea = areas.reduce((s,a) => s+a, 0);
  const cumulative: number[] = [];
  let sum = 0;
  for (const a of areas) { sum += a; cumulative.push(sum / totalArea); }

  const homes = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Pick triangle weighted by area
    const r = Math.random();
    let fi = 0;
    for (fi = 0; fi < cumulative.length - 1; fi++) {
      if (r <= cumulative[fi]) break;
    }
    const [a, b, c] = faces[fi];

    // Random point on triangle (uniform barycentric)
    let r1 = Math.random(), r2 = Math.random();
    if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
    const r3 = 1 - r1 - r2;

    homes[i*3]   = (a[0]*r3 + b[0]*r1 + c[0]*r2) * scale + (Math.random()-0.5)*0.002;
    homes[i*3+1] = (a[1]*r3 + b[1]*r1 + c[1]*r2) * scale + (Math.random()-0.5)*0.002;
    homes[i*3+2] = (a[2]*r3 + b[2]*r1 + c[2]*r2) * scale + (Math.random()-0.5)*0.002;
  }
  return homes;
}

// ─── Telegram paper airplane geometry (chunky 3D) ───
function generateTelegramPlane(): Float32Array {
  // Thick, solid paper airplane like the Telegram 3D logo
  // Top = peaked ridge along center, wings slope down
  // Bottom = flat
  // Prominent side walls give it real volume

  // ── Top surface — peaked spine ──
  const tNose: V3 = [ 0,    0.15, -1.8 ];   // nose tip (slightly raised)
  const spine1:V3 = [ 0,    0.9,  -0.5 ];   // spine front peak
  const spine2:V3 = [ 0,    0.95,  0.3 ];   // spine mid peak (highest)
  const spine3:V3 = [ 0,    0.8,   0.9 ];   // spine back

  const wR1:   V3 = [ 1.6,  0.0,   0.0 ];   // right wing mid
  const wR2:   V3 = [ 1.3,  0.0,   0.7 ];   // right wing back
  const wL1:   V3 = [-1.6,  0.0,   0.0 ];   // left wing mid
  const wL2:   V3 = [-1.3,  0.0,   0.7 ];   // left wing back

  const tailR:  V3 = [ 0.35, 0.5,  1.4 ];   // tail tip right
  const tailL:  V3 = [-0.35, 0.5,  1.4 ];   // tail tip left
  const tailN:  V3 = [ 0,    0.65, 1.0 ];   // tail notch (V center)

  // ── Bottom surface — flat ──
  const bNose:  V3 = [ 0,   -0.15, -1.8 ];
  const bMid1:  V3 = [ 0,   -0.2,  -0.5 ];
  const bMid2:  V3 = [ 0,   -0.2,   0.3 ];
  const bBack:  V3 = [ 0,   -0.15,  0.9 ];

  const bwR1:   V3 = [ 1.6, -0.12,  0.0 ];
  const bwR2:   V3 = [ 1.3, -0.12,  0.7 ];
  const bwL1:   V3 = [-1.6, -0.12,  0.0 ];
  const bwL2:   V3 = [-1.3, -0.12,  0.7 ];

  const btailR: V3 = [ 0.35,-0.05,  1.4 ];
  const btailL: V3 = [-0.35,-0.05,  1.4 ];
  const btailN: V3 = [ 0,   -0.1,   1.0 ];

  const faces: Triangle[] = [
    // ══ TOP — right wing (sloping from spine down to wing edge) ══
    [tNose, spine1, wR1],
    [spine1, spine2, wR1],
    [spine2, wR2, wR1],
    [spine2, spine3, wR2],
    // top right tail
    [spine3, tailR, wR2],
    [spine3, tailN, tailR],

    // ══ TOP — left wing ══
    [tNose, wL1, spine1],
    [spine1, wL1, spine2],
    [spine2, wL1, wL2],
    [spine2, wL2, spine3],
    // top left tail
    [spine3, wL2, tailL],
    [spine3, tailL, tailN],

    // ══ BOTTOM — right ══
    [bNose, bwR1, bMid1],
    [bMid1, bwR1, bMid2],
    [bMid2, bwR1, bwR2],
    [bMid2, bwR2, bBack],
    [bBack, bwR2, btailR],
    [bBack, btailR, btailN],

    // ══ BOTTOM — left ══
    [bNose, bMid1, bwL1],
    [bMid1, bMid2, bwL1],
    [bMid2, bwL2, bwL1],
    [bMid2, bBack, bwL2],
    [bBack, btailL, bwL2],
    [bBack, btailN, btailL],

    // ══ SIDE WALLS — right edge ══
    [tNose, wR1, bwR1],  [tNose, bwR1, bNose],
    [wR1, wR2, bwR2],    [wR1, bwR2, bwR1],
    [wR2, tailR, btailR], [wR2, btailR, bwR2],

    // ══ SIDE WALLS — left edge ══
    [tNose, bwL1, wL1],  [tNose, bNose, bwL1],
    [wL1, bwL1, bwL2],   [wL1, bwL2, wL2],
    [wL2, bwL2, btailL], [wL2, btailL, tailL],

    // ══ TAIL BACK WALL ══
    [tailR, tailN, btailN], [tailR, btailN, btailR],
    [tailN, tailL, btailL], [tailN, btailL, btailN],

    // ══ NOSE TIP ══
    [tNose, bNose, bwR1],   // right nose face
    [tNose, bwL1, bNose],   // left nose face
  ];

  // Rotate: tilt to show volume (like 3/4 view from reference)
  const ax = -0.45;  // tilt nose down → see top surface
  const ay =  0.3;   // turn slightly right
  const cosX = Math.cos(ax), sinX = Math.sin(ax);
  const cosY = Math.cos(ay), sinY = Math.sin(ay);

  function rot(v: V3): V3 {
    const [x, y, z] = v;
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;
    return [x2, y1, z2];
  }

  const rotated: Triangle[] = faces.map(([a, b, c]) => [rot(a), rot(b), rot(c)]);

  return sampleTriangles(rotated, PARTICLE_COUNT, 0.3);
}

// ─── Extract surface points from GLB ───
function extractSurface(gltf: any): Float32Array {
  const sv: number[] = [];
  gltf.scene.traverse((child: any) => {
    if (child instanceof Mesh && child.geometry) {
      const pos = child.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        sv.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      }
    }
  });

  let minX = Infinity, maxX = -Infinity,
      minY = Infinity, maxY = -Infinity,
      minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < sv.length; i += 3) {
    minX = Math.min(minX, sv[i]);   maxX = Math.max(maxX, sv[i]);
    minY = Math.min(minY, sv[i+1]); maxY = Math.max(maxY, sv[i+1]);
    minZ = Math.min(minZ, sv[i+2]); maxZ = Math.max(maxZ, sv[i+2]);
  }
  const cx = (minX+maxX)/2, cy = (minY+maxY)/2, cz = (minZ+maxZ)/2;
  const maxDim = Math.max(maxX-minX, maxY-minY, maxZ-minZ);
  const scale = 1.2 / maxDim;
  const surfCount = sv.length / 3;

  const homes = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const vi = Math.floor(Math.random() * surfCount);
    homes[i*3]   = (sv[vi*3]  -cx)*scale + (Math.random()-0.5)*0.003;
    homes[i*3+1] = -((sv[vi*3+1]-cy)*scale) + (Math.random()-0.5)*0.003;
    homes[i*3+2] = (sv[vi*3+2]-cz)*scale + (Math.random()-0.5)*0.003;
  }
  return homes;
}

// ─── Component ───
const ContactModel = forwardRef<ContactModelHandle, ContactModelProps>(({ initialModel = '/tg.glb' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const homesRef = useRef<Float32Array | null>(null);
  const targetHomesRef = useRef<Float32Array | null>(null);
  const transitionRef = useRef(0);
  const loaderRef = useRef(new GLTFLoader());

  useImperativeHandle(ref, () => ({
    switchModel: (id: string) => {
      if (id === 'telegram') {
        // Generate procedural airplane
        const newHomes = generateTelegramPlane();
        targetHomesRef.current = newHomes;
        transitionRef.current = 0;
      } else {
        // Load GLB file
        loaderRef.current.load(id, (gltf) => {
          const newHomes = extractSurface(gltf);
          targetHomesRef.current = newHomes;
          transitionRef.current = 0;
        });
      }
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(PIXEL_RATIO);
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, w / h, 0.01, 100);
    camera.position.set(0, 0, 3.5);
    camera.lookAt(0, 0, 0);

    let mx = 9999, my = 9999;
    function setPointer(clientX: number, clientY: number) {
      const rect = container!.getBoundingClientRect();
      mx = ((clientX - rect.left) / rect.width - 0.5) * 2;
      my = -((clientY - rect.top) / rect.height - 0.5) * 2;
    }
    function onMouseMove(e: MouseEvent) { setPointer(e.clientX, e.clientY); }
    function onMouseLeave() { mx = 9999; my = 9999; }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
    function onTouchEnd() { mx = 9999; my = 9999; }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);

    let animId: number;
    let disposed = false;

    loaderRef.current.load(initialModel, (gltf) => {
      if (disposed) return;

      const homes = extractSurface(gltf);
      homesRef.current = homes;

      // Positions = home positions (particles spring back to these on GPU)
      const positions = new Float32Array(homes);
      const homeAttr = new Float32Array(homes);
      const randoms = new Float32Array(PARTICLE_COUNT);
      for (let i = 0; i < PARTICLE_COUNT; i++) randoms[i] = Math.random();

      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(positions, 3));
      geometry.setAttribute('aRandom',  new BufferAttribute(randoms, 1));

      // CPU-side physics arrays (like Hero spring model)
      const velocities = new Float32Array(PARTICLE_COUNT * 3);
      const mouseRadius = 1.2;
      const mouseForce = 0.07;

      const material = new ShaderMaterial({
        transparent: true, depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime:       { value: 0 },
          uPixelRatio: { value: PIXEL_RATIO },
          uMouse:      { value: new Vector3(9999, 9999, 9999) },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uPixelRatio;
          uniform vec3 uMouse;
          attribute float aRandom;
          varying float vGlow;
          varying float vAlpha;

          void main() {
            vec3 pos = position;

            // Mouse glow (visual only — repulsion is CPU-side)
            vec3 diff = pos - uMouse;
            float dist = length(diff);
            vGlow = smoothstep(0.6, 0.0, dist);

            float baseSize = mix(4.5, 2.4, aRandom);
            float size = (baseSize + vGlow * 2.4) * uPixelRatio;
            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size;
            gl_Position = projectionMatrix * mvPos;
            vAlpha = mix(0.55, 0.25, aRandom) + vGlow * 0.45;
          }
        `,
        fragmentShader: `
          varying float vGlow;
          varying float vAlpha;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
            vec3 base = vec3(0.5, 0.53, 0.6);
            vec3 hot = vec3(1.0, 0.55, 0.1);
            vec3 col = mix(base, hot, vGlow);
            col += hot * exp(-d * 3.0) * vGlow * 0.8;
            gl_FragColor = vec4(col, alpha);
          }
        `,
      });

      const points = new Points(geometry, material);
      scene.add(points);

      const clock = new Clock();
      const raycaster = new Raycaster();
      const mouseNDC = new Vector2();

      function animate() {
        if (disposed) return;
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        material.uniforms.uTime.value = t;
        points.rotation.y = t * 0.4;

        // --- Model transition — blend home positions ---
        if (targetHomesRef.current && homesRef.current) {
          transitionRef.current = Math.min(1, transitionRef.current + 0.02);
          const p = transitionRef.current;
          const oldH = homesRef.current;
          const newH = targetHomesRef.current;
          for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            homeAttr[i] = oldH[i] + (newH[i] - oldH[i]) * p;
          }
          if (p >= 1) {
            homesRef.current = new Float32Array(targetHomesRef.current);
            targetHomesRef.current = null;
          }
        }

        // Mouse → local space
        mouseNDC.set(mx, my);
        raycaster.setFromCamera(mouseNDC, camera);
        const dir = raycaster.ray.direction.clone();
        const orig = raycaster.ray.origin.clone();
        const planeNormal = camera.getWorldDirection(new Vector3());
        const denom = planeNormal.dot(dir);
        const tVal = denom !== 0 ? -(planeNormal.dot(orig)) / denom : 0;
        const mouseWorld = orig.add(dir.multiplyScalar(Math.max(0, tVal)));
        const invMat = new Matrix4().copy(points.matrixWorld).invert();
        const localMouse = mouseWorld.applyMatrix4(invMat);
        material.uniforms.uMouse.value.copy(localMouse);

        // --- CPU spring physics with mouse repulsion (like Hero) ---
        const pos = geometry.attributes.position as BufferAttribute;
        const mlx = localMouse.x, mly = localMouse.y, mlz = localMouse.z;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const ix = i * 3, iy = ix + 1, iz = ix + 2;

          // Target = home + idle wobble
          const phase = randoms[i] * 6.283;
          const tx = homeAttr[ix] + Math.sin(t * 0.7 + phase) * 0.008;
          const ty = homeAttr[iy] + Math.cos(t * 0.9 + phase * 1.3) * 0.008;
          const tz = homeAttr[iz] + Math.sin(t * 0.5 + phase * 0.7) * 0.008;

          // Spring toward target
          let ax = (tx - positions[ix]) * 0.04;
          let ay = (ty - positions[iy]) * 0.04;
          let az = (tz - positions[iz]) * 0.04;

          // Mouse repulsion (3D)
          const dx = positions[ix] - mlx;
          const dy = positions[iy] - mly;
          const dz = positions[iz] - mlz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * mouseForce;
            const invDist = 1 / (dist + 0.001);
            ax += dx * invDist * force;
            ay += dy * invDist * force;
            az += dz * invDist * force + (Math.random() - 0.5) * force * 0.3;
          }

          // Velocity + damping
          velocities[ix] = (velocities[ix] + ax) * 0.88;
          velocities[iy] = (velocities[iy] + ay) * 0.88;
          velocities[iz] = (velocities[iz] + az) * 0.88;

          positions[ix] += velocities[ix];
          positions[iy] += velocities[iy];
          positions[iz] += velocities[iz];
        }

        pos.needsUpdate = true;
        renderer.render(scene, camera);
      }
      animate();
    });

    function onResize() {
      const cw = container!.clientWidth;
      const ch = container!.clientHeight;
      renderer.setSize(cw, ch);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="contact-model" />;
});

ContactModel.displayName = 'ContactModel';
export default ContactModel;
