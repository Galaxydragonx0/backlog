<script>
	// @ts-nocheck
	// Shown on list pages when the visitor is signed out (lists require an
	// account). Lets them sign in with Google without leaving the page.
	import { signInWithGoogle } from '$lib/firebase/auth';

	export let message = 'Sign in to view and sync your backlog.';
	let error = '';

	async function go() {
		error = '';
		try {
			await signInWithGoogle();
		} catch (e) {
			if (e?.code !== 'auth/popup-closed-by-user') error = 'Sign-in failed. Try again.';
		}
	}
</script>

<div class="gate">
	<p class="msg">{message}</p>
	<button class="btn" on:click={go}><span class="g">G</span> Sign in with Google</button>
	{#if error}<p class="err">{error}</p>{/if}
</div>

<style>
	.gate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 6rem;
		padding: 1rem;
		text-align: center;
	}

	.msg {
		font-family: 'DotGothic16', sans-serif;
		color: springgreen;
		font-size: 1.1rem;
		margin: 0;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		padding: 0 1.25rem;
		color: wheat;
		background-color: midnightblue;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-family: 'header-font', monospace;
	}

	.g {
		font-weight: 900;
		color: #ea4335;
	}

	.err {
		color: #975151;
		font-size: 0.8rem;
		margin: 0;
	}
</style>
