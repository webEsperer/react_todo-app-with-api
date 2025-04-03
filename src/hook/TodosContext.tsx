import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  Dispatch,
} from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { TitleType, Todo, UpdateDataProps } from '../types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { UserWarning } from '../UserWarning';

type TodoState = {
  todos: Todo[];
  filterTodosStatus: FilterStatus;
  error: string;
  tempTodo: Todo | null;
  processingTodoIds: number[];
  title: string;
  isLoading: boolean;
};

const initialState: TodoState = {
  todos: [],
  filterTodosStatus: FilterStatus.ALL,
  error: '',
  tempTodo: null,
  processingTodoIds: [],
  title: '',
  isLoading: false,
};

type TodosAction =
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'SET_FILTER_STATUS'; payload: FilterStatus }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'REMOVE_TODO'; payload: number }
  | { type: 'UPDATE_TODO'; payload: { id: number; response: Todo } }
  | { type: 'PROCESSING_TODO_ADD'; payload: number }
  | { type: 'PROCESSING_TODO_REMOVE'; payload: number }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TEMP_TODO'; payload: Todo | null };

const reducer = (state: TodoState, action: TodosAction): TodoState => {
  switch (action.type) {
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload,
      };
    case 'SET_FILTER_STATUS':
      return {
        ...state,
        filterTodosStatus: action.payload,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload.response : todo,
        ),
      };
    case 'PROCESSING_TODO_ADD':
      return {
        ...state,
        processingTodoIds: [...state.processingTodoIds, action.payload],
      };
    case 'PROCESSING_TODO_REMOVE':
      return {
        ...state,
        processingTodoIds: state.processingTodoIds.filter(
          todoId => todoId !== action.payload,
        ),
      };
    case 'SET_TITLE':
      return {
        ...state,
        title: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'TEMP_TODO':
      return {
        ...state,
        tempTodo: action.payload,
      };
    default:
      return state;
  }
};

type TodosContextType = {
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

export const TodosContext = createContext<TodosContextType | undefined>(
  undefined,
);

export const useTodosContext = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodosContext must be used with TodoProvider');
  }

  return context;
};

