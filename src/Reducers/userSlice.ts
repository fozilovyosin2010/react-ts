import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Idata {
  id: number;
  name: string;
  status?: boolean;
}
export interface UserStates {
  data: Idata[];
}
const initialState: UserStates = {
  data: [
    { id: 1, name: "Yosin" },
    { id: 2, name: "Jordan" },
  ],
};

export const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    delData: (state, action) => {
      state.data = state.data.filter((e) => e.id != action.payload);
    },

    addData: (state, action) => {
      state.data = [...state.data, action.payload];
    },
  },
});

export const { delData, addData } = userSlice.actions;

export default userSlice.reducer;
