<script>
	// @ts-nocheck
	// Google sign-in / account modal, driven by Firebase Auth.
	import { createEventDispatcher } from 'svelte';
	import { authUser, signInWithGoogle, logout } from '$lib/firebase/auth';

	// @ts-ignore
	export let showModal; // boolean

	/** @type {HTMLDialogElement} */
	let dialog;
	let error = '';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('closeModal', showModal);
	}

	async function handleSignIn() {
		error = '';
		try {
			await signInWithGoogle();
			dialog?.close();
		} catch (e) {
			// Surface the real Firebase error code so failures are diagnosable.
			console.error('Google sign-in failed:', e);
			if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
				error = '';
			} else {
				error = e?.code ? `Sign-in failed: ${e.code}` : 'Sign-in failed. Try again.';
			}
		}
	}

	async function handleLogout() {
		error = '';
		try {
			await logout();
			dialog?.close();
		} catch (e) {
			error = 'Logout failed. Try again.';
		}
	}

	// @ts-ignore
	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="dialog-pop"
	bind:this={dialog}
	on:close={() => {
		showModal = false;
	}}
	on:click|self={() => {
		closeModal();
		dialog.close();
	}}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="form-container" on:click|stopPropagation>
		{#if $authUser}
			<div class="account">
				{#if $authUser.photoURL}
					<img class="avatar-img" src={$authUser.photoURL} alt="" referrerpolicy="no-referrer" />
				{/if}
				{#if $authUser.displayName}
					<h3 class="name">{$authUser.displayName}</h3>
				{/if}
				<p class="account-email">{$authUser.email}</p>
				<button class="btn" on:click={handleLogout}>Logout</button>
			</div>
		{:else}
			<div class="signin">
				<p class="prompt">Sign in to sync your backlog</p>
				<button class="btn google" on:click={handleSignIn}>
					<span class="g">G</span> Sign in with Google
				</button>
			</div>
		{/if}
		{#if error}
			<p class="error">{error}</p>
		{/if}
	</div>
</dialog>

<style>
	@font-face {
		font-family: 'header-font';
		src: url('../../static/fonts/PublicPixel.ttf');
	}

	.prompt,
	.name,
	.account-email,
	.btn {
		font-family: 'header-font';
	}

	.account {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.avatar-img {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		margin-bottom: 0.75rem;
	}

	.name {
		color: #cf4343;
		margin: 0 0 0.25rem;
		text-align: center;
	}

	.account-email {
		font-size: 0.9rem;
		color: wheat;
		margin: 0 0 1.5rem;
		text-align: center;
		word-break: break-all;
	}

	.prompt {
		font-size: 1.1rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: red;
		background-color: midnightblue;
		min-height: 2.75rem;
		padding: 0 1rem;
		margin: 0 auto;
		font-family: 'header-font';
		width: 17rem;
		max-width: 100%;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}

	.btn.google {
		color: wheat;
	}

	.btn .g {
		font-weight: 900;
		color: #ea4335;
	}

	.error {
		font-size: 0.8rem;
		color: #975151;
		text-align: center;
		margin-top: 1rem;
	}

	.dialog-pop {
		backdrop-filter: blur(10px) saturate(4);
		background: rgb(0 0 0 / 69%);
		border-radius: 10px;
		color: wheat;
		padding: 1.5rem;
		border: none;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
