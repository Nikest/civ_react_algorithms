import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Title, Info } from '../components';

import { StarInfoView } from './StarInfoView';
import { PlanetInfoView } from './PlanetInfoView';

let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    raycaster: THREE.Raycaster,
    mouse: THREE.Vector2
;

let orbits: THREE.LineLoop[] = [];
let temperatureZones: THREE.Mesh[] = [];

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

let inited = false;

export const System3DView = () => {
    const [show, setShow] = useState<any>({ type: 'star', id: '' });
    const containerRef = useRef<HTMLDivElement>(null);
    const starInfo = window.game.system.star;

    useEffect(() => {
        if (containerRef.current) {
            inited = true;

            const top = 0;
            const starSizeMult = 4;
            const planetSizeMult = 0.015;
            const astronomicalSizeMult = 100;

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            console.log(window.game.system.planets);
            const width = containerRef.current.clientWidth * 2;
            const height = containerRef.current.clientHeight * 2;

            // Scene setup
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100000);
            renderer = new THREE.WebGLRenderer({ alpha: true }); // Setting alpha to true for transparency
            renderer.setSize(width, height);
            containerRef.current.appendChild(renderer.domElement);

            // Sphere (central star) setup
            const starGeometry = new THREE.SphereGeometry(starInfo.radius * starSizeMult, 32, 32);
            const starMaterial = new THREE.MeshPhongMaterial({
                color: starInfo.colorRGB, // Yellow color
                emissive: starInfo.colorRGB // Emitting the same yellow color to simulate glowing
            });
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.y = top;
            star.userData = { id: window.game.system.star, type: 'star' };
            scene.add(star);

            // Point light setup
            const pointLight = new THREE.PointLight(starInfo.colorRGB, starInfo.luminosity * 10000, 1000);
            pointLight.position.set(0, top, 0); // Center of the scene
            scene.add(pointLight);

            // zones

            const zoneMaterials = [
                new THREE.MeshBasicMaterial({
                    color: 'rgb(255,60,0)',
                    transparent: true,
                    opacity: 0.05,
                    side: THREE.DoubleSide
                }),
                new THREE.MeshBasicMaterial({
                    color: 'rgb(153,255,0)',
                    transparent: true,
                    opacity: 0.05,
                    side: THREE.DoubleSide
                }),
                new THREE.MeshBasicMaterial({
                    color: 'rgb(0,178,255)',
                    transparent: true,
                    opacity: 0.05,
                    side: THREE.DoubleSide
                }),
                new THREE.MeshBasicMaterial({
                    color: 'rgb(102,0,255)',
                    transparent: true,
                    opacity: 0.05,
                    side: THREE.DoubleSide
                })
            ];

            const rings = [
                { innerRadius: 0, outerRadius: starInfo.temperatureZones[0] },
                { innerRadius: starInfo.temperatureZones[0], outerRadius: starInfo.temperatureZones[1] },
                { innerRadius: starInfo.temperatureZones[1], outerRadius: starInfo.temperatureZones[2] },
                { innerRadius: starInfo.temperatureZones[2], outerRadius: starInfo.temperatureZones[3] }
            ];

            rings.forEach((ring, i) => {
                const ringGeometry = new THREE.RingGeometry(ring.innerRadius * astronomicalSizeMult, ring.outerRadius * astronomicalSizeMult, 32);
                const ringMesh = new THREE.Mesh(ringGeometry, zoneMaterials[i]);
                ringMesh.rotation.x = Math.PI * 0.75; // Rotate the ring to lie in the xy-plane
                ringMesh.position.y = top; // Align with the central star's y position
                temperatureZones.push(ringMesh);
                scene.add(ringMesh);
            });

            const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const planetMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
            orbits = [];
            for (let i = 0; i < window.game.system.planets.length; i++) {
                const planetInfo = window.game.system.planets[i];
                const orbitRadius = planetInfo.orbitRadius * astronomicalSizeMult; // Starting at 5 and increasing by 20 each time
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
                console.log(planetInfo.radius * planetSizeMult);
                // Add planet
                const planetGeometry = new THREE.SphereGeometry(planetInfo.radius * planetSizeMult, 32, 32);
                const planet = new THREE.Mesh(planetGeometry, planetMaterial);
                planet.position.x = orbitRadius; // Positioning the planet along the x-axis on the orbit
                planet.userData = { id: window.game.system.planets[i].id, type: 'planet' };
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
                    orbit.rotation.z += (10 - i) / 100000;
                })
                renderer.render(scene, camera);
            };

            animate();

            containerRef.current.addEventListener('mousewheel', flyZ);
            containerRef.current.addEventListener('mousedown', onMouseDown);
            containerRef.current.addEventListener('mouseup', onMouseUp);
            containerRef.current.addEventListener('mousemove', inclination);
            containerRef.current.addEventListener('click', onClick);
        }

        function flyZ(e: any) {
            e.preventDefault();
            if (e.deltaY > 0) {
                camera.position.z *= 1.01;
            } else if (e.deltaY < 0) {
                camera.position.z /= 1.01;
            }
        }

        let isMouseDown = false;
        function onMouseDown(e: any) {
            isMouseDown = true;
        }
        function onMouseUp() {
            isMouseDown = false;
        }
        function inclination(e: any) {
            if(!isMouseDown) return;
            orbits.forEach((orbit: any) => {
                orbit.rotation.x += e.movementY / 900;
            });
            temperatureZones.forEach((zone: any) => {
                zone.rotation.x += e.movementY / 900;
            });
        }

        function onClick(event: any) {
            // Calculate mouse position in normalized device coordinates (-1 to +1) for both components.
            mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = - (event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

            // Update the picking ray with the camera and mouse position.
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray. Adjust the array as needed for your scene setup.
            const intersects = raycaster.intersectObjects(scene.children, true);

            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.userData.id) {
                    setShow(intersects[i].object.userData);
                    return;
                }
            }

            setShow({ type: '', id: '' });
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
            <div className={'system3D-view-panel'}>
                {
                    show.type === 'star' && <StarInfoView />
                }
                {
                    show.type === 'planet' && <PlanetInfoView id={show.id} />
                }
                {
                    show.type === '' && <span />
                }
                <div ref={containerRef} className={'system3D-view-container'}></div>
            </div>
        </Box>
    );
}
