<script>
    let { children } = $props();
    import Header from "$lib/components/Header.svelte";
    import "../app.css";
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="flex flex-col h-screen">
    <Header />
    <div class="flex-1 overflow-auto">
        {@render children()}
    </div>
</div>