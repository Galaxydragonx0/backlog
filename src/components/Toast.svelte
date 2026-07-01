<script>
  // @ts-nocheck
  import { toasts } from "$lib/toast";
  import { fly, fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import Icon from "@iconify/svelte";
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast"
      in:fly|global={{ y: 24, duration: 260 }}
      out:fade|global={{ duration: 200 }}
      animate:flip={{ duration: 200 }}
    >
      <Icon class="toast-icon" icon="pixelarticons:check" />
      <span class="toast-msg">{toast.message}</span>
    </div>
  {/each}
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=DotGothic16&display=swap");

  .toast-container {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(1.25rem + var(--safe-bottom, env(safe-area-inset-bottom, 0px)));
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
    width: max-content;
    max-width: 90vw;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(4, 15, 65, 0.96);
    color: springgreen;
    font-family: "DotGothic16", sans-serif;
    font-size: 1rem;
    padding: 0.7rem 1.1rem;
    border-radius: 10px;
    border: 1px solid rgba(0, 250, 154, 0.35);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  }

  .toast-msg {
    white-space: nowrap;
  }

  .toast :global(.toast-icon) {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
</style>
