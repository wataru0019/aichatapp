<!-- src/routes/auth/login/+page.svelte -->
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
            console.log("ログイン処理を開始");
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            user.set(data.user);
            console.log("ログイン成功:", data);
            // 成功時の処理（リダイレクトなど）
            goto('/chat'); // チャットページにリダイレクト
            return data;
            
        } catch (error) {
            console.error('ログインエラー:', error);
            errorMessage = error.message || "ログインに失敗しました";
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="flex flex-col items-center justify-center h-full px-4 py-6">
    <div class="w-full max-w-md mx-auto p-6 sm:p-8 md:p-12 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 class="text-xl sm:text-2xl font-bold text-center mb-6">ログイン</h2>
        
        <form class="flex flex-col gap-4" on:submit={handleSubmit}>
            {#if errorMessage}
                <div class="text-red-500 text-center text-sm sm:text-base p-2 bg-red-50 rounded">{errorMessage}</div>
            {/if}
            
            <div class="flex flex-col gap-2">
                <label for="email" class="text-sm sm:text-base">メールアドレス：</label>
                <input 
                    type="email" 
                    id="email"
                    placeholder="メールアドレスを入力" 
                    class="p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-300 transition"
                    bind:value={email}
                    required
                    />
            </div>
            
            <div class="flex flex-col gap-2 pb-2"> 
                <label for="password" class="text-sm sm:text-base">パスワード：</label>
                <input 
                    type="password"
                    id="password" 
                    placeholder="パスワードを入力" 
                    class="p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-300 transition"
                    bind:value={password}
                    required
                    />
            </div>
            
            <div class="w-full mt-2">
                <button 
                    type="submit" 
                    class="w-full bg-green-500 text-white p-3 rounded-md cursor-pointer hover:bg-green-400 transition-colors flex justify-center items-center"
                    disabled={loading}
                >
                    {#if loading}
                        <svg class="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    {/if}
                    {loading ? 'ログイン中...' : 'ログイン'}
                </button>
            </div>
            
            <div class="text-center mt-4">
                <p class="text-sm text-gray-600">
                    アカウントをお持ちでない方は 
                    <a href="/auth/signup" class="text-green-600 hover:underline">新規登録</a>
                </p>
            </div>
        </form>
    </div>
</div>