<script>
    import Icon from "@iconify/svelte";
</script>

<div class="container">
    <img alt="movie-poster" class="image" src="https://placehold.co/160x250" />
    <div class="info">
        <h2>Title</h2>
        <h4>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
            illum corporis molestias, dolore totam qui sapiente
        </h4>
    </div>
    <div class="buttons">
        <button class="completed">
            <span>
                <Icon style="font-size:1.3rem; color:rgb(13 109 13);" icon="mdi:tick-circle" /></span>
        </button>
    </div>
</div>

<style>
    .completed {
        height: 32px;
        width: 32px;
        background: rgb(139 215 139);
        border: none;
        border-radius: 25px;
        color: #ffffff;
        font-size: 15px;
        font-weight: 550;
        text-align: center;
        overflow: hidden;
        color: rgb(0 0 0);
    }

    .completed:hover span {
        display: none;
    }

    .completed:hover {
        width: 155px;
        transition: width 800ms;
    }

    .completed::after {
        content: "";
        width: 160px;
        display: none;
    }

    .completed:hover::before {
        content: "Mark as Complete";
        display: inline-block;
    }

    .container {
        display: inline-grid;
        grid-template-columns: 1fr 3fr;
        grid-template-areas:
            "poster info info"
            "poster info info"
            "poster button button";
        grid-gap: 5px;
    }

    .container > .image {
        grid-area: poster;
        align-items: center;
    }

    .container > .info {
        grid-area: info;
        font-size: 0.85rem;
        padding-top: 2rem;
    }

    .container > .buttons {
        grid-area: button;
    }

    .image {
        padding: 1rem 1rem 0 0.6rem;
    }

    .info {
        grid-column: 4;
    }

    .buttons {
        padding-top: 1rem;
        grid-column: 5;
    }

    .completed:hover,
    .completed:focus {
        animation: raise 1s;
        box-shadow: 0 0 0 2em transparent;
    }
</style>
