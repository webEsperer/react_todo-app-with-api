import { useEffect, useMemo, useState } from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { TitleType, Todo, UpdateDataProps } from '../types/Todo';
import { deleteTodo, getTodos, updateTodo } from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [error, setError] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    setError('');
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setError('Unable to load todos'));
  }, []);

  const activeTodos = useMemo(() => todos.length > 0, [todos.length]);

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const removeTodo = (id: number) => {
    setProcessingTodoIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(prevTodo => prevTodo !== id));
      });
  };

  const updatedTodos = (data: UpdateDataProps) => {
    setProcessingTodoIds(prev => [...prev, data.id]);

    return updateTodo(data)
      .then(response =>
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === data.id ? response : todo)),
        ),
      )
      .catch(() => setError('Unable to update a todo'))
      .finally(() =>
        setProcessingTodoIds(prev =>
          prev.filter(prevTodo => prevTodo !== data.id),
        ),
      );
  };

  const handleRenameTitle = ({
    event,
    id,
    setIsEditing,
    newTitle,
  }: TitleType) => {
    event.preventDefault();
    const findTodo = todos.find(todo => todo.id === id);

    if (!findTodo) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (findTodo.title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle == '') {
      removeTodo(findTodo.id);

      return;
    }

    const updatedTitle = {
      id: findTodo.id,
      title: trimmedTitle,
    };

    setProcessingTodoIds(prev => [...prev, id]);

    updateTodo(updatedTitle)
      .then(response => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === findTodo.id ? response : todo)),
        );
        setIsEditing(false);
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() =>
        setProcessingTodoIds(prev => prev.filter(prevTodo => prevTodo !== id)),
      );
  };

  const toggleCompleted = (todoItem?: Todo) => {
    if (todoItem) {
      const updateCompletedField = {
        id: todoItem.id,
        completed: !todoItem.completed,
      };

      updatedTodos(updateCompletedField);
    } else {
      const hasUncompleted = todos.some(todo => !todo.completed);

      const uncompletedTodo = todos.filter(
        todo => todo.completed === !hasUncompleted,
      );
      const updateCompletedFields = uncompletedTodo.map(todo => ({
        id: todo.id,
        completed: hasUncompleted,
      }));

      Promise.all(updateCompletedFields.map(todo => updatedTodos(todo)));
    }
  };

  const deleteAllCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    Promise.allSettled(completedTodos.map(todo => removeTodo(todo.id)));
  };

  return {
    todos,
    setTodos,
    filterStatus,
    setFilterStatus,
    error,
    setError,
    tempTodo,
    setTempTodo,
    processingTodoIds,
    setProcessingTodoIds,
    filteredTodos,
    removeTodo,
    deleteAllCompletedTodos,
    activeTodos,
    handleRenameTitle,
    toggleCompleted,
  };
};
