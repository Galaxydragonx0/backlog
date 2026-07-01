// @ts-nocheck
// Maps the current date to a season, and lazily loads the matching low-poly
// scene module. Scenes that aren't built yet fall back to the default (rainy)
// scene so the background never breaks as the calendar rolls over.

/** Northern-hemisphere season from a Date. */
export function getSeasonKey(date = new Date()) {
  const m = date.getMonth() + 1; // 1-12
  if (m === 12 || m <= 2) return "winter";
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  return "fall"; // 9-11
}

// Only scenes that actually exist get a loader here.
const sceneLoaders = {
  rainy: () => import("./scenes/rainy.js"),
  // winter: () => import("./scenes/winter.js"),
  // spring: () => import("./scenes/spring.js"),
  // summer: () => import("./scenes/summer.js"),
  // fall:   () => import("./scenes/fall.js"),
};

// Which scene each season should show. Point a season at its own scene once
// it's built; until then it uses "rainy".
const seasonToScene = {
  default: "rainy",
  winter: "rainy", // TODO -> "winter"
  spring: "rainy", // TODO -> "spring"
  summer: "rainy", // TODO -> "summer"
  fall: "rainy", // TODO -> "fall"
};

/**
 * Resolve a requested key (a season like "summer", or a scene name like
 * "rainy") to a concrete, built scene loader.
 */
function resolveLoader(key) {
  if (sceneLoaders[key]) return sceneLoaders[key]; // direct scene name (dev/testing)
  const mapped = seasonToScene[key] || seasonToScene.default;
  return sceneLoaders[mapped] || sceneLoaders.rainy;
}

/** Dynamically import the scene and return its `build(THREE)` factory. */
export async function loadScene(key) {
  const mod = await resolveLoader(key)();
  return mod.build;
}
