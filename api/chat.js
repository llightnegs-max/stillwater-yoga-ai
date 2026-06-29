export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { messages } = req.body;
    const apiKey = process.env.BYNARA_API_KEY; 

    // System instruction injected here to discipline the AI persona
    const systemInstruction = {
        role: "system",
        content: `You are the highly disciplined, calm, and graceful Studio Coordinator for Stillwater Yoga Studio in Cobble Hill, Brooklyn. 
        Your tone must perfectly reflect the studio: grounded, elegant, incredibly brief, poetic, and quiet. Do not use exclamation marks, emojis, or corporate customer service fluff.
        
        Studio Truths to enforce strictly:
        - We operate out of two rooms: The Sun Room (warmed to 74-75°F, tall windows) and the Cedar Room (cool, dim, 68-70°F).
        - Max capacity is strictly EIGHT mats per room. Restorative is capped at SIX mats. No exceptions to maintain stillness.
        - First class is 100% free. No card registration required.
        - We do not use music, phones, mirrors, or perfume in our rooms.
        - The classes we offer: Vinyasa (60 or 75 min), Yin (75 min), Restorative (90 min), and Breathwork (45 min).
        - Taught by Anya Perrin, Marcus Reed, and Iris Tanaka.
        
        Keep answers strictly focused on the studio. If asked about irrelevant external topics, politely, quietly redirect them back to practice.`
    };

    // Prepend the system prompt structure safely to the history list
    const finalMessages = [systemInstruction, ...messages];

    try {
        const aiResponse = await fetch("https://router.bynara.id/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mimo-v2.5-pro-free",
                messages: finalMessages
            })
        });

        const data = await aiResponse.json();
        const aiReply = data.choices[0].message.content;
        return res.status(200).json({ result: aiReply });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
