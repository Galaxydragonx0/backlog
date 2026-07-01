// @ts-nocheck
// Default scene: a rainy evening in a lantern-lit garden.
// A leafy tree on the left, traditional hanging lanterns at varied sizes/depths
// (same model, scaled — near ones bright + lit, far ones small + dim to read as
// distance), realistic leaf cards, and subtle rain. Inspired by warm
// "glowing lanterns in a wet garden at dusk" photography.
//
// Scene contract (shared by every season module):
//   build(THREE) -> { group, bg?, fog?, camera:{position,lookAt}, update(dt,t), dispose() }

export function build(THREE) {
  const group = new THREE.Group();
  const disposables = [];
  const instMeshes = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  const std = (opts) => {
    const m = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 1, ...opts });
    disposables.push(m);
    return m;
  };

  const SKY = new THREE.Color("#0c1811"); // deep dusk green

  // ---- Procedural textures ----------------------------------------------
  function makeLeafTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    g.clearRect(0, 0, 64, 64);
    // leaf silhouette
    g.beginPath();
    g.moveTo(32, 3);
    g.bezierCurveTo(54, 18, 54, 48, 32, 61);
    g.bezierCurveTo(10, 48, 10, 18, 32, 3);
    g.closePath();
    const grd = g.createLinearGradient(0, 4, 0, 60);
    grd.addColorStop(0, "#5a9a54");
    grd.addColorStop(1, "#2c5a31");
    g.fillStyle = grd;
    g.fill();
    // midrib + veins
    g.strokeStyle = "rgba(18,46,22,0.55)";
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(32, 8);
    g.lineTo(32, 57);
    g.stroke();
    g.lineWidth = 0.8;
    for (let i = 0; i < 5; i++) {
      const y = 15 + i * 8;
      g.beginPath();
      g.moveTo(32, y);
      g.lineTo(32 + 11, y + 7);
      g.moveTo(32, y);
      g.lineTo(32 - 11, y + 7);
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }

  function makeGlowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,190,110,0.95)");
    grd.addColorStop(0.35, "rgba(255,120,50,0.5)");
    grd.addColorStop(1, "rgba(255,90,30,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  const leafTex = makeLeafTexture();
  const glowTex = makeGlowTexture();
  disposables.push(leafTex, glowTex);

  // ---- Lighting ----------------------------------------------------------
  group.add(new THREE.AmbientLight(0x24402f, 0.7));
  const dusk = new THREE.DirectionalLight(0x3a5a7e, 0.35);
  dusk.position.set(3, 7, 4);
  group.add(dusk);

  // ---- Distant backdrop --------------------------------------------------
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), std({ color: 0x0b1a12, emissive: 0x08130d, emissiveIntensity: 0.5 }));
  backdrop.position.set(0, 4, -9);
  disposables.push(backdrop.geometry);
  group.add(backdrop);

  // ---- Tree (left of frame) ---------------------------------------------
  const barkMat = std({ color: 0x241811 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.62, 8, 8), barkMat);
  disposables.push(trunk.geometry);
  trunk.position.set(-4.4, 1.2, -0.3);
  trunk.rotation.z = 0.12;
  group.add(trunk);

  const branchGeo = new THREE.CylinderGeometry(0.08, 0.24, 4.2, 6);
  disposables.push(branchGeo);
  [
    [-3.6, 3.4, 0.2, 0.9, -0.5],
    [-3.9, 4.2, -0.6, 0.4, 0.5],
    [-2.8, 3.9, -1.2, 0.7, 0.9],
    [-4.0, 2.6, 0.6, 1.2, -0.2],
  ].forEach(([x, y, z, rz, ry]) => {
    const b = new THREE.Mesh(branchGeo, barkMat);
    b.position.set(x, y, z);
    b.rotation.z = rz;
    b.rotation.y = ry;
    group.add(b);
  });

  // ---- Foliage (realistic leaf cards, instanced, layered for depth) ------
  const leafGeo = new THREE.PlaneGeometry(0.62, 0.92);
  disposables.push(leafGeo);
  const leafMat = new THREE.MeshStandardMaterial({
    map: leafTex,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
    roughness: 0.75,
    metalness: 0.0,
    color: 0xffffff,
  });
  disposables.push(leafMat);

  const inBlob = (r) => {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const rr = r * Math.cbrt(Math.random());
    return [rr * Math.sin(ph) * Math.cos(th), rr * Math.cos(ph) * 0.75, rr * Math.sin(ph) * Math.sin(th)];
  };

  const swayers = [];
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  function addCluster(cx, cy, cz, r, n, bright) {
    const g = new THREE.Group();
    g.position.set(cx, cy, cz);
    const mesh = new THREE.InstancedMesh(leafGeo, leafMat, n);
    for (let i = 0; i < n; i++) {
      const [x, y, z] = inBlob(r);
      dummy.position.set(x, y, z);
      dummy.rotation.set(rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2));
      const s = rand(0.7, 1.4);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      const b = bright * rand(0.8, 1.1);
      col.setRGB(Math.min(b * 0.9, 1), Math.min(b, 1), Math.min(b * 0.72, 1));
      mesh.setColorAt(i, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    g.add(mesh);
    group.add(g);
    instMeshes.push(mesh);
    swayers.push({ g, cx, phase: rand(0, Math.PI * 2), amp: rand(0.02, 0.05), speed: rand(0.4, 0.8) });
    return g;
  }

  addCluster(-3.4, 4.4, 1.0, 2.2, 170, 1.0); // near, left top
  addCluster(-3.2, 2.8, 0.4, 1.7, 120, 0.95); // near lower (by lanterns)
  addCluster(-0.4, 5.2, -0.8, 2.7, 190, 0.85); // mid top center
  addCluster(2.6, 4.4, -1.6, 2.5, 170, 0.75); // right
  addCluster(0.6, 4.2, -4.2, 3.2, 170, 0.5); // far/darker

  // ---- Lantern model (one reusable design) -------------------------------
  const lanternBodyGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.5, 16);
  const lanternTopGeo = new THREE.CylinderGeometry(0.14, 0.28, 0.12, 16);
  const lanternBotGeo = new THREE.CylinderGeometry(0.28, 0.14, 0.12, 16);
  const finialGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.14, 8);
  const tasselGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.42, 6);
  disposables.push(lanternBodyGeo, lanternTopGeo, lanternBotGeo, finialGeo, tasselGeo);

  const bodyBright = std({ color: 0xc0491a, emissive: 0xff6a24, emissiveIntensity: 1.9, roughness: 0.55, flatShading: false });
  const bodyDim = std({ color: 0x7a2f12, emissive: 0xd0501c, emissiveIntensity: 1.0, roughness: 0.7, flatShading: false });
  const capMat = std({ color: 0x241610 });
  const tasselMat = std({ color: 0x7a1f14 });
  const stringMat = new THREE.LineBasicMaterial({ color: 0x1a1109, transparent: true, opacity: 0.55 });
  disposables.push(stringMat);
  const haloBase = new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 1 });
  disposables.push(haloBase);

  function makeLantern(scale, bright, haloOp) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(lanternBodyGeo, bright ? bodyBright : bodyDim));
    const top = new THREE.Mesh(lanternTopGeo, capMat);
    top.position.y = 0.3;
    g.add(top);
    const bot = new THREE.Mesh(lanternBotGeo, capMat);
    bot.position.y = -0.3;
    g.add(bot);
    const fin = new THREE.Mesh(finialGeo, capMat);
    fin.position.y = 0.42;
    g.add(fin);
    const tas = new THREE.Mesh(tasselGeo, tasselMat);
    tas.position.y = -0.56;
    g.add(tas);
    const hmat = haloBase.clone();
    hmat.opacity = haloOp;
    disposables.push(hmat);
    const halo = new THREE.Sprite(hmat);
    halo.scale.set(2.6, 2.6, 1);
    g.add(halo);
    g.userData.halo = hmat;
    g.scale.setScalar(scale);
    return g;
  }

  const lanternSway = [];
  function place(anchor, len, scale, bright, withLight) {
    const pivot = new THREE.Group();
    pivot.position.set(anchor[0], anchor[1], anchor[2]);
    const sg = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -len, 0),
    ]);
    disposables.push(sg);
    pivot.add(new THREE.Line(sg, stringMat));
    const haloOp = bright ? 0.95 : 0.5;
    const lant = makeLantern(scale, bright, haloOp);
    lant.position.set(0, -len, 0);
    pivot.add(lant);
    let light = null;
    if (withLight) {
      light = new THREE.PointLight(0xff7a33, bright ? 2.2 : 1.1, 8, 2);
      light.position.set(0, -len, 0);
      pivot.add(light);
    }
    group.add(pivot);
    lanternSway.push({
      pivot,
      phase: rand(0, Math.PI * 2),
      amp: rand(0.04, 0.08),
      speed: rand(0.5, 0.9),
      halo: lant.userData.halo,
      baseOp: haloOp,
      light,
      baseInt: light ? light.intensity : 0,
    });
  }

  // near (bright, lit) -> far (small, dim). Same model, varied scale/depth.
  place([-3.3, 4.0, 1.1], 1.6, 1.25, true, true);
  place([-3.9, 3.4, 0.5], 2.0, 1.05, true, true);
  place([-0.4, 4.8, -0.6], 2.7, 0.9, false, false);
  place([0.9, 3.5, -1.7], 2.4, 0.68, false, false);
  place([2.4, 3.3, -3.1], 2.4, 0.5, false, false);

  // ---- Background bokeh lanterns (blurred, distant) ----------------------
  for (let i = 0; i < 8; i++) {
    const hmat = haloBase.clone();
    hmat.opacity = rand(0.22, 0.5);
    disposables.push(hmat);
    const s = new THREE.Sprite(hmat);
    const sc = rand(0.7, 1.6);
    s.scale.set(sc, sc, 1);
    s.position.set(rand(-3.5, 3.5), rand(-1.2, 1.8), rand(-5.5, -7.5));
    group.add(s);
  }

  // ---- Subtle rain -------------------------------------------------------
  const RAIN = 170;
  const rp = new Float32Array(RAIN * 6);
  const rs = new Float32Array(RAIN);
  const rx = () => rand(-7, 7);
  for (let i = 0; i < RAIN; i++) {
    const x = rx(), y = rand(0, 9), z = rand(-5, 3);
    const len = rand(0.3, 0.55);
    rp[i * 6 + 0] = x; rp[i * 6 + 1] = y; rp[i * 6 + 2] = z;
    rp[i * 6 + 3] = x + 0.05; rp[i * 6 + 4] = y - len; rp[i * 6 + 5] = z;
    rs[i] = rand(11, 18);
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute("position", new THREE.BufferAttribute(rp, 3));
  disposables.push(rainGeo);
  const rainMat = new THREE.LineBasicMaterial({ color: 0xaebccd, transparent: true, opacity: 0.2 });
  disposables.push(rainMat);
  group.add(new THREE.LineSegments(rainGeo, rainMat));

  // ---- Animation ---------------------------------------------------------
  function update(dt, t) {
    // Foliage sway (per-cluster, layered phases).
    for (const s of swayers) {
      s.g.rotation.z = Math.sin(t * s.speed + s.phase) * s.amp;
      s.g.position.x = s.cx + Math.sin(t * s.speed * 0.7 + s.phase) * 0.05;
    }

    // Lantern pendulum + warm flicker.
    for (const l of lanternSway) {
      l.pivot.rotation.z = Math.sin(t * l.speed + l.phase) * l.amp;
      const f = 0.86 + Math.sin(t * 4 + l.phase) * 0.1 + (Math.random() - 0.5) * 0.05;
      l.halo.opacity = l.baseOp * f;
      if (l.light) l.light.intensity = l.baseInt * f;
    }

    // Subtle rain.
    const p = rainGeo.attributes.position.array;
    for (let i = 0; i < RAIN; i++) {
      const d = rs[i] * dt;
      p[i * 6 + 1] -= d;
      p[i * 6 + 4] -= d;
      if (p[i * 6 + 4] < 0) {
        const x = rx();
        const y = rand(8.5, 9.5);
        const len = p[i * 6 + 1] - p[i * 6 + 4];
        p[i * 6 + 0] = x; p[i * 6 + 1] = y;
        p[i * 6 + 3] = x + 0.05; p[i * 6 + 4] = y - len;
      }
    }
    rainGeo.attributes.position.needsUpdate = true;
  }

  function dispose() {
    for (const d of disposables) d.dispose?.();
    for (const m of instMeshes) m.dispose?.();
  }

  return {
    group,
    bg: SKY,
    fog: new THREE.Fog(SKY, 7, 18),
    camera: { position: [0.2, 2.9, 8.5], lookAt: [0.6, 2.4, -1] },
    update,
    dispose,
  };
}
