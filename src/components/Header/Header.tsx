import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
// import { addTodo } from '../../utils/addTodo';
import { toggleCompletedTodo } from '../../utils/toggleTodo';
import { createTodo } from '../../api/todos';

type HeaderProps = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  isLoadingIds: number[];
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  setTodos,
  setTempTodo,
  error,
  setError,
  isLoadingIds,
  setIsLoadingIds,
}) => {
  const [inputValue, setInputValue] = useState('');

  const titleInput = useRef<HTMLInputElement>(null);
  const isCompletedAll = todos.every(todo => todo.completed);

  useEffect(() => {
    titleInput.current?.focus();
  }, [todos, error]);

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();

    setError('');

    if (inputValue.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: 1551,
      title: inputValue.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    const newTodo: Omit<Todo, 'id'> = {
      userId: 1551,
      title: inputValue.trim(),
      completed: false,
    };

    setIsLoadingIds(currentIds => [...currentIds, newTempTodo.id]);

    createTodo(newTodo)
      .then(currentNewTodo => {
        setTodos(currentToDos => [...currentToDos, currentNewTodo]);
        setInputValue('');
        setTempTodo(null);
        setError('');
      })
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .catch(() => {
        setTempTodo(null);
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsLoadingIds(currentIds =>
          currentIds.filter(id => id !== newTempTodo.id),
        );
      });

    // addTodo(
    //   inputValue,
    //   setError,
    //   setTempTodo,
    //   setTodos,
    //   setInputValue,
    //   setIsLoadingIds,
    // );
  }

  const completeAllTodo = () => {
    const todosToUpdate = isCompletedAll
      ? todos
      : todos.filter(todo => !todo.completed);

    const idsToLoad = todosToUpdate.map(todo => todo.id);

    setIsLoadingIds(currentIds => [...currentIds, ...idsToLoad]);

    setTimeout(() => {
      Promise.all(
        todosToUpdate.map(todo => {
          return toggleCompletedTodo(todo, setIsLoadingIds, setTodos, setError);
        }),
      ).finally(() => {
        setIsLoadingIds([]);
      });
    }, 300);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={completeAllTodo}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={titleInput}
          disabled={isLoadingIds.length > 0}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
