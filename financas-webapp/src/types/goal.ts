export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  deadline: string;
  category?: string;
}

export interface NewGoal {
  name: string;
  targetAmount: number;
  deadline: string;
  category?: string;
}

export interface GoalFormErrors {
  name?: string;
  targetAmount?: string;
  deadline?: string;
}
