import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";  // 'type'キーワードを追加

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const msg = body;  // フロントから送られるのは { msg } オブジェクト
        console.log(msg);
        
        if (!msg || !msg.content) {
            return json({ error: "メッセージが不正です" }, { status: 400 });
        }
        
        console.log("受信メッセージ:", msg);

        const response = { role: "assistant", content: "Hello! How can I help you today?" }
        
        // ここでメッセージの処理を行う
        // 例: データベースへの保存やAIへの送信など
        
        // 応答を返す
        return json({
            success: true,
            message: "メッセージを受信しました",
            data: response  // 必要に応じて加工したデータを返す
        });
    } catch (error) {
        console.error("リクエスト処理エラー:", error);
        return json({ 
            success: false, 
            error: "リクエスト処理中にエラーが発生しました" 
        }, { status: 500 });
    }
};