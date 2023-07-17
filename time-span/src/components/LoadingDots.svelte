<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    let visible = true;
    onMount(() => {
        setInterval(() => {
            visible = !visible
        }, 1000)
    });

</script>

{#if visible }
    <div class="dot-wrapper">
        <div class="dot"
            transition:fly={{ delay: 500, duration: 300, y: 10, opacity: 1 }}
        >
        </div>
        <div class="dot"
            transition:fly={{ delay: 600, duration: 300, y: 10, opacity: 1 }}
        >
        </div>
        <div class="dot"
            transition:fly={{ delay: 700, duration: 300, y: 10, opacity: 1 }}
        >
        </div>
    </div>
{/if}

<style>
    .dot-wrapper {
        position: relative;
        display: flex;
        gap: 5px;
    }
    .dot {
        height: 5px;
        width: 5px;
        border-radius: 50%;
        background-color: #09e083;
    }
</style>