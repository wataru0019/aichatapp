<script lang="ts">

</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="h-full w-120 mx-auto p-12 m-12 bg-white rounded shadow-lg">
        <h2 class="p-4 text-2xl font-bold text-center">新規登録</h2>
        <form class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <label for="email">メールアドレス：</label>
                <input type="email" placeholder="Email" class="p-2 rounded border outline-none border-gray-200" />
            </div>
            <div class="flex flex-col gap-2"> 
                <label for="password">パスワード：</label>
                <input type="password" placeholder="Password" class="p-2 rounded border outline-none border-gray-200" />
            </div>
            <div class="flex justify-center">
                <button type="submit" class="bg-green-500 text-white p-2 rounded cursor-pointer">送信</button>
            </div>
        </form>
    </div>
</div>