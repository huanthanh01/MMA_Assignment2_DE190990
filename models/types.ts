export interface User {
  id: number;
  fullname: string;
  email: string;
  username: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  tags?: string[];
  priority: "High" | "Medium" | "Low";
  startDate?: Date;
  dueDate?: Date;
  note?: string;
  subtasks?: Subtask[];
}
