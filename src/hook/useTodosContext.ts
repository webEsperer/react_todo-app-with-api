import { useContext } from 'react';
import { TodosContext } from '../context/TodosContext';

export const useTodosContext = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodosContext must be used with TodoProvider');
  }

  return context;
};
