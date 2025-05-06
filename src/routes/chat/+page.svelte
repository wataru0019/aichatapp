<script lang="ts">
    import { slide, fade } from "svelte/transition";
    import { onMount } from 'svelte';
    import { sidebarOpen } from '$lib/components/Header.svelte';
    
    let { data } = $props();
    let displaySidebar = $state(false);
    let selectId = $state(0);
    let textareaElement;
    let message = $state("");
    let charMessages = $state([])
    let streamingResponse = $state("");
    let isStreaming = $state(false);
    // 画面サイズの監視を追加
    let isMobile = $state(false);

    // 画面幅を監視する関数
    function checkMobileView() {
        isMobile = window.innerWidth < 768; // 768px未満をモバイルと定義
    }

    // マウント時とリサイズ時に画面幅を確認
    onMount(() => {
        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        
        // ストアの購読
        const unsubscribe = sidebarOpen.subscribe(value => {
            displaySidebar = value;
        });
        
        return () => {
            window.removeEventListener('resize', checkMobileView);
            unsubscribe();
        };
    });

    function adjustTextareaHeight() {
        if (textareaElement) {
            // 一度高さをリセット
            textareaElement.style.height = 'auto';
            // スクロール高さに合わせて高さを設定
            textareaElement.style.height = textareaElement.scrollHeight + 'px';
            
            // 丸みを調整（内容が増えたら角丸を減らす）
            if (textareaElement.scrollHeight > 40) {
                textareaElement.classList.remove('rounded-full');
                textareaElement.classList.add('rounded-2xl');
            } else {
                textareaElement.classList.remove('rounded-2xl');
                textareaElement.classList.add('rounded-full');
            }
        }
    }

    // ストリーミングを開始する関数を追加
    async function startStreaming() {
        try {
            streamingResponse = ""; // ストリーミングレスポンスをリセット
            
            // 一時的な応答メッセージをチャットに追加
            const tempAssistantMsg = { role: "assistant", content: "" };
            charMessages.push(tempAssistantMsg);
            
            // バックエンドのストリームエンドポイントを呼び出す
            const body = {
                messages: message,
                chatId: selectId,
            }
            const response = await fetch('https://mybackend.www-shoin.workers.dev/api/agent/memory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            // メッセージをクリア
            message = "";
            
            if (!response.body) {
                throw new Error("ReadableStream not supported");
            }
            
            // レスポンスストリームの読み込み
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            let done = false;
            
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                
                if (done) break;
                
                // 受信したテキストをデコード
                const chunk = decoder.decode(value, { stream: true });
                
                // [DONE]マーカーをチェック
                if (chunk.includes('data: [DONE]')) {
                    break;
                }
                
                // レスポンスにチャンクを追加
                streamingResponse += chunk;
                
                // 最後のメッセージを更新
                const lastIndex = charMessages.length - 1;
                charMessages[lastIndex].content = streamingResponse;
            }
            
            isStreaming = false;
        } catch (error) {
            console.error("ストリーミングエラー:", error);
            isStreaming = false;
        }
    }

    function selectChat(chatId: number) {
        selectId = chatId;
        charMessages = data.chatHistory.find(chat => chat.id === chatId).messages;
        console.log(charMessages);
        // モバイルの場合、選択後にサイドバーを閉じる
        if (isMobile) {
            displaySidebar = false;
        }
    }

    async function sendMessage() {
        if (!message.trim()) return; // 空メッセージの送信を防止
        
        isStreaming = true;
        const msg = { role: "user", content: message };
        // まずユーザーメッセージを追加
        charMessages.push(msg);
        
        // ストリーミングを開始
        await startStreaming();
    }

    // Event handler that checks if it's a "real" Enter press
    function handleKeydown(event: KeyboardEvent) {
        // Skip if it's an IME composition event
        if (event.isComposing || event.keyCode === 229) {
            return;
        }
        // ストリーミング中は入力を無視
        if (isStreaming) {
            return;
        }
        
        // Execute your function only on Enter without Shift
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); 
            sendMessage();
        }
    }

