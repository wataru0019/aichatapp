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

<header class="flex items-center justify-between p-4 bg-gray-50">
    <div class="left">

    </div>
    <div class="right flex items-center space-x-4">
        {#if $user}
            <p class="text-gray-700">ようこそ、{$user.email}さん</p>
            <Logout />
        {:else}
            <Login />
        {/if}
    </div>
</header>