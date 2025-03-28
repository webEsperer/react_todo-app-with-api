export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type UpdateDataProps = {
  id: number;
  completed: boolean;
  title: string;
};
