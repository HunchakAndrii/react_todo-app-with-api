import { useState } from 'react';
import { FilterType } from '../../types/FilterType';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import { FooterType } from '../../types/FooterType';

export const Footer: React.FC<FooterType> = ({
  todos,
  setTodos,
  setCurrentFilter,
  setError,
  setIsLoadingIds,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(FilterType.All);

  const completedTodos = todos.filter(todo => todo.completed);
  const TodoCount = todos.length - completedTodos.length;

  const handleFilterChange = (filterType: FilterType) => {
    setActiveFilter(filterType);
    setCurrentFilter(filterType);
  };

  const handleClearComplete = () => {
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setIsLoadingIds(currentIds => [...currentIds, ...completedTodoIds]);

    Promise.allSettled(
      completedTodoIds.map(id => {
        return deleteTodo(id)
          .then(() => {
            setTodos(currentToDos =>
              currentToDos.filter(item => item.id !== id),
            );
          })
          .catch(() => {
            setError('Unable to delete a todo');
          });
      }),
    ).finally(() => {
      setIsLoadingIds([]);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {TodoCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleClearComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
