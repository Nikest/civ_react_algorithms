import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Title, Info } from '../../components';
import { PlanetTileInfo } from './PlanetTileInfo';
import { PlanetTiles } from '../../game/system/PlanetTiles';

let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    raycaster: THREE.Raycaster,
    mouse: THREE.Vector2
;

let inited = false;

export const Planet3DPanel = () => {
    const [systemUpdatedId, setSystemUpdatedPlanetId] = useState<any>(window.game.system.systemUpdateHash);
    const [planetId, setPlanetId] = useState<any>('');
    const isDragging = useRef(false);
    const rotation = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const previousMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        window.addEventListener('ui:planetSelected', () => {
            setPlanetId(window.game.system.selectedPlanetId);
        });

        window.addEventListener('ui:systemUpdate', () => {
            setSystemUpdatedPlanetId(window.game.system.systemUpdateHash);
        });

        setTimeout(() => {
            const onMouseDown = (event: MouseEvent) => {
                isDragging.current = true;
                previousMousePosition.current = {
                    x: event.clientX,
                    y: event.clientY
                };
            };
            containerRef?.current?.addEventListener('mousedown', onMouseDown, false);

            const onMouseUp = (event: MouseEvent) => {
                isDragging.current = false;
            };
            containerRef?.current?.addEventListener('mouseup', onMouseUp, false);

            const onClick = (event: MouseEvent) => {
                mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = - (event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(scene.children);
                const tileIndex = intersects[0]?.object?.userData?.tileIndex || null;
                if (tileIndex) {
                    const planet = window.game.system.getPlanetById(window.game.system.selectedPlanetId);

                    const tile = planet?.getTiles().hexaSphere.tiles[tileIndex];
                    tile?.onClick();
                }
            }
            containerRef?.current?.addEventListener('click', onClick, false);

            const onMouseMove = (event: MouseEvent) => {

                mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = - (event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(scene.children);
                const tileIndex = intersects[0]?.object?.userData?.tileIndex || null;

                if (tileIndex) {
                    window.dispatchEvent(new CustomEvent('ui:planetUpdate:tileHover', {
                        detail: {
                            tileIndex,
                            planetId: window.game.system.selectedPlanetId,
                        }
                    }));
                }

                if (isDragging.current) {
                    const deltaMove = {
                        x: event.clientX - previousMousePosition.current.x,
                        y: event.clientY - previousMousePosition.current.y
                    };

                    const rotationSpeed = 0.005;

                    rotation.current.x += deltaMove.x * rotationSpeed;
                    rotation.current.y += deltaMove.y * rotationSpeed;

                    previousMousePosition.current = {
                        x: event.clientX,
                        y: event.clientY
                    };
                }
            };
            containerRef?.current?.addEventListener('mousemove', onMouseMove, false);
        }, 1000);

    }, []);

    useEffect(() => {
        const planetInfo = window.game.system.getPlanetById(planetId);

        if (!planetInfo) {
            if (scene) {
                scene.remove(...scene.children);
            }
        }

        if (containerRef.current && planetInfo) {
            containerRef.current.innerHTML = '';
            inited = true;

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            // Scene setup
            scene = new THREE.Scene();

            // Camera setup
            camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 50;

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            containerRef.current.appendChild(renderer.domElement);

            // Lights
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 1, 1).normalize();
            scene.add(light);

            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);

            // Planet tiles
            const planetTiles = planetInfo.getTiles();
            const tiles = planetTiles.hexaSphere.tiles;

            tiles.forEach((tile, index) => {
                const type = tile.planetTile.type;
                let color = tile.planetTile.color;

                const material = new THREE.MeshBasicMaterial({ color });
                const points = tile.boundary.map((p: any) => new THREE.Vector3(p.x, p.y, p.z));
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const faces = [];

                for (let i = 1; i < tile.boundary.length - 1; i++) {
                    faces.push(0, i, i + 1);
                }

                geometry.setIndex(faces);
                geometry.computeVertexNormals();
                const mesh = new THREE.Mesh(geometry, material);
                mesh.userData = { tileIndex: index };
                scene.add(mesh);
            });

            const animate = () => {
                requestAnimationFrame(animate);

                scene.rotation.x += rotation.current.y;
                scene.rotation.y += rotation.current.x;

                rotation.current.x = 0;
                rotation.current.y = 0;

                renderer.render(scene, camera);
            };

            animate();
        }

    }, [planetId, systemUpdatedId]);

    return (
        <Box>
            <div className={'planet3D-view-panel'}>
                <div ref={containerRef} className={'planet3D-view-container'}></div>
                <PlanetTileInfo />
            </div>
        </Box>
    );
}