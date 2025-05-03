<script>
    let { children } = $props();
    import Header from "$lib/components/Header.svelte";
    import "../app.css";
</script>

<div class="flex flex-col h-screen">
    <Header />
    <div class="flex-1 overflow-auto">
        {@render children()}
    </div>
</div>