<!-- src/routes/auth/signup/+page.svelte -->
<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state(""); // パスワード確認用
    let loading = $state(false);
    let errorMessage = $state("");
    let successMessage = $state("");

    const handleSubmit = async (e: Event) => {
        e.preventDefault(); // フォームのデフォルト送信を防止
        
        if (!email || !password) {
            errorMessage = "メールアドレスとパスワードを入力してください";
            return;
        }

        // パスワード確認
        if (password !== confirmPassword) {
            errorMessage = "パスワードが一致しません";
            return;
        }
        
        loading = true;
        errorMessage = "";
        successMessage = "";
        
        try {
            console.log("サインアップ処理を開始");
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            
            if (error) throw error;
            console.log("サインアップ成功:", data);

            // メール確認が必要な場合
            if (data?.user?.identities?.length === 0) {
                successMessage = "すでに登録されているメールアドレスです。ログインしてください。";
                setTimeout(() => {
                    goto('/auth/login');
                }, 3000);
                return;
            }
            
            // メール確認が必要なケース
            if (data?.user?.confirmed_at === null) {
                successMessage = "確認メールを送信しました。メールを確認してアカウントを有効化してください。";
                setTimeout(() => {
                    goto('/auth/login');
                }, 3000);
                return;
            }
            
            // 即時ログイン成功のケース
            goto('/chat');
            
        } catch (error) {
            console.error('サインアップエラー:', error);
            errorMessage = error.message || "サインアップに失敗しました";
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
        <h2 class="text-xl sm:text-2xl font-bold text-center mb-6">新規登録</h2>
        
        <form class="flex flex-col gap-4" on:submit={handleSubmit}>
            {#if errorMessage}
                <div class="text-red-500 text-center text-sm sm:text-base p-2 bg-red-50 rounded">{errorMessage}</div>
            {/if}
            
            {#if successMessage}
                <div class="text-green-600 text-center text-sm sm:text-base p-2 bg-green-50 rounded">{successMessage}</div>
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
            
            <div class="flex flex-col gap-2"> 
                <label for="password" class="text-sm sm:text-base">パスワード：</label>
                <input 
                    type="password"
                    id="password" 
                    placeholder="パスワードを入力（6文字以上）" 
                    class="p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-300 transition"
                    bind:value={password}
                    minlength="6"
                    required
                    />
            </div>

            <div class="flex flex-col gap-2 pb-2"> 
                <label for="confirmPassword" class="text-sm sm:text-base">パスワード（確認）：</label>
                <input 
                    type="password"
                    id="confirmPassword" 
                    placeholder="もう一度パスワードを入力" 
                    class="p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-300 transition"
                    bind:value={confirmPassword}
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
                    {loading ? '処理中...' : '新規登録'}
                </button>
            </div>
            
            <div class="text-center mt-4">
                <p class="text-sm text-gray-600">
                    すでにアカウントをお持ちの方は 
                    <a href="/auth/login" class="text-green-600 hover:underline">ログイン</a>
                </p>
            </div>
        </form>
    </div>
</div>