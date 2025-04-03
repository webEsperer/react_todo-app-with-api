import { TodoItem } from '../TodoItems';
import { useTodosContext } from '../../hook/TodosContext';

export const TodoList = () => {
  const { todos, filteredTodos, tempTodo } = useTodosContext();

  if (!todos?.length) {
    return null;
  }

  return (
    todos?.length > 0 && (
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
        {tempTodo && <TodoItem todo={tempTodo} />}
      </section>
    )
  );
};

//
// import React from 'react';
// import { TitleType, Todo } from '../../types/Todo';
// import { TodoItem } from '../TodoItems';

// type Props = {
//   filteredTodos: Todo[];
//   tempTodo: Todo | null;
//   removeTodo: (id: number) => void;
//   processingTodoIds: number[];
//   toggleCompleted: (todo: Todo) => void | undefined;
//   handleRenameTitle: (params: TitleType) => void;
// };

// export const TodoList: React.FC<Props> = ({
//   filteredTodos,
//   tempTodo,
//   removeTodo,
//   processingTodoIds,
//   toggleCompleted,
//   handleRenameTitle,
// }) => {
//   return (
//     <section className="todoapp__main" data-cy="TodoList">
//       {filteredTodos.map(todo => (
//         <TodoItem
//           key={todo.id}
//           todo={todo}
//           removeTodo={removeTodo}
//           isProcessing={processingTodoIds?.includes(todo.id)}
//           toggleCompleted={toggleCompleted}
//           handleRenameTitle={handleRenameTitle}
//         />
//       ))}
//       {tempTodo && (
//         <TodoItem
//           todo={tempTodo}
//           removeTodo={removeTodo}
//           toggleCompleted={toggleCompleted}
//           handleRenameTitle={handleRenameTitle}
//         />
//       )}
//     </section>
//   );
// };
