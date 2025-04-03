import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { useTodosContext } from '../../hook/TodosContext';

export const Header = () => {
  const {
    filteredTodos,
    error,
    activeTodos,
    toggleCompleted,
    handleNewTodo,
    title,
    handleTitle,
    isLoading,
  } = useTodosContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [filteredTodos.length, error]);

  const hasAllTodosCompleted = filteredTodos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {activeTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: hasAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleCompleted()}
        />
      )}

      <form onSubmit={event => handleNewTodo(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => handleTitle(event)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};

// import { Todo } from '../../types/Todo';
// import classNames from 'classnames';
// import { useNewTodo } from '../../hook/useNewTodo';

// type Props = {
//   filteredTodos: Todo[];
//   error: string;
//   setError: (value: string) => void;
//   toggleCompleted: () => void;
//   setTodos: (fn: SetTodosFuncion) => void;
//   setTempTodo: (tempTask: Todo | null) => void;
//   activeTodos: boolean;
// };

// type SetTodosFuncion = (todo: Todo[]) => Todo[];

// export const Header: React.FC<Props> = ({
//   filteredTodos,
//   error,
//   setError,
//   setTodos,
//   setTempTodo,
//   toggleCompleted,
//   activeTodos,
// }) => {
//   const { title, isLoading, inputRef, handleTitle, handleNewTodo } = useNewTodo(
//     { filteredTodos, error, setError, setTodos, setTempTodo },
//   );

//   const hasAllTodosCompleted = filteredTodos.every(todo => todo.completed);

//   return (
//     <header className="todoapp__header">
//       {activeTodos && (
//         <button
//           type="button"
//           className={classNames('todoapp__toggle-all', {
//             active: hasAllTodosCompleted,
//           })}
//           data-cy="ToggleAllButton"
//           onClick={() => toggleCompleted()}
//         />
//       )}

//       <form onSubmit={event => handleNewTodo(event)}>
//         <input
//           data-cy="NewTodoField"
//           type="text"
//           className="todoapp__new-todo"
//           placeholder="What needs to be done?"
//           value={title}
//           onChange={event => handleTitle(event)}
//           ref={inputRef}
//           disabled={isLoading}
//         />
//       </form>
//     </header>
//   );
// };
