// @ts-nocheck
// Default scene: a cozy rainy day. Low-poly cabin with a warm, softly-pulsing
// window, a few drifting clouds, and animated rain. Flat-shaded throughout to
// keep the retro/pixel feel and the vertex count tiny.
//
// Scene contract (shared by every season module):
//   build(THREE) -> {
//     group,               // THREE.Object3D added to the scene
//     bg,     (optional)   // THREE.Color used as the clear/sky colour
//     fog,    (optional)   // THREE.Fog for depth
//     camera: { position, lookAt },
//     update(dt, t),       // per-frame animation
//     dispose(),           // free geometries/materials
//   }

export function build(THREE) {
  const group = new THREE.Group();
  const disposables = [];
  const track = (obj) => {
    if (obj.geometry) disposables.push(obj.geometry);
    if (obj.material) disposables.push(obj.material);
    return obj;
  };

  const SKY = new THREE.Color("#2b333f");

  // ---- Lighting ----------------------------------------------------------
  const hemi = new THREE.HemisphereLight(0x4a5a72, 0x161a22, 0.85);
  group.add(hemi);

  const key = new THREE.DirectionalLight(0x8fa2bd, 0.35);
  key.position.set(-6, 10, 4);
  group.add(key);

  // Warm glow from the cabin window.
  const windowLight = new THREE.PointLight(0xffb257, 1.6, 12, 2);
  windowLight.position.set(0.9, 1.15, 1.9);
  group.add(windowLight);

  // ---- Ground ------------------------------------------------------------
  const ground = track(
    new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x2c3a30, flatShading: true, roughness: 1 })
    )
  );
  ground.rotation.x = -Math.PI / 2;
  group.add(ground);

  // A couple of low hills for silhouette/depth.
  const hillMat = new THREE.MeshStandardMaterial({ color: 0x243027, flatShading: true, roughness: 1 });
  disposables.push(hillMat);
  const hillGeo = new THREE.IcosahedronGeometry(6, 0);
  disposables.push(hillGeo);
  [
    [-11, -0.5, -10, 1.4],
    [12, -0.5, -13, 1.9],
    [3, -0.5, -18, 2.4],
  ].forEach(([x, y, z, s]) => {
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.set(x, y, z);
    hill.scale.set(s, s * 0.55, s);
    group.add(hill);
  });

  // ---- Cabin -------------------------------------------------------------
  const cabin = new THREE.Group();
  cabin.position.set(0, 0, 0.5);

  const body = track(
    new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 1.8, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x6f4a34, flatShading: true, roughness: 1 })
    )
  );
  body.position.y = 0.9;
  cabin.add(body);

  const roof = track(
    new THREE.Mesh(
      new THREE.ConeGeometry(2.25, 1.4, 4),
      new THREE.MeshStandardMaterial({ color: 0x3f2a20, flatShading: true, roughness: 1 })
    )
  );
  roof.position.y = 2.5;
  roof.rotation.y = Math.PI / 4;
  cabin.add(roof);

  // Warm emissive window on the front face.
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xffca6b,
    emissive: 0xffb257,
    emissiveIntensity: 1,
    flatShading: true,
  });
  disposables.push(windowMat);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), windowMat);
  disposables.push(win.geometry);
  win.position.set(0.55, 1.05, 1.301);
  cabin.add(win);

  // Door.
  const door = track(
    new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 1.05),
      new THREE.MeshStandardMaterial({ color: 0x2e1f18, flatShading: true, roughness: 1 })
    )
  );
  door.position.set(-0.55, 0.55, 1.301);
  cabin.add(door);

  group.add(cabin);

  // ---- Clouds ------------------------------------------------------------
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0x3a4353, flatShading: true, roughness: 1 });
  disposables.push(cloudMat);
  const cloudGeo = new THREE.IcosahedronGeometry(1, 0);
  disposables.push(cloudGeo);
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    const cloud = new THREE.Group();
    const blobs = 3 + Math.floor(Math.random() * 3);
    for (let b = 0; b < blobs; b++) {
      const blob = new THREE.Mesh(cloudGeo, cloudMat);
      blob.position.set((b - blobs / 2) * 1.1, Math.random() * 0.4, Math.random() * 0.6);
      const s = 0.9 + Math.random() * 0.8;
      blob.scale.set(s, s * 0.6, s);
      cloud.add(blob);
    }
    cloud.position.set(-18 + Math.random() * 36, 7 + Math.random() * 3, -14 + Math.random() * 8);
    cloud.userData.speed = 0.25 + Math.random() * 0.35;
    clouds.push(cloud);
    group.add(cloud);
  }

  // ---- Rain --------------------------------------------------------------
  const RAIN = 600;
  const positions = new Float32Array(RAIN * 2 * 3); // 2 endpoints per streak
  const speeds = new Float32Array(RAIN);
  const spawnY = () => 14 + Math.random() * 10;
  for (let i = 0; i < RAIN; i++) {
    const x = (Math.random() - 0.5) * 46;
    const y = spawnY();
    const z = -16 + Math.random() * 22;
    const len = 0.35 + Math.random() * 0.5;
    positions[i * 6 + 0] = x;
    positions[i * 6 + 1] = y;
    positions[i * 6 + 2] = z;
    positions[i * 6 + 3] = x;
    positions[i * 6 + 4] = y - len;
    positions[i * 6 + 5] = z;
    speeds[i] = 16 + Math.random() * 14;
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  disposables.push(rainGeo);
  const rainMat = new THREE.LineBasicMaterial({ color: 0xaebfd4, transparent: true, opacity: 0.45 });
  disposables.push(rainMat);
  const rain = new THREE.LineSegments(rainGeo, rainMat);
  group.add(rain);

  // ---- Animation ---------------------------------------------------------
  function update(dt, t) {
    // Rain fall + wrap.
    const p = rainGeo.attributes.position.array;
    for (let i = 0; i < RAIN; i++) {
      const d = speeds[i] * dt;
      p[i * 6 + 1] -= d;
      p[i * 6 + 4] -= d;
      if (p[i * 6 + 4] < 0) {
        const y = spawnY();
        const len = p[i * 6 + 1] - p[i * 6 + 4];
        p[i * 6 + 1] = y;
        p[i * 6 + 4] = y - len;
      }
    }
    rainGeo.attributes.position.needsUpdate = true;

    // Drifting clouds (wrap across the sky).
    for (const c of clouds) {
      c.position.x += c.userData.speed * dt;
      if (c.position.x > 22) c.position.x = -22;
    }

    // Cozy flicker on the window.
    const flick = 0.85 + Math.sin(t * 2.3) * 0.08 + Math.sin(t * 7.1) * 0.05;
    windowMat.emissiveIntensity = flick;
    windowLight.intensity = 1.3 + flick * 0.5;
  }

  function dispose() {
    for (const d of disposables) d.dispose?.();
  }

  return {
    group,
    bg: SKY,
    fog: new THREE.Fog(SKY, 10, 34),
    camera: { position: [0, 2.4, 9.5], lookAt: [0, 1.4, 0] },
    update,
    dispose,
  };
}
