import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function randomPointInSphere(radius: number) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return [x, y, z];
}

const Stars = (props: any) => {
    // FIX: Initialize useRef with null to resolve "Expected 1 arguments, but got 0" error.
    const ref = useRef<any>(null);
    const [sphere] = useState(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            const [x, y, z] = randomPointInSphere(1.2);
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        // FIX: Removed <group> wrapper and moved its props to <Points> to fix "Property 'group' does not exist on type 'JSX.IntrinsicElements'" error.
        <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} rotation={[0, 0, Math.PI / 4]} {...props}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.005}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </Points>
    );
};

const ThreeScene: React.FC = () => {
    return (
       <div className="absolute top-0 left-0 w-full h-full z-0">
         <Canvas camera={{ position: [0, 0, 1] }}>
            <Suspense fallback={null}>
                <Stars />
            </Suspense>
        </Canvas>
       </div>
    );
};

export default ThreeScene;