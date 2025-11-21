import { GoogleGenAI, Type } from "@google/genai";
import { MetricData, EndpointStat, AIInsight } from "../types";

const getGeminiClient = () => {
    // In a real app, this would come from an env var, but per instructions we use process.env.API_KEY
    // which creates a dependency on the environment having this set.
    // If API_KEY is missing, we handle gracefully in the UI.
    if (!process.env.API_KEY) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeMetrics = async (
    metrics: MetricData[],
    endpoints: EndpointStat[]
): Promise<AIInsight> => {
    try {
        const ai = getGeminiClient();
        
        // Prepare data summary for the model
        const recentMetrics = metrics.slice(-10); // Analyze last 10 data points
        const topEndpoints = endpoints.sort((a, b) => b.calls - a.calls).slice(0, 5);

        const prompt = `
            Sen kıdemli bir DevOps ve Veri Analisti asistanısın. Aşağıdaki web sitesi metriklerini analiz et.
            Lütfen Türkçe yanıt ver.
            
            Metrik Verileri (Son Örnekler):
            ${JSON.stringify(recentMetrics)}

            En Çok Kullanılan Endpointler:
            ${JSON.stringify(topEndpoints)}

            Görevin:
            1. Genel trafik durumu hakkında kısa bir özet yaz.
            2. Olası anomalileri tespit et (örn: yüksek hata oranı, ani latency artışı).
            3. Performans iyileştirmesi için öneriler sun.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        anomalies: { 
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        recommendations: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from Gemini");
        
        return JSON.parse(text) as AIInsight;

    } catch (error) {
        console.error("Gemini analysis failed:", error);
        // Fallback in case of error (e.g., no API key)
        return {
            summary: "Analiz servisine şu anda ulaşılamıyor veya API anahtarı eksik.",
            anomalies: ["Veri analizi yapılamadı."],
            recommendations: ["API anahtarınızı kontrol edin."]
        };
    }
};