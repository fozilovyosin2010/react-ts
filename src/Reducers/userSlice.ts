import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IinitialState {
  data: Idata[];
  isLoad: boolean;
  error: null | string;
}

interface Iimages {
  id: number;
  imageName: string;
}
interface Idata {
  id: number;
  isCompleted: boolean;
  images: Iimages[];
  name: string;
  description: string;
}

const initialState: IinitialState = {
  data: [],
  isLoad: false,
  error: null,
};

const Api = "http://37.27.29.18:8001";

export const getData = createAsyncThunk("userSlice/getData", async () => {
  try {
    const { data } = await axios.get(`${Api}/api/to-dos`);

    return data.data;
  } catch (error) {
    return error;
  }
});

export const delData = createAsyncThunk(
  "userSlice/delData",
  async (id: number, { dispatch }) => {
    try {
      await axios.delete(`${Api}/api/to-dos?id=${id}`);
      dispatch(getData());
    } catch (error) {
      console.error(error);
    }
  },
);

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.isLoad = true;
        state.error = null;
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.isLoad = false;
        // state.error = null;
        state.data = action.payload;
      })
      .addCase(getData.rejected, (state, action) => {
        state.isLoad = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
