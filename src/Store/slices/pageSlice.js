import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentPage: 1,
  checkPage: 1,
};

const PageSlice = createSlice({
  name: "Page",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setCheckPage(state, action) {
      state.checkPage = action.payload;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
      state.checkPage = action.payload;
    },
  },
});

export const { setCurrentPage, setCheckPage, setPage } = PageSlice.actions;
export default PageSlice.reducer;
