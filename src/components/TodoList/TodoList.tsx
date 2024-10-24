import { TodoItem } from '../TodoItem/TodoItem';
import { TodoListProps } from '../../types/TodoListProps';

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  setTodos,
  tempTodo,
  setError,
  isLoadingIds,
  setIsLoadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          isLoadingIds={isLoadingIds}
          setIsLoadingIds={setIsLoadingIds}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
