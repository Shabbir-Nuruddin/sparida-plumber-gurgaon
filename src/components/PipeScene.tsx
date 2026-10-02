import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PresentationControls } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const WATER = new THREE.Color("#42c6ff");
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const PIPE_Y = 0.8;
const FLOOR_Y = -2.35;
const R = 0.26;

function Chrome({ dim = false }: { dim?: boolean }) {
  return <meshStandardMaterial color={dim ? "#9a9a97" : "#e6edf5"} metalness={0.95} roughness={dim ? 0.38 : 0.2} envMapIntensity={dim ? 0.9 : 2} />;
}

function Tube({ curve, radius = R, dim }: { curve: THREE.Curve<THREE.Vector3>; radius?: number; dim?: boolean }) {
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 96, radius, 40, false), [curve, radius]);
  return (
    <mesh geometry={geo}>
      <Chrome dim={dim} />
    </mesh>
  );
}

/** Hex nut whose axis runs along x. */
function Nut({ x, y = PIPE_Y, z = 0, r = 0.4, len = 0.22 }: { x: number; y?: number; z?: number; r?: number; len?: number }) {
  return (
    <mesh position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, len, 6]} />
      <Chrome />
    </mesh>
  );
}

/** Lime-plastered wall the pipes are fixed to; texture is generated, not a gradient. */
function Wall() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#7a7671";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 2 + Math.random() * 22;
      const l = 95 + Math.random() * 40;
      g.fillStyle = `rgba(${l},${l - 3},${l - 7},${0.04 + Math.random() * 0.06})`;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
    const img = g.getImageData(0, 0, 512, 512);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 22;
      img.data[i] += n;
      img.data[i + 1] += n;
      img.data[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(5, 3);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[-1, 0, -3]}>
      <planeGeometry args={[40, 24]} />
      <meshStandardMaterial map={tex} bumpMap={tex} bumpScale={0.6} roughness={0.96} metalness={0} envMapIntensity={0.15} />
    </mesh>
  );
}

function Pipework() {
  const { main, outlet, back, riser } = useMemo(() => {
    const main = new THREE.LineCurve3(new THREE.Vector3(-7, PIPE_Y, 0), new THREE.Vector3(0, PIPE_Y, 0));
    const outlet = new THREE.CurvePath<THREE.Vector3>();
    outlet.add(new THREE.LineCurve3(new THREE.Vector3(0, PIPE_Y, 0), new THREE.Vector3(0.9, PIPE_Y, 0)));
    outlet.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.9, PIPE_Y, 0),
        new THREE.Vector3(1.5, PIPE_Y, 0),
        new THREE.Vector3(1.5, PIPE_Y - 0.6, 0),
      ),
    );
    outlet.add(new THREE.LineCurve3(new THREE.Vector3(1.5, PIPE_Y - 0.6, 0), new THREE.Vector3(1.5, -6, 0)));
    const back = new THREE.LineCurve3(new THREE.Vector3(-8, 2.1, -2.6), new THREE.Vector3(6, 2.1, -2.6));
    const riser = new THREE.LineCurve3(new THREE.Vector3(-3.6, -6, -1.4), new THREE.Vector3(-3.6, 6, -1.4));
    return { main, outlet, back, riser };
  }, []);

  return (
    <group>
      <Tube curve={main} />
      <Tube curve={outlet} />
      <Tube curve={back} radius={0.18} dim />
      <Tube curve={riser} radius={0.2} dim />
      {/* the leaking coupling */}
      <mesh position={[0, PIPE_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.34, 0.62, 48]} />
        <Chrome />
      </mesh>
      <Nut x={-0.38} />
      <Nut x={0.38} />
      <Nut x={1.5} y={-1.9} r={0.36} />
      {/* wall brackets */}
      {[-5.2, -3.6].map((x) => (
        <mesh key={x} position={[x, PIPE_Y, -0.2]}>
          <boxGeometry args={[0.14, 0.7, 0.5]} />
          <Chrome dim />
        </mesh>
      ))}
    </group>
  );
}

