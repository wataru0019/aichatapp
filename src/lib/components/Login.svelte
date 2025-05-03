<script lang="ts">
    import { goto } from '$app/navigation';

    const handleClick = async () => {
        goto('/auth/login');
    }
</script>

<div>
    <button class="bg-green-500 text-white p-2 rounded cursor-pointer" on:click={handleClick}>
        ログイン
    </button>
</div>
