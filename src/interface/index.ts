export interface IUser {
    id: number;
    username: string;
    email: string;
    password?: string; // Optional, weil du das Passwort z. B. nie vom Backend bekommst
    createdAt?: Date;
    updatedAt?: Date;
    reset_code?: string;
    reset_code_expiration?: Date;
    verificationCode?: string;
  }
export type TUser = Partial<IUser>

export interface ITask {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TTask = Partial<ITask>

export interface IList {    
    id: number;
    name: string;
    tasks: ITask[];
    createdAt: Date;
    updatedAt: Date;
}

export type TTaskList = Partial<IList>
 