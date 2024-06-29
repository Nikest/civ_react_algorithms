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
    const requestRef = useRef<number>();

    useEffect(() => {
        const canvas = containerRef.current;

        if (!canvas) {
            return;
        }

        window.addEventListener('ui:planetSelected', () => {
            setPlanetId(window.game.system.selectedPlanetId);
        });

        window.addEventListener('ui:systemUpdate', () => {
            setSystemUpdatedPlanetId(window.game.system.systemUpdateHash);
        });

        const onMouseDown = (event: MouseEvent) => {
            isDragging.current = true;
            previousMousePosition.current = {
                x: event.clientX,
                y: event.clientY
            };
        };

        const onMouseUp = (event: MouseEvent) => {
            isDragging.current = false;
        };

        const onClick = (event: MouseEvent) => {
            if(!mouse) return;
            mouse.x = (event.offsetX / canvas.clientWidth) * 2 - 1;
            mouse.y = - (event.offsetY / canvas.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            const tileIndex = intersects[0]?.object?.userData?.tileIndex || null;
            if (tileIndex) {
                const planet = window.game.system.getPlanetById(window.game.system.selectedPlanetId);

                const tile = planet?.getTiles().hexaSphere.tiles[tileIndex];
                tile?.onClick();
            }
        }

        const onMouseMove = (event: MouseEvent) => {
            if(!mouse) return;
            mouse.x = (event.offsetX / canvas.clientWidth) * 2 - 1;
            mouse.y = - (event.offsetY / canvas.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            const tileIndex = intersects[0]?.object?.userData?.tileIndex || null;
            const landGroup = intersects[0]?.object?.userData?.landGroup || null;

            if (tileIndex) {
                window.dispatchEvent(new CustomEvent('ui:planetUpdate:tileHover', {
                    detail: {
                        landGroup,
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

        setTimeout(() => {
            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('mouseup', onMouseUp);
            canvas.addEventListener('click', onClick);
            canvas.addEventListener('mousemove', onMouseMove);
        }, 1500);

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('mousedown', onMouseDown);
                containerRef.current.removeEventListener('mouseup', onMouseUp);
                containerRef.current.removeEventListener('click', onClick);
                containerRef.current.removeEventListener('mousemove', onMouseMove);
            }
        }

    }, []);

    useEffect(() => {
        const canvas = containerRef.current;

        if (!canvas) {
            return;
        }

        const planetInfo = window.game.system.getPlanetById(planetId);

        if (!planetInfo) {
            if (scene) {
                scene.remove(...scene.children);
            }

            return;
        }

        containerRef.current.innerHTML = '';
        inited = true;

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        // Scene setup
        scene = new THREE.Scene();

        // Camera setup
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 50;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        canvas.appendChild(renderer.domElement);

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
            mesh.userData = { tileIndex: index, landGroup: tile.planetTile.landGroup };
            scene.add(mesh);
        });

        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);

            scene.rotation.x += rotation.current.y;
            scene.rotation.y += rotation.current.x;

            rotation.current.x = 0;
            rotation.current.y = 0;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
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