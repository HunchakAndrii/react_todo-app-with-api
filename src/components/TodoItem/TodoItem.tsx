import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { deleteTodoItem } from '../../utils/deleteTodoItem';
import { updateTodo } from '../../api/todos';

type TodoItemProps = {
  todo: Todo;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<string>>;
  isLoadingIds: number[];
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  todos,
  setTodos,
  setError,
  isLoadingIds,
  setIsLoadingIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editingInput = useRef<HTMLInputElement>(null);

  function toggleCompletedTodo() {
    setIsLoadingIds(currentIds => [...currentIds, todo.id]);

    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodo(updatedTodo)
      .then(updatedTodoFromServer => {
        setTodos(currentToDos =>
          currentToDos.map(item =>
            item.id === updatedTodoFromServer.id ? updatedTodoFromServer : item,
          ),
        );
      })
      .catch(() => {
        setError('Unable to update todo');
      })
      .finally(() => {
        setIsLoadingIds(currentIds => currentIds.filter(id => id !== todo.id));
      });
  }

  function renameTodo() {
    if (newTitle.trim() === todo.title) {
      setIsEditing(false);

      return;
    }

    if (newTitle.trim() === '') {
      deleteTodoItem(todo.id, todos, setTodos, setError, setIsLoadingIds);

      return;
    }

    setIsLoadingIds(currentIds => [...currentIds, todo.id]);

    const updatedTodo = { ...todo, title: newTitle.trim() };

    updateTodo(updatedTodo)
      .then(updatedTodoFromServer => {
        setTodos(currentToDos =>
          currentToDos.map(currentTodo =>
            currentTodo.id === updatedTodoFromServer.id
              ? updatedTodoFromServer
              : currentTodo,
          ),
        );
      })
      .catch(() => setError('Unable to update todo'))
      .finally(() => {
        setIsLoadingIds(currentIds => currentIds.filter(id => id !== todo.id));
      });

    setIsEditing(false);
  }

  const cancelEditing = () => {
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        setIsEditing(false);
      }
    });
  };

  useEffect(() => {
    editingInput.current?.focus();
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => {
        setIsEditing(true);
        setNewTitle(todo.title);
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleCompletedTodo()}
        />
      </label>

      {isEditing ? (
        <form onSubmit={renameTodo}>
          <input
            ref={editingInput}
            disabled={isLoadingIds.length > 0}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={renameTodo}
            onKeyUp={cancelEditing}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() =>
              deleteTodoItem(
                todo.id,
                todos,
                setTodos,
                setError,
                setIsLoadingIds,
              )
            }
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
