/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubjectModule, Badge, StudyPlan } from '../types';

// Simple local storage keys
const PROGRESS_KEY = 'tradewise_progress';

export interface QuizScore {
  score: number;
  total: number;
  timestamp: string;
}

export interface ProgressData {
  completedTopics: string[]; // Array of topic IDs
  quizScores: Record<string, QuizScore>; // topicId -> score
  engagement: Record<string, number>; // topicId -> view count
  notes: Record<string, string>; // topicId -> note content
  badges: Badge[];
  studyPlans: Record<string, StudyPlan>; // subjectId -> plan
  timeSpent: Record<string, number>; // topicId -> seconds
  goals: {
    targetCompletion: number;
    deadline?: string;
  };
}

export const getProgress = (): ProgressData => {
  const data = localStorage.getItem(PROGRESS_KEY);
  if (!data) return { completedTopics: [], quizScores: {}, engagement: {}, notes: {}, badges: [], studyPlans: {}, timeSpent: {}, goals: { targetCompletion: 100 } };
  try {
    const parsed = JSON.parse(data);
    return {
      completedTopics: parsed.completedTopics || [],
      quizScores: parsed.quizScores || {},
      engagement: parsed.engagement || {},
      notes: parsed.notes || {},
      badges: parsed.badges || [],
      studyPlans: parsed.studyPlans || {},
      timeSpent: parsed.timeSpent || {},
      goals: parsed.goals || { targetCompletion: 100 }
    };
  } catch (e) {
    return { completedTopics: [], quizScores: {}, engagement: {}, notes: {}, badges: [], studyPlans: {}, timeSpent: {}, goals: { targetCompletion: 100 } };
  }
};

export const saveProgress = (data: ProgressData) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
};

export const saveNote = (topicId: string, content: string) => {
  const progress = getProgress();
  progress.notes[topicId] = content;
  saveProgress(progress);
};

export const getNote = (topicId: string): string => {
  const progress = getProgress();
  return progress.notes[topicId] || '';
};

export const saveQuizScore = (topicId: string, score: number, total: number) => {
  const progress = getProgress();
  progress.quizScores[topicId] = {
    score,
    total,
    timestamp: new Date().toISOString()
  };
  saveProgress(progress);
  window.dispatchEvent(new Event('progressUpdated'));
};

export const trackEngagement = (topicId: string) => {
  const progress = getProgress();
  progress.engagement[topicId] = (progress.engagement[topicId] || 0) + 1;
  saveProgress(progress);
};

export const markTopicComplete = (topicId: string) => {
  const progress = getProgress();
  if (!progress.completedTopics.includes(topicId)) {
    progress.completedTopics.push(topicId);
    saveProgress(progress);
    // Dispatch custom event for cross-component reactivity if needed
    window.dispatchEvent(new Event('progressUpdated'));
  }
};

export const isTopicCompleted = (topicId: string): boolean => {
  const progress = getProgress();
  return progress.completedTopics.includes(topicId);
};

export const saveStudyPlan = (subjectId: string, plan: StudyPlan) => {
  const progress = getProgress();
  progress.studyPlans[subjectId] = plan;
  saveProgress(progress);
};

export const getStudyPlan = (subjectId: string): StudyPlan | null => {
  const progress = getProgress();
  return progress.studyPlans[subjectId] || null;
};

export const unlockBadge = (badge: Omit<Badge, 'unlockedAt'>) => {
  const progress = getProgress();
  if (!progress.badges.find(b => b.id === badge.id)) {
    progress.badges.push({
      ...badge,
      unlockedAt: new Date().toISOString()
    });
    saveProgress(progress);
    window.dispatchEvent(new CustomEvent('badgeUnlocked', { detail: badge }));
  }
};

export const logTimeSpent = (topicId: string, seconds: number) => {
  const progress = getProgress();
  progress.timeSpent[topicId] = (progress.timeSpent[topicId] || 0) + seconds;
  saveProgress(progress);
  window.dispatchEvent(new Event('progressUpdated'));
};

export const setGoal = (target: number, deadline?: string) => {
  const progress = getProgress();
  progress.goals = { targetCompletion: target, deadline };
  saveProgress(progress);
  window.dispatchEvent(new Event('goalUpdated'));
};

export const getSubjectProgress = (subject: SubjectModule) => {
  const progress = getProgress();
  const allTopics = [...subject.class11, ...subject.class12].flatMap(chapter => chapter.topics);
  const allTopicIds = allTopics.map(t => t.id);
  
  if (allTopicIds.length === 0) return 0;
  
  const completedCount = allTopicIds.filter(id => progress.completedTopics.includes(id)).length;
  return Math.round((completedCount / allTopicIds.length) * 100);
};
