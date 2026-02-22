import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

interface BasketballMeshProps {
  scrollProgress: number;
}

const BasketballMesh = ({ scrollProgress }: BasketballMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const linesRef = useRef<THREE.Group>(null!);

  // Basketball color
  const ballColor = useMemo(() => new THREE.Color("hsl(24, 85%, 40%)"), []);
  const lineColor = useMemo(() => new THREE.Color("hsl(20, 30%, 15%)"), []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = scrollProgress * Math.PI * 3;
      meshRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.3;
      // Scale up slightly as scroll progresses
      const scale = 1 + scrollProgress * 0.3;
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = scrollProgress * Math.PI * 3;
      linesRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.3;
      const scale = 1 + scrollProgress * 0.3;
      linesRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Main ball */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            color={ballColor}
            roughness={0.85}
            metalness={0.05}
            bumpScale={0.02}
          />
        </mesh>

        {/* Seam lines */}
        <group ref={linesRef}>
          {/* Horizontal seam */}
          <mesh>
            <torusGeometry args={[1.51, 0.02, 8, 64]} />
            <meshStandardMaterial color={lineColor} roughness={0.6} />
          </mesh>
          {/* Vertical seam */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.51, 0.02, 8, 64]} />
            <meshStandardMaterial color={lineColor} roughness={0.6} />
          </mesh>
          {/* Curved seam left */}
          <mesh rotation={[0, Math.PI / 4, Math.PI / 2]}>
            <torusGeometry args={[1.51, 0.015, 8, 32, Math.PI]} />
            <meshStandardMaterial color={lineColor} roughness={0.6} />
          </mesh>
          {/* Curved seam right */}
          <mesh rotation={[0, -Math.PI / 4, Math.PI / 2]}>
            <torusGeometry args={[1.51, 0.015, 8, 32, Math.PI]} />
            <meshStandardMaterial color={lineColor} roughness={0.6} />
          </mesh>
        </group>
      </group>
    </Float>
  );
};

interface ScrollScene3DProps {
  scrollProgress: number;
}

const ScrollScene3D = ({ scrollProgress }: ScrollScene3DProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="hsl(24, 100%, 70%)" />
      <directionalLight position={[-3, -2, 4]} intensity={0.4} color="hsl(220, 60%, 60%)" />
      <pointLight position={[0, 3, 3]} intensity={0.8} color="hsl(24, 100%, 55%)" />
      <BasketballMesh scrollProgress={scrollProgress} />
      <Environment preset="city" />
    </Canvas>
  );
};

export default ScrollScene3D;
