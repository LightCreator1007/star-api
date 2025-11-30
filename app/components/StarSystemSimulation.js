"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function StarSystemSimulation({ starData }) {
  const mountRef = useRef(null);

  useEffect(() => {
    // 1. CAPTURE THE REF (Critical Fix)
    // We save the current DOM node to a variable. 
    // This ensures cleanup works even if the component unmounts.
    const container = mountRef.current;
    if (!container) return;

    // 2. CLEAN SLATE (Critical Fix)
    // Remove any existing children (ghost canvases) before starting.
    while (container.firstChild) {
      container.removeChild(container.lastChild);
    }

    // --- SETUP ---
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    scene.fog = new THREE.FogExp2(0x0a0f1e, 0.002);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 50, 90);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Append to the captured container variable, not the ref directly
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 300;
    controls.minDistance = 20;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 600);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // --- DATA MAPPING ---
    const systemData = [
      {
        name: starData.name,
        type: "Star",
        radius: 8,
        distance: 0,
        speed: 0,
        color: 0xffaa00,
        textureType: "star",
      },
      ...(starData.planets || []).map((planet, index) => ({
        name: planet.name,
        type: "Planet",
        radius: Math.random() * 2 + 1, 
        distance: 25 + (index * 15), 
        speed: 0.005 / (index * 0.5 + 1),
        color: Math.random() * 0xffffff,
        textureType: index % 2 === 0 ? "rocky" : "gas",
        angle: Math.random() * Math.PI * 2,
      })),
    ];

    // --- TEXTURES ---
    function createProceduralTexture(type, colorHex) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      const c = new THREE.Color(colorHex);

      ctx.fillStyle = `#${c.getHexString()}`;
      ctx.fillRect(0, 0, 256, 128);

      ctx.fillStyle = "rgba(0,0,0,0.2)";
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 256, Math.random() * 128, Math.random() * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    }

    // --- OBJECTS ---
    const celestialObjects = [];
    const disposeList = []; // Array to hold things we need to dispose
    const labels = [];

    systemData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const texture = createProceduralTexture(data.textureType, data.color);
      
      let material;
      if (data.type === "Star") {
        material = new THREE.MeshBasicMaterial({ map: texture });
      } else {
        material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
      }

      disposeList.push(geometry, material, texture);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { ...data, currentAngle: data.angle || 0 };

      // HTML Label
      const labelDiv = document.createElement("div");
      labelDiv.className = "absolute text-xs text-white bg-black/60 px-2 py-1 rounded pointer-events-none select-none whitespace-nowrap z-10";
      labelDiv.style.display = "none";
      labelDiv.textContent = data.name;
      
      container.appendChild(labelDiv); // Append to captured container
      labels.push({ div: labelDiv, mesh: mesh, offset: data.radius + 2 });

      if (data.distance === 0) {
        mesh.position.set(0, 0, 0);
        scene.add(mesh);
      } else {
        const orbitGeo = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
        const orbitMat = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 
        });
        const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
        orbitMesh.rotation.x = Math.PI / 2;
        scene.add(orbitMesh);
        
        disposeList.push(orbitGeo, orbitMat);
        scene.add(mesh);
        celestialObjects.push(mesh);
      }
    });

    // --- ANIMATION ---
    let reqId;
    const tempV = new THREE.Vector3();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      celestialObjects.forEach((obj) => {
        const d = obj.userData;
        d.currentAngle += d.speed;
        obj.position.x = Math.cos(d.currentAngle) * d.distance;
        obj.position.z = Math.sin(d.currentAngle) * d.distance;
        obj.rotation.y += 0.01;
      });

      controls.update();
      renderer.render(scene, camera);

      // Label Logic
      labels.forEach(({ div, mesh, offset }) => {
        tempV.copy(mesh.position);
        tempV.y += offset;
        tempV.project(camera);

        const isVisible = tempV.z < 1 && tempV.x >= -1 && tempV.x <= 1 && tempV.y >= -1 && tempV.y <= 1;

        if (isVisible) {
            const x = (tempV.x * 0.5 + 0.5) * width;
            const y = (-(tempV.y * 0.5) + 0.5) * height;
            div.style.display = "block";
            div.style.transform = `translate(-50%, -50%)`;
            div.style.left = `${x}px`;
            div.style.top = `${y}px`;
        } else {
            div.style.display = "none";
        }
      });
    };
    animate();

    // --- RESIZE ---
    const handleResize = () => {
        // Use the captured container variable
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      
      // Dispose Three.js internals
      disposeList.forEach(item => item.dispose());
      renderer.dispose();

      // Clear the DOM using the captured 'container' variable
      // This is safer than removing specific children
      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
    };
  }, [starData]);

  return (
    <div 
        ref={mountRef} 
        className="w-full h-full relative"
    >
        <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 pointer-events-none select-none z-0">
            Drag to Rotate • Scroll to Zoom
        </div>
    </div>
  );
}