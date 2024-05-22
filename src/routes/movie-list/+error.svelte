<script>
// @ts-nocheck

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	function navigateLogin(){
		goto('/list-menu');
	}

</script>

{#if $page.status >= 400 && $page.status <= 499}
	<div class="error-container">
		<h1 class="status-code">{$page.status}</h1>
		<h3 class="error-message">{$page.error.message}</h3>

		<h2 class="button-label">Pro-Tip:</h2>
		<button class="logon" on:click={navigateLogin}>Try Logging In (click the top right)</button>
	</div>
{/if}

{#if $page.status >= 500}
	<div class="error-container">
		<h1 class="status-code">{$page.status}</h1>
		<h3 class="error-message">Server went to touch grass ONG</h3>

		<h2 class="button-label">Pro-Tip:</h2>
		<button class="logon" style="width: 50rem;">There is no pro tip I have to find the server</button>
	</div>
{/if}


<style>
	@import '../../../styles.css';
	@font-face{
		src: url('../../assets/fonts/PublicPixel.ttf');
		font-family: 'header-font'
	}


	.error-container{
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(5, 2fr);
		height: 100vh;
		width: 100vw;
		margin: 0;
		font-family: 'header-font';
		background-color: #181818;
		color: red;
	}


	.status-code{
		font-size: 5rem;
		grid-row: 2 / 3;
    	grid-column: 2 / 4;
	}


	.error-message{
		font-size: 2rem;
		grid-row: 3 / 4;
    	grid-column: 2 / 6;
	}

	.button-label{
		color: wheat;
		font-size: 1rem;
		grid-row: 5;
    	grid-column: 2 / 3;
	}

	.logon{
		display: block;
		color: red;
		background-color: midnightblue;
		height: 2.5rem;
		margin-top: 3rem;
		font-family: 'header-font';
		width: 42rem;
		box-shadow: none;
		grid-row: 5;
    	grid-column: 2 / 4;
	}

	/* .error-container::before{
		grid-row: 1/-1;
		grid-column: 1/-1;
		content: '';
		background-image: url('../../assets/distraction.jpg');
		background-size: cover;
		opacity: 0.75;
	} */
</style>