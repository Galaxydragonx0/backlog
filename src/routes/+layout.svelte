<script>
	// Root layout: global mobile/device baseline applied to every route.
</script>

<slot />

<style>
	/* Dark backdrop everywhere so the Dynamic Island (iPhone 15 Pro) and
	   centre punch-hole (Oppo Find X8 Ultra) areas never flash white when
	   the page renders edge-to-edge (viewport-fit=cover). */
	:global(html) {
		background-color: #181818;
		color-scheme: dark;
		/* Expose the device safe-area insets as variables so any component
		   can opt in without re-deriving them. iOS/Android only populate
		   these when the viewport meta has viewport-fit=cover. */
		--safe-top: env(safe-area-inset-top, 0px);
		--safe-right: env(safe-area-inset-right, 0px);
		--safe-bottom: env(safe-area-inset-bottom, 0px);
		--safe-left: env(safe-area-inset-left, 0px);
	}

	:global(body) {
		background-color: #181818;
		margin: 0;
		/* Stop iOS Safari from auto-inflating text on these tall phones. */
		-webkit-text-size-adjust: 100%;
		text-size-adjust: 100%;
	}

	/* Smoother momentum scrolling + no horizontal rubber-banding on the
	   very narrow/tall viewports of both target devices. */
	:global(html),
	:global(body) {
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
	}
</style>
