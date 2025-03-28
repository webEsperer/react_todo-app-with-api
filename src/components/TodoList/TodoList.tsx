import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItems';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  deleteTodosId: number[];
  toggleAll: (todo: Todo) => void | undefined;
  handleRenameTitle: (
    event: React.FormEvent,
    id: number,
    setIsEdditing: (value: boolean) => void,
    newTitle: string,
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  removeTodo,
  deleteTodosId,
  toggleAll,
  handleRenameTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          deleteTodosId={deleteTodosId}
          toggleAll={toggleAll}
          handleRenameTitle={handleRenameTitle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          toggleAll={toggleAll}
          handleRenameTitle={handleRenameTitle}
        />
      )}
    </section>
  );
};