function Valve({ progress }: { progress: MotionValue<number> }) {
  const wheel = useRef<THREE.Group>(null);
  useFrame(() => {
    if (wheel.current) wheel.current.rotation.z = -smooth(0.5, 0.74, progress.get()) * Math.PI * 3;
  });
  return (
    <group position={[-2.3, PIPE_Y, 0]}>
      <mesh>
        <sphereGeometry args={[0.42, 48, 32]} />
        <Chrome />
      </mesh>
      <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.8, 16]} />
        <Chrome />
      </mesh>
      <group ref={wheel} position={[0, 0, 0.95]}>
        <mesh>
          <torusGeometry args={[0.5, 0.055, 16, 64]} />
          <meshStandardMaterial color="#42c6ff" metalness={0.5} roughness={0.3} emissive="#0b7fb8" emissiveIntensity={0.35} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
            <boxGeometry args={[1, 0.06, 0.06]} />
            <Chrome />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 24]} />
          <Chrome />
        </mesh>
      </group>
    </group>
  );
}

function Clamp({ progress }: { progress: MotionValue<number> }) {
  const g = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const t = smooth(0.6, 0.8, progress.get());
    if (g.current) {
      g.current.position.x = THREE.MathUtils.lerp(-1.25, 0, t);
      g.current.visible = t > 0.001;
    }
    if (mat.current) mat.current.emissiveIntensity = t * 0.5;
  });
  return (
    <group ref={g} position={[-1.25, PIPE_Y, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.39, 0.39, 0.5, 48, 1, true]} />
        <meshStandardMaterial ref={mat} side={THREE.DoubleSide} color="#b9b9b6" metalness={0.9} roughness={0.25} emissive="#42c6ff" emissiveIntensity={0} />
      </mesh>
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]}>
          <boxGeometry args={[0.08, 0.14, 0.2]} />
          <Chrome />
        </mesh>
      ))}
    </group>
  );
}

type Drop = { p: THREE.Vector3; v: THREE.Vector3; alive: boolean; size: number };

