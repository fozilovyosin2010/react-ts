import axios from "axios";
import { create } from "zustand";

const api = "http://37.27.29.18:8001";

interface addInter {
  Images: string;
  Name: string;
  Description: string;
}
interface editObj {
  id: number;
  name: string;
  description: string;
}

export const useUser = create((set, get: any) => ({
  users: [],

  getData: async () => {
    try {
      const { data } = await axios.get(`${api}/api/to-dos`);
      set(() => ({ users: data.data }));
    } catch (error) {
      console.error(error);
    }
  },

  delData: async (id: number) => {
    try {
      await axios.delete(`${api}/api/to-dos?id=${id}`);
      get().getData();
    } catch (error) {
      console.error(error);
    }
  },
  checkData: async (id: number) => {
    try {
      await axios.put(`${api}/completed?id=${id}`);
      get().getData();
    } catch (error) {
      console.error(error);
    }
  },

  postData: async (obj: addInter) => {
    try {
      await axios.post(`${api}/api/to-dos`, obj);
      get().getData();
    } catch (error) {
      console.error(error);
    }
  },
  putData: async (obj: editObj) => {
    try {
      await axios.put(`${api}/api/to-dos`, obj);
      get().getData();
    } catch (error) {
      console.error(error);
    }
  },
}));