export const TodosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_ERROR', payload: '' });

    getTodos()
      .then(data => dispatch({ type: 'SET_TODOS', payload: data }))
      .catch(() =>
        dispatch({ type: 'SET_ERROR', payload: 'Unable to load todos' }),
      );
  }, []);

  const activeTodos = useMemo(
    () => state.todos.length > 0,
    [state.todos.length],
  );

  const filteredTodos = useMemo(() => {
    switch (state.filterTodosStatus) {
      case FilterStatus.ACTIVE:
        return state.todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filterTodosStatus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_TITLE', payload: event.target.value });
  };

  const addNewTodo = (newTask: Omit<Todo, 'id'>) => {
    const tempTask: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTask.title,
      completed: false,
    };

    dispatch({ type: 'TEMP_TODO', payload: tempTask });

    dispatch({ type: 'SET_LOADING', payload: true });

    addTodo(newTask)
      .then(data => {
        dispatch({ type: 'ADD_TODO', payload: data });
        dispatch({ type: 'TEMP_TODO', payload: null });
        dispatch({ type: 'SET_TITLE', payload: '' });
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR', payload: 'Unable to add a todo' });
        dispatch({ type: 'TEMP_TODO', payload: null });
      })
      .finally(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      });
  };

  const handleNewTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimTitle = state.title.trim();

    if (!trimTitle) {
      dispatch({ type: 'SET_ERROR', payload: 'Title should not be empty' });

      return;
    }

    const newTodoTask = {
      userId: USER_ID,
      title: trimTitle,
      completed: false,
    };

    addNewTodo(newTodoTask);
  };

  const removeTodo = (id: number) => {
    dispatch({ type: 'PROCESSING_TODO_ADD', payload: id });

    return deleteTodo(id)
      .then(() => dispatch({ type: 'REMOVE_TODO', payload: id }))
      .catch(() =>
        dispatch({ type: 'SET_ERROR', payload: 'Unable to delete a todo' }),
      )
      .finally(() => dispatch({ type: 'PROCESSING_TODO_REMOVE', payload: id }));
  };

  const updatedTodos = (data: UpdateDataProps) => {
    dispatch({ type: 'PROCESSING_TODO_ADD', payload: data.id });

    return updateTodo(data)
      .then(response =>
        dispatch({ type: 'UPDATE_TODO', payload: { response, id: data.id } }),
      )
      .catch(() =>
        dispatch({ type: 'SET_ERROR', payload: 'Unable to update a todo' }),
      )
      .finally(() =>
        dispatch({ type: 'PROCESSING_TODO_REMOVE', payload: data.id }),
      );
  };

  const handleRenameTitle = ({
    event,
    id,
    newTitle,
    setIsEditing,
  }: TitleType) => {
    event.preventDefault();
    const findTodo = state.todos.find(todo => todo.id === id);

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

    dispatch({ type: 'PROCESSING_TODO_ADD', payload: id });

    updateTodo(updatedTitle)
      .then(response => {
        dispatch({
          type: 'UPDATE_TODO',
          payload: { response, id: updatedTitle.id },
        });
        setIsEditing(false);
      })
      .catch(() =>
        dispatch({ type: 'SET_ERROR', payload: 'Unable to update a todo' }),
      )
      .finally(() =>
        dispatch({ type: 'PROCESSING_TODO_REMOVE', payload: updatedTitle.id }),
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
      const hasUncompleted = state.todos.some(todo => !todo.completed);

      const uncompletedTodo = state.todos.filter(
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
    const completedTodos = state.todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    Promise.allSettled(completedTodos.map(todo => removeTodo(todo.id)));
  };

  return (
    <TodosContext.Provider
      value={{
        todos: state.todos,
        error: state.error,
        filteredTodos,
        handleTitle,
        toggleCompleted,
        activeTodos,
        deleteAllCompletedTodos,
        removeTodo,
        handleRenameTitle,
        processingTodoIds: state.processingTodoIds,
        handleNewTodo,
        title: state.title,
        isLoading: state.isLoading,
        tempTodo: state.tempTodo,
        filterTodosStatus: state.filterTodosStatus,
        dispatch,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

// return (
//   <TodosContext.Provider value= {{
//       todos: state.todos,
//       error: state.error,
//       filteredTodos,
//       toggleCompleted,
//       activeTodos,

//         deleteAllCompletedTodos,
//         removeTodo,
//         handleRenameTitle,
//         processingTodoIds: state.processingTodoIds,
//   }}> {children} </TodosContext.Provider>
// )

//
// import { useEffect, useMemo, useState } from 'react';
// import { FilterStatus } from '../types/FilterStatus';
// import { TitleType, Todo, UpdateDataProps } from '../types/Todo';
// import { deleteTodo, getTodos, updateTodo } from '../api/todos';

// export const useTodos = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [filterStatus, setFilterStatus] = useState<FilterStatus>(
//     FilterStatus.ALL,
//   );
//   const [error, setError] = useState<string>('');
//   const [tempTodo, setTempTodo] = useState<Todo | null>(null);
//   const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

//   useEffect(() => {
//     setError('');
//     getTodos()
//       .then(data => setTodos(data))
//       .catch(() => setError('Unable to load todos'));
//   }, []);

//   const activeTodos = useMemo(() => todos.length > 0, [todos.length]);

//   const filteredTodos = useMemo(() => {
//     switch (filterStatus) {
//       case FilterStatus.ACTIVE:
//         return todos.filter(todo => !todo.completed);
//       case FilterStatus.COMPLETED:
//         return todos.filter(todo => todo.completed);
//       default:
//         return todos;
//     }
//   }, [todos, filterStatus]);

//   const removeTodo = (id: number) => {
//     setProcessingTodoIds(prev => [...prev, id]);

//     return deleteTodo(id)
//       .then(() => {
//         setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== id));
//       })
//       .catch(() => setError('Unable to delete a todo'))
//       .finally(() => {
//         setProcessingTodoIds(prev => prev.filter(prevTodo => prevTodo !== id));
//       });
//   };

//   const updatedTodos = (data: UpdateDataProps) => {
//     setProcessingTodoIds(prev => [...prev, data.id]);

//     return updateTodo(data)
//       .then(response =>
//         setTodos(prevTodos =>
//           prevTodos.map(todo => (todo.id === data.id ? response : todo)),
//         ),
//       )
//       .catch(() => setError('Unable to update a todo'))
//       .finally(() =>
//         setProcessingTodoIds(prev =>
//           prev.filter(prevTodo => prevTodo !== data.id),
//         ),
//       );
//   };

//   const handleRenameTitle = ({
//     event,
//     id,
//     setIsEditing,
//     newTitle,
//   }: TitleType) => {
//     event.preventDefault();
//     const findTodo = todos.find(todo => todo.id === id);

//     if (!findTodo) {
//       return;
//     }

//     const trimmedTitle = newTitle.trim();

//     if (findTodo.title === trimmedTitle) {
//       setIsEditing(false);

//       return;
//     }

//     if (trimmedTitle == '') {
//       removeTodo(findTodo.id);

//       return;
//     }

//     const updatedTitle = {
//       id: findTodo.id,
//       title: trimmedTitle,
//     };

//     setProcessingTodoIds(prev => [...prev, id]);

//     updateTodo(updatedTitle)
//       .then(response => {
//         setTodos(prevTodos =>
//           prevTodos.map(todo => (todo.id === findTodo.id ? response : todo)),
//         );
//         setIsEditing(false);
//       })
//       .catch(() => setError('Unable to update a todo'))
//       .finally(() =>
//         setProcessingTodoIds(prev => prev.filter(prevTodo => prevTodo !== id)),
//       );
//   };

//   const toggleCompleted = (todoItem?: Todo) => {
//     if (todoItem) {
//       const updateCompletedField = {
//         id: todoItem.id,
//         completed: !todoItem.completed,
//       };

//       updatedTodos(updateCompletedField);
//     } else {
//       const hasUncompleted = todos.some(todo => !todo.completed);

//       const uncompletedTodo = todos.filter(
//         todo => todo.completed === !hasUncompleted,
//       );
//       const updateCompletedFields = uncompletedTodo.map(todo => ({
//         id: todo.id,
//         completed: hasUncompleted,
//       }));

//       Promise.all(updateCompletedFields.map(todo => updatedTodos(todo)));
//     }
//   };

//   const deleteAllCompletedTodos = () => {
//     const completedTodos = todos.filter(todo => todo.completed);

//     if (completedTodos.length === 0) {
//       return;
//     }

//     Promise.allSettled(completedTodos.map(todo => removeTodo(todo.id)));
//   };

//   return {
//     todos,
//     setTodos,
//     filterStatus,
//     setFilterStatus,
//     error,
//     setError,
//     tempTodo,
//     setTempTodo,
//     processingTodoIds,
//     setProcessingTodoIds,
//     filteredTodos,
//     removeTodo,
//     deleteAllCompletedTodos,
//     activeTodos,
//     handleRenameTitle,
//     toggleCompleted,
//   };
// };
