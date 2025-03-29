/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { TitleType, Todo } from '../../types/Todo';
import React, { useState } from 'react';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  isProcessing?: boolean;
  toggleCompleted: (todo: Todo) => void | undefined;
  handleRenameTitle: (params: TitleType) => void;
};

export const TodoItem = ({
  todo,
  removeTodo,
  isProcessing,
  toggleCompleted,
  handleRenameTitle,
}: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(todo.title);
  const { title, completed, id } = todo;

  const handleTitleKeyEvents = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      handleRenameTitle({ event, id, setIsEditing, newTitle });
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label" htmlFor={`status-${id}`}>
        <input
          id={`status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleCompleted(todo)}
        />
      </label>
      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyDown={handleTitleKeyEvents}
            autoFocus
            onBlur={event => {
              handleRenameTitle({ event, id, setIsEditing, newTitle });
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': (todo && !id) || isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
