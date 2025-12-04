import { useGLTF } from "@react-three/drei/native";
import { invalidate, useFrame } from "@react-three/fiber";
import React, { memo, useRef } from "react";
import * as THREE from "three";

interface TeacherProps {
  position?: [number, number, number];
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
}

const Teacher = memo(({ position = [0, 0, 0], isSelected, isHovered, onClick }: TeacherProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    require("../../../../assets/models/teacher.glb")
  );

  // Base rotation to face forward
  const baseRotation = (270 * Math.PI) / 180;

  // Animate rotation and bounce when selected or hovered
  useFrame((state) => {
    if (!groupRef.current) return;

    if (isSelected) {
      // Continuous rotation when selected
      groupRef.current.rotation.y += 0.02;
      // Bounce animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (isHovered) {
      // Gentle hover effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
      groupRef.current.rotation.y = baseRotation + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    } else {
      // Idle subtle animation - oscillate around base rotation
      groupRef.current.rotation.y = baseRotation + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02;
    }
    invalidate();
  });

  return (
    <group
      ref={groupRef}
      position={position}
      dispose={null}
      onClick={onClick}
      scale={isSelected ? 1.8 : isHovered ? 1.8 : 1.7}
    >
      <mesh
        geometry={
          nodes["tripo_node_87f088a5-dd21-4049-b0e8-46a49e443bd7"].geometry
        }
        material={
          materials["tripo_material_87f088a5-dd21-4049-b0e8-46a49e443bd7"]
        }
      />
    </group>
  );
});

export default Teacher;

useGLTF.preload(require("../../../../assets/models/teacher.glb"));
