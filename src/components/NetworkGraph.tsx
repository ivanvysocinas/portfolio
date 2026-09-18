import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  label: string;
}

const LABELS = [
  'React', 'TypeScript', 'Node.js', 'Design', 'Strategy',
  'Cloud', 'AI/ML', 'Mobile', 'DevOps', 'UX',
  'APIs', 'Scale', 'Security', 'Data',
];

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    let w = parent.clientWidth;
    let h = parent.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    // Create nodes
    const nodes: Node[] = LABELS.map((label, i) => {
      const angle = (i / LABELS.length) * Math.PI * 2;
      const dist = 80 + Math.random() * 100;
      const cx = w / 2, cy = h / 2;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      return {
        x, y,
        vx: 0, vy: 0,
        baseX: x, baseY: y,
        radius: 3 + Math.random() * 2,
        label,
      };
    });

    // Connection threshold
    const CONNECT_DIST = 180;

    // Mouse
    let mx = -9999, my = -9999;
    const MOUSE_RADIUS = 150;
    const MOUSE_FORCE = 0.04;

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }
    function onMouseLeave() { mx = -9999; my = -9999; }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    let animId: number;
    let time = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      time += 0.016;

      ctx.clearRect(0, 0, w, h);

      // Update nodes
      for (const node of nodes) {
        // Gentle idle float
        const fx = Math.sin(time * 0.5 + node.baseX * 0.01) * 0.3;
        const fy = Math.cos(time * 0.4 + node.baseY * 0.01) * 0.3;

        // Spring back to base
        const dx = node.baseX - node.x;
        const dy = node.baseY - node.y;
        node.vx += dx * 0.008 + fx;
        node.vy += dy * 0.008 + fy;

        // Mouse attraction
        const mdx = mx - node.x;
        const mdy = my - node.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS && mDist > 1) {
          node.vx += (mdx / mDist) * MOUSE_FORCE * (1 - mDist / MOUSE_RADIUS);
          node.vy += (mdy / mDist) * MOUSE_FORCE * (1 - mDist / MOUSE_RADIUS);
        }

        // Damping
        node.vx *= 0.92;
        node.vy *= 0.92;

        node.x += node.vx;
        node.y += node.vy;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(232, 134, 12, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Mouse connections — lines from cursor to nearby nodes
      if (mx > 0) {
        for (const node of nodes) {
          const dx = mx - node.x;
          const dy = my - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const alpha = (1 - dist / MOUSE_RADIUS) * 0.35;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(232, 134, 12, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        // Mouse dot
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 134, 12, 0.5)';
        ctx.fill();
      }

      // Draw nodes
      for (const node of nodes) {
        // Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 134, 12, 0.04)';
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 134, 12, 0.7)';
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 166, 35, 0.9)';
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(200, 200, 210, 0.5)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 16);
      }
    }

    animate();

    function onResize() {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx.scale(dpr, dpr);

      // Re-center nodes
      const cx = w / 2, cy = h / 2;
      nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * Math.PI * 2;
        const dist = 80 + (node.radius - 3) * 50;
        node.baseX = cx + Math.cos(angle) * dist;
        node.baseY = cy + Math.sin(angle) * dist;
      });
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-canvas" />;
}
