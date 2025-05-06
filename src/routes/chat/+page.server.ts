import { supabase } from "$lib/supabaseClient"

async function readMessages() {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('chat_id, messages, chat_title')
          
          if (error) {
            console.error('Error reading messages:', error);
            throw error;
          }
        // console.log('Read data:', data);
        return data;
    } catch (e) {
        console.error('Caught error:', e);
        throw e;
    }
}

export async function load() {
    const data = await readMessages();
    if (data) {
        console.log('Data:', data);
        
        const returnData = data.map((item) => {
            // const parseMessages = JSON.parse(item.messages);
            // console.log('Parsed Messages:', item.messages);
            const ai_human_messages = item.messages.filter((msg) => {
                return msg.id.includes("HumanMessage") || msg.id.includes("AIMessageChunk");
            })
            console.log('AI and Human Messages:', ai_human_messages);
            const messages = ai_human_messages.map((msg) => {
                return {
                    role: msg.id.includes("HumanMessage") ? "user" : "assistant",
                    content: msg.kwargs.content
                }
            })
            console.log('Messages:', messages);
            return {
                id: item.chat_id,
                title: item.chat_title,
                messages: messages
            }
        })
        // console.log('Return Data:', returnData.messages);
        return { chatHistory: returnData }
    }
    return {
        chatHistory: [
            { 
                id: 1,
                title: "ChatHistory",
                messages: [
                    { role: "user", content: "Hello!" },
                    { role: "assistant", content: "Hello! How can I help you today?" }
                ]
            },
            { 
                id: 2,
                title: "ChatHistory",
                messages: [
                    { role: "user", content: "Hello!" },
                    { role: "assistant", content: "Hello! How can I help you today?" }
                ]
            },
            { 
                id: 3,
                title: "ChatHistory",
                messages: [
                    { role: "user", content: "Hello!" },
                    { role: "assistant", content: "Hello! How can I help you today?" }
                ]
            },
            { 
                id: 4,
                title: "ChatHistory",
                messages: [
                    { role: "user", content: "Hello!" },
                    { role: "assistant", content: "Hello! How can I help you today?" }
                ]
            },
            { 
                id: 5,
                title: "ChatHistory",
                messages: [
                    { role: "user", content: "Hello!" },
                    { role: "assistant", content: "Hello! How can I help you today?" }
                ]
            },
        ]
    }
}