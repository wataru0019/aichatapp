<script lang="ts">
    import { goto } from '$app/navigation';

    const handleClick = async () => {
        goto('/auth/login');
    }
</script>

<div>
    <button 
        class="bg-green-500 text-white py-1.5 px-3 md:p-2 text-sm md:text-base rounded cursor-pointer hover:bg-green-400 transition-colors" 
        on:click={handleClick}>
        ログイン
    </button>
</div>