</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="flex h-full overflow-hidden relative">
    <!-- モバイルでのサイドバーは絶対位置で配置 -->
    {#if displaySidebar}
    <div id="sidebar" 
         class="text-black bg-gray-50 z-10 {isMobile ? 'fixed inset-0 w-full h-full' : 'w-64'}"
         transition:slide={{ duration: 300, axis: 'x' }}>
        <div class="m-4">
            <div class="flex justify-between select-none">
                <p class="p-2 font-bold">Chat History</p>
                <button onclick={() => { 
                    displaySidebar = false;
                    sidebarOpen.set(false);
                }} class="text-xl cursor-pointer font-bold p-2">×</button>
            </div>
            <ul>
                {#each data.chatHistory as chat}
                <li 
                    onclick={() => selectChat(chat.id)}
                    class="group flex justify-between items-center h-10 p-2 rounded hover:bg-gray-200 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis relative">
                    <span>{chat.title}</span>
                    <button class="hidden group-hover:block text-gray-500 hover:text-gray-700 absolute right-2 top-1/2 transform -translate-y-1/2">×</button>
                </li>
                {/each}
            </ul>
        </div>
    </div>
    {:else}
    <div class="w-2 m-4 p-2 cursor-pointer rounded fixed top-16 left-0 z-10 hidden sm:block"
        transition:fade={{ duration: 200 }}>
        <button onclick={() => {
            displaySidebar = true;
            sidebarOpen.set(true);
        }} aria-label="Open sidebar" class="bg-white p-2 rounded-full shadow-md">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
    </div>
    {/if}
    <div id="chatspace" class="flex-1">
        {#if charMessages.length === 0 && selectId === 0}
        <div class="h-full w-full bg-white flex flex-col justify-center items-center">
            <div class="flex flex-col justify-center items-center">
                <div class="flex flex-col justify-center items-center p-6 md:p-12 -mt-16 md:-mt-48">
                    <p>Chat Space</p>
                    <p>今日は何をお手伝いしましょうか</p>
                </div>
                <div class="flex items-center w-full px-4 md:px-0 max-w-3xl">
                    <input 
                        type="text" 
                        bind:value={message} 
                        placeholder="Type your message here..." 
                        class="flex-1 bg-transparent border border-gray-200 outline-none rounded-full py-3 md:py-4 px-4 md:px-8 text-black" 
                        onkeydown={handleKeydown} />
                    <div class="p-2">
                        <button 
                            aria-label="Send message" 
                            onclick={sendMessage} 
                            onkeydown={handleKeydown} 
                            class="rounded-full bg-green-500 text-white p-3 md:p-4 cursor-pointer hover:bg-green-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {:else}
        <div class="h-full w-full bg-white flex flex-col relative">
            <div class="pt-12 pb-24 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 overflow-y-scroll">
                {#each charMessages as charMessage}
                    {#if charMessage.role === "user"}
                        <div class="flex items-center justify-end p-2">
                            <div class="flex items-center bg-gray-100 rounded-lg p-3 md:p-4 max-w-[85%] break-words">
                                <p>{charMessage.content}</p>
                            </div>
                        </div>
                    {/if}
                    {#if charMessage.role === "assistant"}
                        <div class="flex items-center justify-start p-2">
                            <div class="flex items-center bg-white border border-gray-100 rounded-lg p-3 md:p-4 max-w-[85%] break-words">
                                <p class="whitespace-pre-wrap">{charMessage.content}</p>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
            <div class="flex flex-col justify-center items-center">
                <div class="flex items-center absolute bottom-0 pb-4 md:pb-10 bg-white w-full px-2 md:px-4">
                    <textarea
                        bind:value={message}
                        rows="1"
                        placeholder="Type your message here..."
                        class="flex-1 bg-transparent border border-gray-200 outline-none rounded-full py-3 md:py-4 px-4 md:px-8 text-black resize-none max-h-32"
                        bind:this={textareaElement}
                        oninput={adjustTextareaHeight}
                        onkeydown={handleKeydown}
                        >
                    </textarea>
                    <div class="p-2">
                        <button 
                            aria-label="Send message" 
                            onclick={sendMessage} 
                            disabled={isStreaming}
                            class="rounded-full bg-green-500 text-white p-3 md:p-4 cursor-pointer hover:bg-green-400 disabled:bg-gray-300">
                            {#if isStreaming}
                                <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            {:else}
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/if}
    </div>
</div>