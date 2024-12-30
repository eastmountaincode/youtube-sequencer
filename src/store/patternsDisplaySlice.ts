import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OrderBy = 'created_at DESC' | 'created_at ASC' | 'likes_count DESC, created_at DESC' | 'likes_count ASC, created_at DESC';

interface PatternsDisplayState {
  orderBy: OrderBy;
  itemsPerPage: number;
}

const initialState: PatternsDisplayState = {
  orderBy: 'created_at DESC',
  itemsPerPage: 9
};

const patternsDisplaySlice = createSlice({
  name: 'patternsDisplay',
  initialState,
  reducers: {
    setOrderBy: (state, action: PayloadAction<OrderBy>) => {
      state.orderBy = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    }
  }
});

export const { setOrderBy, setItemsPerPage } = patternsDisplaySlice.actions;
export default patternsDisplaySlice.reducer;
