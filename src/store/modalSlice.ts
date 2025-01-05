import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  isSaveModalOpen: boolean;
}

const initialState: ModalState = {
  isSaveModalOpen: false
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setSaveModalOpen: (state, action) => {
      state.isSaveModalOpen = action.payload;
    }
  }
});

export const { setSaveModalOpen } = modalSlice.actions;
export default modalSlice.reducer;
