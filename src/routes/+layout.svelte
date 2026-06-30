<script>
	// Root layout: global mobile/device baseline applied to every route.
	import { onNavigate } from '$app/navigation';

	// Smooth cross-fade + slide between pages via the View Transitions API.
	// Works in Chrome (Oppo Find X8 Ultra) and Safari 18+ (iPhone 15 Pro);
	// where unsupported it simply navigates instantly (no error).
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
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

	/* ---- Page transitions (View Transitions API) ---- */
	@keyframes -global-vt-fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	@keyframes -global-vt-fade-out {
		to {
			opacity: 0;
			transform: translateY(-8px);
		}
	}
	:global(::view-transition-old(root)) {
		animation: vt-fade-out 0.22s ease both;
	}
	:global(::view-transition-new(root)) {
		animation: vt-fade-in 0.28s ease both;
	}
	/* Respect users who ask for less motion. */
	@media (prefers-reduced-motion: reduce) {
		:global(::view-transition-old(root)),
		:global(::view-transition-new(root)) {
			animation: none;
		}
	}
</style>
