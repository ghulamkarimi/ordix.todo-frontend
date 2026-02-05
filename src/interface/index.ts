export interface IUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  reset_code?: string;
  reset_code_expiration?: Date;
  verificationCode?: string;
}
export type TUser = Partial<IUser>;

export interface ITask {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  due_date: string;
  is_completed: boolean;
  list_id: number;
  user_id: number;
}
export type TTask = Partial<ITask>;

export interface IList {
  id: number;
  name: string;
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

export type TTaskList = Partial<IList>;
