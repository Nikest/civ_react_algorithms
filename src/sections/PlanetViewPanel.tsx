import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { PlanetBuilder } from '../game/system/PlanetBuilder';
import { Title, Box, Grid } from '../components';
import { PlanetViewInfo } from './PlanetViewInfo';
import { PlanetTileInfo } from './PlanetTileInfo';
import { Procedural } from '../game/Procedural';


let inited = false;
export const PlanetViewPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const isDragging = useRef(false);
    const rotation = useRef({ x: 0, y: 0 });
    const previousMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (containerRef.current && !inited) {
            inited = true;

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 50;

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);

            const onMouseDown = (event: MouseEvent) => {
                isDragging.current = true;
                previousMousePosition.current = {
                    x: event.clientX,
                    y: event.clientY
                };
            };

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

            const onMouseUp = (event: MouseEvent) => {
                isDragging.current = false;
            };

            containerRef?.current?.addEventListener('mousedown', onMouseDown, false);
            renderer.domElement.addEventListener('mousemove', onMouseMove, false);
            renderer.domElement.addEventListener('mouseup', onMouseUp, false);

            containerRef.current.appendChild(renderer.domElement);

            window.addEventListener('ui:planetUpdate', () => {
                const colonizedPlanetsIds = window.game.system.getColonizedPlanetsIds();
                // const selectedPlanet = window.game.system.getPlanetById(colonizedPlanetsIds[0]);
                // if (!selectedPlanet) {
                //     return;
                // }

                scene.remove.apply(scene, scene.children);
                scene.rotation.y = 0;

                // selectedPlanet?.getPlanetBuilder().then((planetBuilder: PlanetBuilder) => {
                //     planetBuilder.getHexaSphere().tiles.forEach((tile, index: number) => {
                //         const type = tile.planetTile.type;
                //         let color = type === 'liquid' ? 'rgb(32,46,72)' : tile.planetTile.isColonized ? 'rgb(192,192,192)' : 'rgb(182,143,78)';
                //
                //         if (tile.planetTile.isPolarCircle) {
                //             color = 'rgb(255,255,255)';
                //         }
                //
                //         const material = new THREE.MeshBasicMaterial({ color });
                //         const points = tile.boundary.map((p: any) => new THREE.Vector3(p.x, p.y, p.z));
                //         const geometry = new THREE.BufferGeometry().setFromPoints(points);
                //         const faces = [];
                //         for (let i = 1; i < tile.boundary.length - 1; i++) {
                //             faces.push(0, i, i + 1);
                //         }
                //         geometry.setIndex(faces);
                //         geometry.computeVertexNormals();
                //         const mesh = new THREE.Mesh(geometry, material);
                //         // @ts-ignore
                //         mesh.userData = { tileIndex: index };
                //         scene.add(mesh);
                //     });
                //
                //     window.dispatchEvent(new CustomEvent('ui:planetUpdate:info', { detail: 'land' }));
                // });
            });

            window.addEventListener('ui:planetUpdate:showResource', ({ detail }: any) => {
                const colorLand = { r: 182, g: 143, b: 78 };
                const colorIron = { r: 94, g: 188, b: 255};
                const colorCopper = { r: 255, g: 185, b: 94};
                const colorLithium = { r: 94, g: 255, b: 212};
                const colorAluminum = { r: 255, g: 255, b: 255};
                const colorTitanium = { r: 191, g: 204, b: 255};
                const colorUranium = { r: 78, g: 255, b: 71};

                scene.remove.apply(scene, scene.children);

                const colonizedPlanetsIds = window.game.system.getColonizedPlanetsIds();
                // const selectedPlanet = window.game.system.getPlanetById(colonizedPlanetsIds[0]);
                // selectedPlanet?.getPlanetBuilder().then((planetBuilder: PlanetBuilder) => {
                //     const procedural = new Procedural(123);
                //     const landsColors: string[] = [];
                //
                //     planetBuilder.getHexaSphere().tiles.forEach((tile: any, index: number) => {
                //         const resource = tile.planetTile[detail];
                //         const type = tile.planetTile.type;
                //
                //         let color = type === 'liquid' ? 'rgb(32,46,72)' : 'rgb(0, 0, 0)';
                //
                //         if (type === 'land') {
                //             switch (detail) {
                //                 case 'land':
                //                     color = `rgb(${colorLand.r}, ${colorLand.g}, ${colorLand.b})`;
                //                     break;
                //                 case 'lands':
                //                     const landGroup = tile.planetTile.landGroup;
                //                     if (!landsColors[landGroup]) {
                //                         landsColors[landGroup] = `rgb(${procedural.randomInt(100, 255)}, ${procedural.randomInt(100, 255)}, ${procedural.randomInt(100, 255)})`;
                //                     }
                //                     color = landsColors[landGroup];
                //                     break;
                //                 case 'iron':
                //                     color = `rgb(${Math.floor(colorIron.r * resource)}, ${Math.floor(colorIron.g * resource)}, ${Math.floor(colorIron.b * resource)})`;
                //                     break;
                //                 case 'copper':
                //                     color = `rgb(${Math.floor(colorCopper.r * resource)}, ${Math.floor(colorCopper.g * resource)}, ${Math.floor(colorCopper.b * resource)})`;
                //                     break;
                //                 case 'lithium':
                //                     color = `rgb(${Math.floor(colorLithium.r * resource)}, ${Math.floor(colorLithium.g * resource)}, ${Math.floor(colorLithium.b * resource)})`;
                //                     break;
                //                 case 'aluminum':
                //                     color = `rgb(${Math.floor(colorAluminum.r * resource)}, ${Math.floor(colorAluminum.g * resource)}, ${Math.floor(colorAluminum.b * resource)})`;
                //                     break;
                //                 case 'titanium':
                //                     color = `rgb(${Math.floor(colorTitanium.r * resource)}, ${Math.floor(colorTitanium.g * resource)}, ${Math.floor(colorTitanium.b * resource)})`;
                //                     break;
                //                 case 'uranium':
                //                     color = `rgb(${Math.floor(colorUranium.r * resource)}, ${Math.floor(colorUranium.g * resource)}, ${Math.floor(colorUranium.b * resource)})`;
                //                     break;
                //             }
                //         }
                //
                //         const material = new THREE.MeshBasicMaterial({ color });
                //         const points = tile.boundary.map((p: any) => new THREE.Vector3(p.x, p.y, p.z));
                //         const geometry = new THREE.BufferGeometry().setFromPoints(points);
                //         const faces = [];
                //         for (let i = 1; i < tile.boundary.length - 1; i++) {
                //             faces.push(0, i, i + 1);
                //         }
                //         geometry.setIndex(faces);
                //         geometry.computeVertexNormals();
                //         const mesh = new THREE.Mesh(geometry, material);
                //         // @ts-ignore
                //         mesh.userData = { tileIndex: index };
                //         scene.add(mesh);
                //     });
                // });
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

    }, []);

    function createDispatcher(resourceName: string) {
        return () => {
            window.dispatchEvent(new CustomEvent('ui:planetUpdate:showResource', { detail: resourceName }));
        };
    }

    return (
        <div data-render-id={null}>
            <Box>
                <PlanetViewInfo />
                <div className="planet-view-panel" >
                    <PlanetTileInfo />
                    <Grid line={9}>
                        <span>Показать:</span>
                        <button onClick={createDispatcher('land')}>Суша</button>
                        <button onClick={createDispatcher('lands')}>Земли</button>
                        <button onClick={createDispatcher('iron')}>Железо</button>
                        <button onClick={createDispatcher('copper')}>Медь</button>
                        <button onClick={createDispatcher('lithium')}>Литий</button>
                        <button onClick={createDispatcher('aluminum')}>Алюминий</button>
                        <button onClick={createDispatcher('titanium')}>Титан</button>
                        <button onClick={createDispatcher('uranium')}>Уран</button>
                    </Grid>

                    <div ref={containerRef} className={'planet-view-container'}></div>
                </div>
            </Box>
        </div>
    );
}