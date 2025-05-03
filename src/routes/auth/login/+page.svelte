<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { user, isLoading } from '$lib/stores/authStore';
    let email = $state("");
    let password = $state("");
    let loading = $state(false);
    let errorMessage = $state("");

    const handleSubmit = async (e: Event) => {
        e.preventDefault(); // フォームのデフォルト送信を防止
        console.log("fire")
        
        if (!email || !password) {
            errorMessage = "メールアドレスとパスワードを入力してください";
            return;
        }
        
        loading = true;
        errorMessage = "";
        
        try {
            console.log("サインアップ処理を開始");
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            user.set(data.user);
            console.log("サインアップ成功:", data);
            // 成功時の処理（リダイレクトなど）
            goto('/chat'); // ルートにリダイレクト
            return data;
            
        } catch (error) {
            console.error('サインアップエラー:', error);
            errorMessage = error.message || "サインアップに失敗しました";
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex flex-col items-center justify-center h-full">
    <div class="h-100 w-120 mx-auto p-12 m-12 bg-white rounded border border-gray-200">
        <h2 class="p-4 text-2xl font-bold text-center">ログイン</h2>
        <form class="flex flex-col gap-4" on:submit={handleSubmit}>
            {#if errorMessage}
                <div class="text-red-500 text-center">{errorMessage}</div>
            {/if}
            <div class="flex flex-col gap-2">
                <label for="email">メールアドレス：</label>
                <input 
                    type="email" 
                    placeholder="Email" 
                    class="p-2 rounded border outline-none border-gray-200"
                    bind:value={email}
                    required
                    />
            </div>
            <div class="flex flex-col gap-2 pb-4"> 
                <label for="password">パスワード：</label>
                <input 
                    type="password" 
                    placeholder="Password" 
                    class="p-2 rounded border outline-none border-gray-200"
                    bind:value={password}
                    required
                     />
            </div>
            <div class="w-full">
                <button type="submit" class="w-full bg-green-500 text-white p-2 rounded cursor-pointer">送信</button>
            </div>
        </form>
    </div>
</div>