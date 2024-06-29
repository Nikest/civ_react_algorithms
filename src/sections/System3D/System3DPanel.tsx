import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Title, Info } from '../../components';

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

const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const planetMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });

const top = 0;
const starSizeMult = 4;
const planetSizeMult = 0.015;
const astronomicalSizeMult = 100;

export const System3DView = () => {
    const [renderId, setRenderId] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [show, setShow] = useState<any>({ type: 'star', id: '' });
    const containerRef = useRef<HTMLDivElement>(null);
    const starInfo = window.game.system.star;

    useEffect(() => {
        window.addEventListener('ui:systemUpdate', () => {
            setRenderId(window.game.system.systemUpdateHash);
        });
    }, []);

    useEffect(() => {
        const canvas = containerRef.current;
        if (!canvas) {
            return;
        }

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        const width = canvas.clientWidth * 2;
        const height = canvas.clientHeight * 2;

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100000);
        renderer = new THREE.WebGLRenderer({ alpha: true }); // Setting alpha to true for transparency
        renderer.setSize(width, height);
        canvas.appendChild(renderer.domElement);

        // Central star setup
        const starGeometry = new THREE.SphereGeometry(starInfo.radius * starSizeMult, 32, 32);
        const starMaterial = new THREE.MeshPhongMaterial({
            color: starInfo.colorRGB,
            emissive: starInfo.colorRGB,
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(position.left, position.top, 0);
        star.userData = { id: window.game.system.star, type: 'star' };
        scene.add(star);

        // Point light setup
        const pointLight = new THREE.PointLight(starInfo.colorRGB, starInfo.luminosity * 10000, 1000);
        pointLight.position.set(position.left, position.top, 0);
        scene.add(pointLight);

        // zones
        const zones = [
            { innerRadius: 0, outerRadius: starInfo.temperatureZones[0] },
            { innerRadius: starInfo.temperatureZones[0], outerRadius: starInfo.temperatureZones[1] },
            { innerRadius: starInfo.temperatureZones[1], outerRadius: starInfo.temperatureZones[2] },
            { innerRadius: starInfo.temperatureZones[2], outerRadius: starInfo.temperatureZones[3] }
        ];

        zones.forEach((zone, i) => {
            const ringGeometry = new THREE.RingGeometry(zone.innerRadius * astronomicalSizeMult, zone.outerRadius * astronomicalSizeMult, 32);
            const ringMesh = new THREE.Mesh(ringGeometry, zoneMaterials[i]);
            ringMesh.rotation.x = Math.PI * 0.75;
            ringMesh.position.y = position.top;
            temperatureZones.push(ringMesh);
            scene.add(ringMesh);
        });

        // orbits
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
            orbit.position.y = position.top;
            orbit.userData = { angularVelocity: planetInfo.orbitAngularVelocity, id: planetInfo.id, type: 'orbit' };

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
            orbits.forEach((orbit, i) => {
                const theta = (orbit.userData.angularVelocity * window.game.timer.elapsedTimeInSeconds()) % (2 * Math.PI);
                orbit.rotation.z = theta;
            })
            renderer.render(scene, camera);

            requestAnimationFrame(animate);
        };

        animate();

        canvas.addEventListener('mousewheel', flyZ);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mousemove', inclination);
        canvas.addEventListener('click', onClick);

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

        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
                containerRef.current.removeEventListener('mousewheel', flyZ);
                containerRef.current.removeEventListener('mousedown', onMouseDown);
                containerRef.current.removeEventListener('mouseup', onMouseUp);
                containerRef.current.removeEventListener('mousemove', inclination);
                containerRef.current.removeEventListener('click', onClick);
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