function Water({ progress, count, spark }: { progress: MotionValue<number>; count: number; spark: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const puddle = useRef<THREE.Mesh>(null);
  const puddleMat = useRef<THREE.MeshStandardMaterial>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const ringState = useMemo(() => Array.from({ length: 10 }, () => ({ t: 1, x: 0, z: 0 })), []);
  const drops = useMemo<Drop[]>(
    () => Array.from({ length: count }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), alive: false, size: 0.03 })),
    [count],
  );
  const state = useRef({ emit: 0, drip: 0, wet: 0.55, ring: 0 });
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const spawn = (kind: "spray" | "drip") => {
    const d = drops.find((x) => !x.alive);
    if (!d) return;
    d.alive = true;
    if (kind === "spray" && spark) {
      // sparks off the coupling: faster, finer, flung in every direction
      const a = Math.random() * Math.PI * 2;
      const sp = 2.5 + Math.random() * 3;
      d.p.set((Math.random() - 0.5) * 0.1, PIPE_Y + 0.2, 0.3);
      d.v.set(Math.cos(a) * sp, Math.abs(Math.sin(a)) * sp * 0.9 + 0.6, 0.6 + Math.random() * 0.8);
      d.size = 0.008 + Math.random() * 0.01;
    } else if (kind === "spray") {
      d.p.set((Math.random() - 0.5) * 0.12, PIPE_Y + 0.3, 0.12 + Math.random() * 0.05);
      d.v.set(0.7 + Math.random() * 1.1, 2.2 + Math.random() * 1.4, 0.35 + (Math.random() - 0.5) * 0.7);
      d.size = 0.014 + Math.random() * 0.018;
    } else {
      d.p.set((Math.random() - 0.5) * 0.3, PIPE_Y - 0.36, (Math.random() - 0.5) * 0.1);
      d.v.set(0, -0.2, 0);
      d.size = 0.032 + Math.random() * 0.015;
    }
  };

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const p = progress.get();
    const flow = 1 - smooth(0.6, 0.78, p);
    const s = state.current;

    s.emit += flow * count * 0.9 * dt;
    while (s.emit > 1) {
      spawn("spray");
      s.emit -= 1;
    }
    s.drip += (spark ? 0 : flow * 6) * dt;
    while (s.drip > 1) {
      spawn("drip");
      s.drip -= 1;
    }

    const m = mesh.current;
    if (!m) return;
    drops.forEach((d, i) => {
      if (d.alive) {
        d.v.y -= (spark ? 9.5 : 7.5) * dt;
        d.p.addScaledVector(d.v, dt);
        if (d.p.y < FLOOR_Y) {
          d.alive = false;
          if (!spark && Math.random() < 0.35) {
            const r = ringState[s.ring++ % ringState.length];
            r.t = 0;
            r.x = d.p.x;
            r.z = d.p.z;
          }
        }
      }
      if (d.alive) {
        const speed = d.v.length();
        dir.copy(d.v).normalize();
        dummy.position.copy(d.p);
        dummy.quaternion.setFromUnitVectors(up, dir);
        dummy.scale.set(d.size, d.size * (1 + speed * (spark ? 2.2 : 0.5)), d.size);
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;

    s.wet = spark ? 0 : THREE.MathUtils.clamp(s.wet + (flow > 0.05 ? 0.06 : -0.22) * dt, 0, 1);
    if (puddle.current) puddle.current.scale.setScalar(0.4 + s.wet * 2.2);
    if (puddleMat.current) puddleMat.current.opacity = s.wet * 0.7;

    ringState.forEach((r, i) => {
      const ring = rings.current[i];
      if (!ring) return;
      r.t = Math.min(1, r.t + dt * 1.4);
      ring.visible = r.t < 1;
      ring.position.set(r.x, FLOOR_Y + 0.01, r.z);
      ring.scale.setScalar(0.05 + r.t * 0.55);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - r.t) * 0.6;
    });
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 8]} />
        {spark ? (
          <meshBasicMaterial color="#e6f8ff" toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#9fe2ff" emissive={WATER} emissiveIntensity={0.55} metalness={0.2} roughness={0.05} transparent opacity={0.92} />
        )}
      </instancedMesh>
      <mesh ref={puddle} position={[0.5, FLOOR_Y, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial ref={puddleMat} color="#0b5f8a" metalness={0.7} roughness={0.04} transparent opacity={0.4} envMapIntensity={1.4} />
      </mesh>
      {ringState.map((_, i) => (
        <mesh key={i} ref={(n) => void (rings.current[i] = n)} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.92, 1, 48]} />
          <meshBasicMaterial color={WATER} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ progress, children }: { progress: MotionValue<number>; children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const { size, camera } = useThree();
  const narrow = size.width < 768;
  useFrame(({ clock }) => {
    const p = progress.get();
    if (g.current) g.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.06 - 0.25 + p * 0.35;
    camera.position.z = THREE.MathUtils.lerp(narrow ? 10.5 : 9, narrow ? 9 : 7.4, smooth(0, 1, p));
    camera.lookAt(narrow ? 0 : -1.3, narrow ? -0.9 : -0.2, 0);
  });
  return (
    <group ref={g} position={narrow ? [0.1, 0.2, 0] : [0.3, 0, 0]} scale={narrow ? 0.82 : 1}>
      {children}
    </group>
  );
}

export default function PipeScene({
  progress,
  lite,
  interactive,
  still,
  mode = "leak",
}: {
  progress: MotionValue<number>;
  lite: boolean;
  interactive: boolean;
  still: boolean;
  mode?: "leak" | "spark";
}) {
  return (
    <Canvas
      frameloop={still ? "demand" : "always"}
      dpr={lite ? 1 : [1, 1.75]}
      camera={{ position: [3.6, 1.7, 7.4], fov: 32 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <fog attach="fog" args={["#111213", 9, 20]} />
      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#fff4e6" />
      {/* a single work lamp raking across the plaster */}
      <spotLight position={[2.5, 5.5, 2]} angle={0.75} penumbra={0.9} intensity={60} distance={16} decay={1.6} color="#ffeedd" />
      <pointLight position={[0.4, 1.6, 1.2]} intensity={4} distance={3} color="#42c6ff" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#18191b"]} />
        <Lightformer form="rect" intensity={5} position={[0, 6, 1]} scale={[14, 3, 1]} rotation={[Math.PI / 2, 0, 0]} />
        <Lightformer form="rect" intensity={3} position={[-6, 1, 2]} scale={[3, 10, 1]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={2.5} position={[6, 0, 0]} scale={[3, 10, 1]} rotation={[0, -Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={1.6} position={[0, -1, 8]} scale={[12, 2, 1]} />
        <Lightformer form="ring" intensity={3} color="#fff4e6" position={[2, 2, 6]} scale={2.5} />
      </Environment>
      <PresentationControls enabled={interactive} global={false} cursor snap polar={[-0.15, 0.25]} azimuth={[-0.5, 0.5]}>
        <Rig progress={progress}>
          <Wall />
          <Pipework />
          <Valve progress={progress} />
          <Clamp progress={progress} />
          <Water progress={progress} count={lite ? 110 : 240} spark={mode === "spark"} />
        </Rig>
      </PresentationControls>
    </Canvas>
  );
}
