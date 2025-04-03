/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useContext } from 'react';
// import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
// import { USER_ID } from './api/todos';
// import { useTodos } from './hook/useTodos';
import { TodosProvider } from './hook/TodosContext';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header />
          <TodoList />
          <Footer />
        </div>
        <ErrorNotification />
      </div>
    </TodosProvider>
  );
};
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useContext } from 'react';
// import { UserWarning } from './UserWarning';
// import { TodoList } from './components/TodoList';
// import { Footer } from './components/Footer';
// import { Header } from './components/Header';
// import { ErrorNotification } from './components/ErrorNotification';
// import { USER_ID } from './api/todos';
// import { useTodos } from './hook/useTodos';
// import {
//   TodosContext,
//   TodosProvider,
//   useTodosContext,
// } from './hook/TodosContext';

// export const App: React.FC = () => {
// const {
//   // todos,
//   // setTodos,
//   filterStatus,
//   setFilterStatus,
//   // error,
//   // setError,
//   tempTodo,
//   setTempTodo,
//   filteredTodos,
//   processingTodoIds,
//   removeTodo,
//   deleteAllCompletedTodos,
//   activeTodos,
//   handleRenameTitle,
//   toggleCompleted,
// } = useTodos();

// if (!USER_ID) {
//   return <UserWarning />;
// }

// return (
//   <TodosProvider>
//     <div className="todoapp">
//       <h1 className="todoapp__title">todos</h1>

//       <div className="todoapp__content">
//         <Header
//           filteredTodos={filteredTodos}
//           error={error}
//           setError={setError}
//           setTodos={setTodos}
//           setTempTodo={setTempTodo}
//           toggleCompleted={toggleCompleted}
//           activeTodos={activeTodos}
//         />
//         {todos?.length > 0 && (
//           <>
//             <TodoList
//               filteredTodos={filteredTodos}
//               tempTodo={tempTodo}
//               removeTodo={removeTodo}
//               processingTodoIds={processingTodoIds}
//               toggleCompleted={toggleCompleted}
//               handleRenameTitle={handleRenameTitle}
//             />
//             <Footer
//               setFilterStatus={setFilterStatus}
//               filterStatus={filterStatus}
//               filteredTodos={filteredTodos}
//               todos={todos}
//               deleteAllCompletedTodos={deleteAllCompletedTodos}
//             />
//           </>
//         )}
//       </div>
//       <ErrorNotification error={error} setError={setError} />
//     </div>
//   </TodosProvider>
// );
// };
