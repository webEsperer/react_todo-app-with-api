/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { updateTodo, USER_ID } from './api/todos';
import { useTodos } from './hook/useTodos';
import { Todo, UpdateDataProps } from './types/Todo';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    filterStatus,
    setFilterStatus,
    error,
    setError,
    tempTodo,
    setTempTodo,
    deleteTodosId,
    setDeleteTodosId,
    filteredTodos,
    removeTodo,
    deleteAllCompletedTodos,
    activeTodos,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleRenameTitle = (
    event: React.FormEvent,
    id: number,
    setIsEdditing: (value: boolean) => void,
    newTitle: string,
  ) => {
    event.preventDefault();
    const findTodo = todos.find(todo => todo.id === id);

    if (!findTodo) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (findTodo.title === trimmedTitle) {
      setIsEdditing(false);

      return;
    }

    if (trimmedTitle == '') {
      removeTodo(findTodo.id);

      return;
    }

    const updatedItem = {
      id: findTodo.id,
      title: trimmedTitle,
      completed: findTodo.completed,
    };

    setDeleteTodosId(prev => [...prev, id]);

    updateTodo(updatedItem)
      .then(response => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === findTodo.id ? response : todo)),
        );
        setIsEdditing(false);
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() =>
        setDeleteTodosId(prev => prev.filter(prevTodo => prevTodo !== id)),
      );
  };
  // zrefaktoryzowac kod z updateTodos z tym ponizej powinno byc to samo

  const updatedTodos = (data: UpdateDataProps) => {
    setDeleteTodosId(prev => [...prev, data.id]);

    return updateTodo(data)
      .then(response =>
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === data.id ? response : todo)),
        ),
      )
      .catch(() => setError('Unable to update a todo'))
      .finally(() =>
        setDeleteTodosId(prev => prev.filter(prevTodo => prevTodo !== data.id)),
      );
  };

  const toggleAll = (todoItem?: Todo) => {
    if (todoItem) {
      const updatedItem = {
        id: todoItem.id,
        title: todoItem.title,
        completed: !todoItem.completed,
      };

      updatedTodos(updatedItem);
    } else {
      const hasUncompleted = todos.some(todo => !todo.completed);

      const uncompletedTodo = todos.filter(
        todo => todo.completed === !hasUncompleted,
      );
      const updatedTodosData = uncompletedTodo.map(todo => ({
        id: todo.id,
        title: todo.title,
        completed: hasUncompleted,
      }));

      Promise.all(updatedTodosData.map(todo => updatedTodos(todo)));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          filteredTodos={filteredTodos}
          error={error}
          setError={setError}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          toggleAll={toggleAll}
          activeTodos={activeTodos}
        />
        {todos?.length > 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              deleteTodosId={deleteTodosId}
              toggleAll={toggleAll}
              handleRenameTitle={handleRenameTitle}
            />
            <Footer
              setFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
              filteredTodos={filteredTodos}
              todos={todos}
              deleteAllCompletedTodos={deleteAllCompletedTodos}
            />
          </>
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
