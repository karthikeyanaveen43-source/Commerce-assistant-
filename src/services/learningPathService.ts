import { GoogleGenAI } from "@google/genai";
import { ProgressData } from "../lib/progressStore";
import { SubjectModule } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface LearningPathRecommendation {
  focusAreas: {
    topicId: string;
    reason: string;
    action: string;
  }[];
  summary: string;
  nextSteps: string[];
}

export const generateLearningPath = async (
  subject: SubjectModule,
  progress: ProgressData
): Promise<LearningPathRecommendation> => {
  try {
    const studentData = {
      completedTopics: progress.completedTopics,
      quizScores: progress.quizScores,
      engagement: progress.engagement,
    };

    const allTopics = [...subject.class11, ...subject.class12].flatMap(chapter => chapter.topics);

    const prompt = `
      As an expert Commerce Tutor, analyze this student's progress in '${subject.name}' and generate a personalized learning path.
      
      STUDENT PROGRESS DATA:
      ${JSON.stringify(studentData, null, 2)}
      
      COURSE STRUCTURE:
      - Class 11 Topics: ${subject.class11.flatMap(c => c.topics).map(t => t.id + ": " + t.title).join(", ")}
      - Class 12 Topics: ${subject.class12.flatMap(c => c.topics).map(t => t.id + ": " + t.title).join(", ")}
      
      Identify areas where the student is struggling (low quiz scores or low engagement in required topics) and where they are excelling. 
      Suggest exactly 2-3 focus topics.
      
      Respond STRICTLY in JSON format with this structure:
      {
        "focusAreas": [
          { "topicId": "string", "reason": "why focus here", "action": "recommended action" }
        ],
        "summary": "short encouraging summary of current status",
        "nextSteps": ["string", "string"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text || "";
    
    // Attempt to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Invalid response format from AI");
  } catch (error) {
    console.error("Learning Path Error:", error);
    return {
      focusAreas: [],
      summary: "We couldn't generate a personalized path right now. keep studying your current unit!",
      nextSteps: ["Complete your next quiz to get better insights."]
    };
  }
};
