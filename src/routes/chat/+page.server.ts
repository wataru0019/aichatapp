import { supabase } from "$lib/supabaseClient"
import type { PageServerLoad } from "./$types";

async function readMessages(userId: string | null) {
    if (!userId) {
        console.log('No user ID provided to readMessages.');
        return [];
    }
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('chat_id, messages, chat_title')
            .eq('user_id', userId);
          
          if (error) {
            console.error('Error reading messages:', error);
            throw error;
          }
        return data;
    } catch (e) {
        console.error('Caught error:', e);
        throw e;
    }
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => { // load関数の型を修正し、eventを引数に追加
    let userId = null;
    try {
        const { data } = await supabase.auth.getSession(); // event.locals.getSession() を使用
        if (data.session) {
            userId = data.session.user.id;
        } else {
        }
    } catch (e) {
        console.error('Caught error getting session in load:', e);
    }

    const data = await readMessages(userId);
    if (data && data.length > 0) {
            const returnData = data.map((item) => {
            // const parseMessages = JSON.parse(item.messages);
            // console.log('Parsed Messages:', item.messages);
            const ai_human_messages = item.messages.filter((msg) => {
                return msg.id.includes("HumanMessage") || msg.id.includes("AIMessageChunk");
            })
            // console.log('AI and Human Messages:', ai_human_messages);
            const messages = ai_human_messages.map((msg) => {
                return {
                    role: msg.id.includes("HumanMessage") ? "user" : "assistant",
                    content: msg.kwargs.content
                }
            })
            // console.log('Messages:', messages);
            return {
                id: item.chat_id,
                title: item.chat_title,
                messages: messages
            }
        })
        return { chatHistory: returnData };
    }
    // デフォルトのチャット履歴を返す部分も、ユーザーIDがない場合に適切に処理するように修正
    if (!userId) {
        return {
            chatHistory: []
        };
    }
    return {
        chatHistory: [] // ログインしているがデータがない場合は空の履歴
    };
};

// export async function load() {
//     const data = await readMessages();
//     if (data) {
//         // console.log('Data:', data);
        
//         const returnData = data.map((item) => {
//             // const parseMessages = JSON.parse(item.messages);
//             // console.log('Parsed Messages:', item.messages);
//             const ai_human_messages = item.messages.filter((msg) => {
//                 return msg.id.includes("HumanMessage") || msg.id.includes("AIMessageChunk");
//             })
//             // console.log('AI and Human Messages:', ai_human_messages);
//             const messages = ai_human_messages.map((msg) => {
//                 return {
//                     role: msg.id.includes("HumanMessage") ? "user" : "assistant",
//                     content: msg.kwargs.content
//                 }
//             })
//             // console.log('Messages:', messages);
//             return {
//                 id: item.chat_id,
//                 title: item.chat_title,
//                 messages: messages
//             }
//         })
//         // console.log('Return Data:', returnData.messages);
//         return { chatHistory: returnData }
//     }
//     return {
//         chatHistory: []
//     }
// }