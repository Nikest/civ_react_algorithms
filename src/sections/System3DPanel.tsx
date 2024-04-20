import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box } from '../components';

let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer;

let orbits: THREE.LineLoop[] = [];

function importAll(r: any) {
    const images: any = {};
    r.keys().map(r).forEach((filePath: string) => {
        const path = filePath;
        const name = filePath.split('/static/media/').pop()?.split('.')[0] || 'test';
        images[name] = path;
    });

    return images;
}

// @ts-ignore
const planetTextures = importAll(require.context('../assets/planets', false, /\.png$/));

export const System3DView = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const top = 30;
            const starInfo = window.game.system.star;
            console.log(starInfo);
            console.log(window.game.system.planets, planetTextures);
            const width = containerRef.current.clientWidth * 2;
            const height = containerRef.current.clientHeight * 2;

            // Scene setup
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ alpha: true }); // Setting alpha to true for transparency
            renderer.setSize(width, height);
            containerRef.current.appendChild(renderer.domElement);

            // Sphere (central star) setup
            const starGeometry = new THREE.SphereGeometry(5, 32, 32);
            const starMaterial = new THREE.MeshPhongMaterial({
                color: starInfo.uiColor, // Yellow color
                emissive: starInfo.uiColor // Emitting the same yellow color to simulate glowing
            });
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.y = top;
            scene.add(star);

            // Point light setup
            const pointLight = new THREE.PointLight(starInfo.uiColor, 10000, 1000);
            pointLight.position.set(0, top, 0); // Center of the scene
            scene.add(pointLight);

            const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const planetMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
            orbits = [];
            for (let i = 1; i <= 4; i++) {
                const orbitRadius = 5 + 20 * i; // Starting at 5 and increasing by 20 each time
                const circleGeometry = new THREE.CircleGeometry(orbitRadius, 64);
                const points = circleGeometry.attributes.position.array;
                let vertices = [];
                for (let j = 0; j < points.length; j += 3) {
                    vertices.push(new THREE.Vector3(points[j], points[j+1], points[j+2]));
                }
                const orbitGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
                const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI * 0.75;
                orbit.rotation.z = Math.PI * Math.random();
                orbit.position.y = top;

                // Add planet
                const planetGeometry = new THREE.SphereGeometry(1 + Math.random() * 3, 32, 32);
                const planet = new THREE.Mesh(planetGeometry, planetMaterial);
                planet.position.x = orbitRadius; // Positioning the planet along the x-axis on the orbit

                orbit.add(planet);

                scene.add(orbit);
                orbits.push(orbit);
            }

            // Position the camera
            camera.position.z = 120;

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                orbits.forEach((orbit, i) => {
                    orbit.rotation.z += (5 - i) / 1000;
                })
                renderer.render(scene, camera);
            };

            animate();
        }

        // Cleanup function to remove the renderer element
        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <Box>
            <h1>System3DView</h1>
            <div className={'system3D-view-panel'}>
                <div ref={containerRef} className={'system3D-view-container'}></div>
            </div>
        </Box>
    );
}
