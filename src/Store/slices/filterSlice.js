import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  filter: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
    removeFilter(state, action) {
      state.filter = null;
    },
  },
});

export const { setFilter, removeFilter } = filterSlice.actions;
export default filterSlice.reducer;
