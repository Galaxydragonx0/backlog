<script>
  // @ts-nocheck
  // Full-screen low-poly WebGL backdrop. Picks a scene by season (or an
  // override), lazy-loads three.js + the scene module, and renders behind the
  // page content. Built for the Oppo X8 Ultra / iPhone 15 Pro:
  //   - capped devicePixelRatio (fill-rate friendly)
  //   - render loop pauses when the tab/app is hidden (battery/PWA)
  //   - honours prefers-reduced-motion (renders one static frame, no loop)
  //   - falls back silently to the CSS/body background if WebGL is unavailable
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { getSeasonKey, loadScene } from "$lib/background/seasons";

  // Force a specific scene/season key. null => auto by date, but a `?scene=`
  // query param still wins (handy for previewing scenes on-device).
  export let scene = null;

  let canvas;

  onMount(() => {
    if (!browser) return;

    let THREE, renderer, sceneObj, camera, current;
    let raf = null;
    let disposed = false;
    let last = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const override = new URLSearchParams(window.location.search).get("scene");
    const key = override || scene || getSeasonKey();

    function render() {
      renderer.render(sceneObj, camera);
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      current?.update?.(dt, now / 1000);
      render();
    }

    function resize() {
      if (!renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) render();
    }

    function onVisibility() {
      if (reduced || disposed) return;
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      } else if (!raf) {
        last = performance.now();
        loop();
      }
    }

    (async () => {
      try {
        THREE = await import("three");
        if (disposed) return;

        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: false,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

        sceneObj = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(52, 1, 0.1, 120);

        const build = await loadScene(key);
        if (disposed) return;
        current = build(THREE);

        if (current.bg) sceneObj.background = current.bg;
        if (current.fog) sceneObj.fog = current.fog;
        sceneObj.add(current.group);

        const cp = current.camera?.position || [0, 2, 10];
        camera.position.set(cp[0], cp[1], cp[2]);
        const la = current.camera?.lookAt || [0, 0, 0];
        camera.lookAt(la[0], la[1], la[2]);

        resize();
        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", onVisibility);

        if (reduced) {
          render(); // single static frame
        } else {
          last = performance.now();
          loop();
        }
      } catch (e) {
        // WebGL unavailable / blocked — leave the plain background in place.
        console.warn("Background: WebGL scene disabled.", e);
      }
    })();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      current?.dispose?.();
      renderer?.dispose();
    };
  });
</script>

<canvas bind:this={canvas} class="bg-canvas" aria-hidden="true"></canvas>
<div class="bg-scrim" aria-hidden="true"></div>

<style>
  /* NOTE: a negative z-index would sit *behind* the opaque global body
     background (set in +layout.svelte) and vanish. Keep these at 0 and rely
     on DOM order — the menu's Header/nav render after <Background /> so they
     paint on top. */
  .bg-canvas {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    display: block;
    z-index: 0;
    pointer-events: none;
  }

  /* Soft darkening so the menu text stays legible over any scene. */
  .bg-scrim {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(
      120% 90% at 50% 20%,
      rgba(0, 0, 0, 0) 40%,
      rgba(0, 0, 0, 0.45) 100%
    );
  }
</style>
