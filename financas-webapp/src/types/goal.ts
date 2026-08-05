export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  startDate?: string;
  deadline: string;
  categoryId?: number;
  categoryName?: string;
}

export interface NewGoal {
  name: string;
  targetAmount: number;
  deadline: string;
  categoryId?: number;
}

export interface GoalFormErrors {
  name?: string;
  targetAmount?: string;
  deadline?: string;
}
