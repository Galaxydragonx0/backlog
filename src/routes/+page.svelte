<!-- the first landing page I created with a component -->

<script>
	import { base } from '$app/paths';
</script>
<a href="{base}/list-menu">
	<div class="container">
		<h1 class="line-1 site">
			the backlog
		</h1>
	</div>
</a>

<style>
	@import '../../styles.css';
	@font-face{
		font-family: "header-font";
		src: url('../../static/fonts/PublicPixel.ttf');
	}
	.container{
		height: 100vh;
		width: 100vw;
		background-color: #181818;
	}

	.line-1{
		position: relative;
		top: 50%;  
		width: fit-content;
		margin: 0 auto;
		border-right: 2px solid rgba(255,255,255,.75);
		font-size: 180%;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		transform: translateY(-50%);  
		font-family: "header-font";  
		color: rgb(141, 0, 0);
	}

	/* Animation */
	.site{
		animation: typewriter 4s steps(44) 1s 1 normal both,
				blinkTextCursor 500ms steps(44) infinite normal;
		
	}
	@keyframes typewriter{
		from{width: 0;}
		to{width: 12em;}
	}
	@keyframes blinkTextCursor{
		from{border-right-color: rgba(255, 255, 255, 0.75);}
		to{border-right-color: transparent;}
	}

</style>
