export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
  quiz?: Question[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  summary?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SubjectModule {
  id: string;
  name: string;
  code: string;
  description: string;
  class11: Chapter[];
  class12: Chapter[];
  externalResources?: {
    title: string;
    url: string;
    type: 'ncert' | 'diksha' | 'other';
    grade: 11 | 12;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface StudyPlanDay {
  day: number;
  topics: {
    chapterTitle: string;
    topicTitle: string;
    action: string;
  }[];
}

export interface StudyPlan {
  subjectId: string;
  generateDate: string;
  days: StudyPlanDay[];
}
