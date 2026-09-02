import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lost, found } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not found in .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a campus lost and found matching AI.
    Compare the LOST items list with the FOUND items list.
    Find if any lost item likely matches any found item based on itemName, description, and location.
    
    If you find a match with score > 70, return ONLY a valid JSON object like this:
    {
      "item1_id": "id_of_lost_item",
      "item2_id": "id_of_found_item", 
      "score": 90,
      "reason": "Short reason why they match, like Same item and location"
    }
    
    If no match, return: {"score": 0}
    
    LOST ITEMS: ${JSON.stringify(lost)}
    FOUND ITEMS: ${JSON.stringify(found)}
    `;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean the response to get only JSON
    const jsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const json = JSON.parse(jsonText);
    
    return NextResponse.json(json);
    
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}