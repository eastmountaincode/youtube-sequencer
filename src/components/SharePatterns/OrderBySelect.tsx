import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setOrderBy } from '../../store/patternsDisplaySlice';

const OrderBySelect = () => {
  const dispatch = useDispatch();
  const orderBy = useSelector((state: RootState) => state.patternsDisplay.orderBy);

  return (
    <div className="mb-4 d-flex justify-content-end">
      <select
        className="form-select bg-dark text-light border-secondary"
        style={{
          width: '200px',
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`
        }}
        value={orderBy}
        onChange={(e) => dispatch(setOrderBy(e.target.value as any))}
      >
        <option value="created_at DESC">Newest First</option>
        <option value="created_at ASC">Oldest First</option>
        <option value="likes_count DESC, created_at DESC">Most Liked</option>
        <option value="likes_count ASC, created_at DESC">Least Liked</option>
      </select>
    </div>
  );
};

export default OrderBySelect;
