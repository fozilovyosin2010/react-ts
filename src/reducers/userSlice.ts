import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface IarrImg {
  id: number;
  imageName: string;
}

export interface Idata {
  id: number;
  isCompleted: boolean;
  name: string;
  description: string;
  images: IarrImg[];
}

interface IputObj {
  name: "string";
  description: "string";
  id: number;
}

interface Istate {
  data: Idata[];
  loading: boolean;
  error: any;
}

const Api = "http://37.27.29.18:8001";

// read inside
export const getData = createAsyncThunk("userSlice/getData", async () => {
  try {
    const { data } = await axios.get(`${Api}/api/to-dos`);

    // everything in return goes to action.payload
    return data.data;
  } catch (error) {
    return error;
  }
});

export const delData = createAsyncThunk(
  "userSlice/delData",
  async (id: number, thApi) => {
    try {
      await axios.delete(`${Api}/api/to-dos?id=${id}`);
      thApi.dispatch(getData());

      return id;
    } catch (error) {
      return error;
    }
  },
);

export const checkData = createAsyncThunk(
  "userSlice/checkData",
  async (id: number, thApi) => {
    try {
      await axios.put(`${Api}/completed?id=${id}`);
      thApi.dispatch(getData());
    } catch (error) {
      return error;
    }
  },
);

export const postData = createAsyncThunk(
  "userSlice/postData",
  async (obj: unknown, thApi) => {
    try {
      await axios.post(`${Api}/api/to-dos`, obj);
      thApi.dispatch(getData());
    } catch (error) {
      return error;
    }
  },
);

export const putData = createAsyncThunk(
  "userSlice/putData",
  async (obj: IputObj, thApi) => {
    try {
      await axios.put(`${Api}/api/to-dos`, obj);
      thApi.dispatch(getData());
    } catch (error) {
      return error;
    }
  },
);

const initialState: Istate = {
  data: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,

  //   sync action
  reducers: {},

  //   async action
  extraReducers: (builder) => {
    builder
      // get
      .addCase(getData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      //   del
      .addCase(delData.pending, (state) => {
        state.loading = true;
      })
      .addCase(delData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(delData.fulfilled, (state) => {
        state.loading = false;
      })

      //   checked

      .addCase(checkData.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkData.fulfilled, (state) => {
        state.loading = false;
      })

      //   post

      .addCase(postData.pending, (state) => {
        state.loading = true;
      })
      .addCase(postData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postData.fulfilled, (state) => {
        state.loading = false;
      })

      //   put

      .addCase(putData.pending, (state) => {
        state.loading = true;
      })
      .addCase(putData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(putData.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
