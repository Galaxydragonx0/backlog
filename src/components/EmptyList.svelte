<script>
// @ts-nocheck
    import Icon from "@iconify/svelte";
    export let message;
</script>
<div class= container>
    <div class="search-message">
        <Icon icon="pixelarticons:search" style="font-size:3rem;"/>
    </div>
    <h2>{message}</h2>
</div>


<style>
    .container{
        margin-top: 3rem;
    }
</style>