<script>
// @ts-nocheck

	import { page } from '$app/stores';
    import { error } from '@sveltejs/kit';
</script>
<h1>{$page.status}</h1>
<h5>{$page.error.message}</h5>