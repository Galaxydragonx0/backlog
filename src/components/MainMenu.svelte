<script>
	import { base } from '$app/paths';	
	let bottomActive = true;
	let topActive = true;
	let navigating = false;
</script>


<div class="container">
	<div class="top"
	on:mouseenter={() => {
		if(!navigating)
		{
			topActive = false;
		}
			
	}}

	on:mouseleave={() => {
		if(!navigating)
		{
			topActive = true;
		}
			
	}}>
		<a href="{base}/list-menu">  <h1 >Lists</h1> </a>
		<p class:topActive>View your lists here</p>
	</div>


	<div class="bottom" on:mouseenter={() => {
		if(!navigating)
		{
			bottomActive = false;
		}
			
	}}
	
	on:mouseleave={() => {
		if(!navigating)
		{
			bottomActive = true;
		}
			
	}}>
		<h1 >Browse</h1>
		<p class:bottomActive >Browse titles to add to your lists here</p>
		
	</div>
	

		

</div>



<style>

	.container{
		height: 100%;
		margin: 0px;
	
	}


	.bottomActive, .topActive{
		display: none;
	}

	.bottom, .top{
		width:100%;
		height: 50%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.bottom{
		background-color:red;
	}

	.top{
		background-color:blue;
	}


	/* mobile styles */
	
</style>
