import { api } from './api';
import type { Goal, NewGoal } from '../types/goal';

export const goalsService = {
  fetchAll: async (): Promise<Goal[]> => {
    const response = await api.get<Goal[]>('/goals');
    return response.data;
  },

  create: async (goal: NewGoal): Promise<Goal> => {
    const response = await api.post<Goal>('/goals', goal);
    return response.data;
  },
};
