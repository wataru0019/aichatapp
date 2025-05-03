<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { user, isLoading } from '$lib/stores/authStore';


    const handleClick = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            user.set(null); // ユーザー情報をクリア
            goto('/');
        }
    }
</script>

<div>
    <button class="bg-pink-500 text-white p-2 rounded cursor-pointer" on:click={handleClick}>
        ログアウト
    </button>
</div>