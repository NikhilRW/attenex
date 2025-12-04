import { useGLTF } from "@react-three/drei/native";
import { invalidate, useFrame } from "@react-three/fiber";
import React, { memo, useRef } from "react";
import * as THREE from "three";

interface StudentProps {
    position?: [number, number, number];
    isSelected: boolean;
    isHovered: boolean;
    onClick: () => void;
}

const Student = memo(({ position = [0, 0, 0], isSelected, isHovered, onClick }: StudentProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const { nodes, materials } = useGLTF(
        require("../../../../assets/models/student.glb")
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
                    nodes["tripo_node_38d1209e-8c0b-4691-bfa5-05140728cb5a"].geometry
                }
                material={
                    materials["tripo_material_38d1209e-8c0b-4691-bfa5-05140728cb5a"]
                }
            />
            {/* {(isHovered || isSelected) && (
                <pointLight
                    position={[0, 1, 0]}
                    intensity={isSelected ? 5 : 1}
                    color={isSelected ? "#00ff88" : "#4a90e2"}
                    distance={5}
                />
            )} */}
        </group>
    );
});

export default Student;

useGLTF.preload(require("../../../../assets/models/student.glb"));
