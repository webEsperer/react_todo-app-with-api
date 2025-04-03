import { Dispatch } from 'react';
import { TodosAction } from '../reducer/type';
import { FilterStatus } from '../types/FilterStatus';
import { TitleType, Todo } from '../types/Todo';

export type TodosContextType = {
  todos: Todo[];
  error: string;
  filteredTodos: Todo[];
  handleTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleCompleted: (todoItem?: Todo) => void;
  activeTodos: boolean;
  removeTodo: (id: number) => void;
  deleteAllCompletedTodos: () => void;
  handleRenameTitle: ({ event, id, newTitle }: TitleType) => void;
  processingTodoIds: number[];
  handleNewTodo: (event: React.FormEvent) => void;
  title: string;
  isLoading: boolean;
  tempTodo: Todo | null;
  filterTodosStatus: FilterStatus;
  dispatch: Dispatch<TodosAction>;
};
