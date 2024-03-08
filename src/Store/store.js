import { configureStore } from "@reduxjs/toolkit";
import PageReducer from "./slices/pageSlice";
import filterReducer from "./slices/filterSlice";
export const store = configureStore({
  reducer: {
    page: PageReducer,
    filter: filterReducer,
  },
});
