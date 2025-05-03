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
    <button 
        class="bg-pink-500 text-white py-1.5 px-3 md:p-2 text-sm md:text-base rounded cursor-pointer hover:bg-pink-400 transition-colors" 
        on:click={handleClick}>
        ログアウト
    </button>
</div>