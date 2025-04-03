import classNames from 'classnames';
import { useEffect } from 'react';
import { useTodosContext } from '../../hook/TodosContext';

export const ErrorNotification = () => {
  const { error, dispatch } = useTodosContext();

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeError = setTimeout(() => {
      dispatch({ type: 'SET_ERROR', payload: '' });
    }, 3000);

    return () => {
      clearTimeout(timeError);
    };
  }, [error, dispatch]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
    </div>
  );
};

//

// import classNames from 'classnames';
// import { useEffect } from 'react';

// type Props = {
//   error: string;
//   setError: (value: string) => void;
// };

// export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
//   useEffect(() => {
//     if (!error) {
//       return;
//     }

//     const timeError = setTimeout(() => {
//       setError('');
//     }, 3000);

//     return () => {
//       clearTimeout(timeError);
//     };
//   }, [error, setError]);

//   return (
//     <div
//       data-cy="ErrorNotification"
//       className={classNames(
//         'notification is-danger is-light has-text-weight-normal',
//         { hidden: !error },
//       )}
//     >
//       <button data-cy="HideErrorButton" type="button" className="delete" />
//       {error}
//     </div>
//   );
// };
