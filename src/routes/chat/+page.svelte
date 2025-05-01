<script lang="ts">
    import { slide, fade } from "svelte/transition";
    let { data } = $props();
    let displaySidebar = $state(false);
    let selectId = $state(0);
    let textareaElement;
    let message = $state("");

    let charMessages = $state([])

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

    function selectChat(chatId: number) {
        selectId = chatId;
        charMessages = data.chatHistory.find(chat => chat.id === chatId).messages;
        console.log(charMessages);
    }

    async function sendMessage() {
        const msg = { role: "user", content: message }
        try {
            const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(msg)
        });
        const data = await response.json();
        charMessages.push(msg);
        charMessages.push(data.data);
        message = "";
        console.log(data);
        } catch (error) {
            console.error(error);
        }
    }
</script>

<div class="flex h-screen overflow-x-hidden overflow-y-scroll">
    {#if displaySidebar}
    <div id="sidebar" class="text-black w-64 bg-gray-50"
        transition:slide={{ duration: 300, axis: 'x' }}>
        <div class="m-4">
            <div class="flex justify-between select-none">
                <p class="p-2 font-bold">Chat History</p>
                <button onclick={() => displaySidebar = false} class="text-xl cursor-pointer font-bold">×</button>
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
    <div class="w-2 m-4 p-2 cursor-pointer rounded"
        transition:fade={{ duration: 200 }}>
        <button onclick={() => displaySidebar = true} aria-label="Open sidebar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
        </button>
    </div>
    {/if}
    <div id="chatspace" class="flex-1">
        {#if charMessages.length === 0 && selectId === 0}
        <div class="h-screen w-full bg-white flex flex-col justify-center items-center">
            <div class="flex flex-col justify-center items-center">
                <div class="flex flex-col justify-center items-center p-12">
                    <p>Chat Space</p>
                    <p>今日は何をお手伝いしましょうか</p>
                </div>
                <div class="flex items-center">
                    <input type="text" bind:value={message} placeholder="Type your message here..." class="flex-1 w-120 bg-transparent border border-gray-200 outline-none rounded-full py-4 px-8 text-black" />
                    <div class="p-2">
                        <button aria-label="Send message" onclick={sendMessage} class="rounded-full bg-green-500 text-white p-4 cursor-pointer hover:bg-green-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {:else}
        <div class="h-screen w-full bg-white flex flex-col relative">
            <div class="py-12 px-60">
                {#each charMessages as charMessage}
                    {#if charMessage.role === "user"}
                        <div class="flex items-center justify-end p-2">
                            <div class="flex items-center bg-gray-100 rounded-lg p-4">
                                <p>{charMessage.content}</p>
                            </div>
                        </div>
                    {/if}
                    {#if charMessage.role === "assistant"}
                        <div class="flex items-center justify-start p-2">
                            <div class="flex items-center bg-green-300 rounded-lg p-4">
                                <p class="whitespace-pre-wrap">{charMessage.content}</p>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
            <div class="flex flex-col justify-center items-center">
                <div class="flex items-center absolute bottom-10 bg-white w-full">
                    <textarea
                        bind:value={message}
                        rows="1"placeholder="Type your message here..."
                        class="flex-1 w-200 bg-transparent border border-gray-200 outline-none rounded-full py-4 px-8 text-black resize-none"
                        bind:this={textareaElement}
                        oninput={adjustTextareaHeight}
                        >
                    </textarea>
                    <div class="p-2">
                        <button aria-label="Send message" onclick={sendMessage} class="rounded-full bg-green-500 text-white p-4 cursor-pointer hover:bg-green-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/if}
    </div>
</div>