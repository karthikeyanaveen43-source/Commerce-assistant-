import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const getTopicExplanation = async (topicTitle: string, currentContent: string, mode: 'deep-dive' | 'mnemonic' | 'case-study' | 'summary') => {
  try {
    const prompts = {
      'deep-dive': `Explain "${topicTitle}" in detail. Break down the logic, explain why it matters in Commerce, and use professional terminology with simple explanations.`,
      'mnemonic': `Provide 2-3 creative mnemonics or memory tricks to help a student remember the key points of "${topicTitle}".`,
      'case-study': `Provide a real-world business case study or scenario that illustrates the principles of "${topicTitle}". Show how it applies to a real company or economy.`,
      'summary': `Give me a 3-bullet point "Power Summary" of "${topicTitle}" for quick revision.`
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${prompts[mode]}\n\nBase Content context: ${currentContent}`,
      config: {
        systemInstruction: "You are the Wisey AI Advanced Tutor. Format your output using clear headings, bold text for key terms, and bullet points where appropriate. Do not use markdown code blocks for the text, just clean formatted text.",
      },
    });

    return response.text || "I couldn't generate that insight right now.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Error generating AI insight.";
  }
};

export const getTeacherExplanation = async (subject: string, topicTitle: string, currentContent: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert commerce teacher specializing in ${subject}. Explain the topic "${topicTitle}" as if you are giving a live lecture to a class. 
      Use a warm, engaging teacher persona. Break it down into:
      1. The "Why" - Why do we care about this?
      2. The "How" - How does it work in practice?
      3. The "Gotcha" - Common mistakes students make.
      4. A concluding thought.
      
      Topic Content: ${currentContent}`,
      config: {
        systemInstruction: `You are Professor Wisey, an elite Commerce Teacher. Format your lecture with structured headings (###), bold key terms, and engaging rhetorical questions. Focus on extreme clarity.`,
      },
    });

    return response.text || "Professor Wisey is unavailable for this lecture right now.";
  } catch (error) {
    console.error("Teacher Explanation Error:", error);
    return "Error connecting to the AI teacher.";
  }
};

export const getTopicSummary = async (topicTitle: string, currentContent: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a high-impact, 1-minute summary of the topic "${topicTitle}". 
      Focus on the absolutely essential "Must-Know" facts for examinations.
      
      Topic Content: ${currentContent}`,
      config: {
        systemInstruction: "You are an AI Exam Expert. Provide a concise summary in exactly 3-4 bullet points. No fluff.",
      },
    });

    return response.text || "I couldn't summarize this topic at the moment.";
  } catch (error) {
    console.error("Summary Error:", error);
    return "Error generating summary.";
  }
};

export const getChapterRecap = async (chapterTitle: string, topics: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a high-level overview and "Big Picture" recap of the chapter: "${chapterTitle}".
      Here are the topics covered in this chapter: ${topics}
      
      Your goal is to connect the dots between these topics. Use a professional yet encouraging tone.`,
      config: {
        systemInstruction: "You are an AI Academic Advisor. Summarize the chapter into: 1. Core Narrative, 2. Key Takeaways, 3. How to approach this for exams.",
      },
    });

    return response.text || "I couldn't generate a recap for this chapter.";
  } catch (error) {
    console.error("Chapter Recap Error:", error);
    return "Error connecting to AI advisor.";
  }
};

export const getVeoVideoPrompt = async (topicTitle: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a cinematic, high-fidelity video generation prompt for the "Veo" model to create an educational explainer video about "${topicTitle}". 
      Also provide a 3-sentence narration script that would go with this video.
      
      Topic Content: ${content}
      
      Respond in JSON format:
      {
        "veoPrompt": "detailed prompt for video generation",
        "script": "narration text",
        "style": "cinematic / minimal / motion-graphics"
      }`,
    });
    
    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    
    return {
      veoPrompt: `A high-quality educational motion graphics video explaining ${topicTitle}, featuring 3D financial charts and professional lighting.`,
      script: `Welcome to this explainer on ${topicTitle}. Let's dive into the core mechanics...`,
      style: "cinematic"
    };
  } catch (error) {
    console.error("Veo Prompt Error:", error);
    return null;
  }
};

export const getDeepDive = (topic: string, content: string) => getTopicExplanation(topic, content, 'deep-dive');
export const getCaseStudy = (topic: string, content: string) => getTopicExplanation(topic, content, 'case-study');
export const getMnemonics = (topic: string, content: string) => getTopicExplanation(topic, content, 'mnemonic');
export const getPowerSummary = (topic: string, content: string) => getTopicExplanation(topic, content, 'summary');

export const getGeminiResponse = async (prompt: string, context?: string) => {
  try {
    const fullPrompt = context 
      ? `Context: ${context}\n\nUser Question: ${prompt}\n\nPlease provide a helpful, educational response for a Commerce student.`
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        systemInstruction: "You are 'Wisey', the TradeWise AI Commerce Mentor. You are expert in Accounting, Business Studies, Economics, and Financial Management. Your goal is to help students understand complex commerce concepts with simple examples, real-world analogies, and encouraging feedback. Keep responses concise and formatted for readability.",
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong while connecting to the AI Mentor. Please check your connection.";
  }
};
