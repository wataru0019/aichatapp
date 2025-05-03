<script lang="ts">
    import Logout from "./Logout.svelte";
    import Login from "./Login.svelte";
    import { supabase } from '$lib/supabaseClient';
    import { user, isLoading } from '$lib/stores/authStore';
    import { onMount } from 'svelte';
    
    // 現在のセッションを確認
    export const checkSession = async () => {
        isLoading.set(true);
        
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
            user.set(data.session.user);
        } else {
            user.set(null);
        }
        
        isLoading.set(false);
        return data.session;
    };

    onMount(() => {
        // ページがマウントされたときにセッションを確認
        checkSession();
    });

</script>

<script context="module">
    // コンポーネント間で共有するストア
    import { writable } from 'svelte/store';
    export const sidebarOpen = writable(false);
</script>

<header class="flex items-center justify-between p-3 md:p-4 bg-gray-50">
    <div class="left flex items-center">
        <!-- モバイル用メニューボタン -->
        <button 
            class="mr-3 sm:hidden p-1.5 rounded-full hover:bg-gray-200"
            on:click={() => sidebarOpen.update(value => !value)}
            aria-label="Toggle menu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
        <a href="/" class="text-lg md:text-xl font-bold">AI Chat App</a>
    </div>
    <div class="right flex items-center space-x-2 md:space-x-4">
        {#if $user}
            <p class="text-gray-700 text-sm md:text-base hidden sm:block">ようこそ、{$user.email}さん</p>
            <p class="text-gray-700 text-sm md:text-base sm:hidden">ようこそ</p>
            <Logout />
        {:else}
            <Login />
        {/if}
    </div>
</header>