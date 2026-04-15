import { Api } from "@/App";
import axios from "axios";
import { atom } from "jotai";

interface IimgObj {
  id: number;
  imageName: string;
}

export interface IObjTodo {
  id: number;
  isCompleted: boolean;
  images: IimgObj[];
  name: string;
  description: string;
}

export const todo = atom<IObjTodo[]>([]);
export const errorTodo = atom(null);
export const loadTodo = atom(false);

export const infoIdx = atom<null | number>(null);
export const ObjInfo = atom<null | IObjTodo>(null);

export const getData = atom(null, async (get, set) => {
  try {
    set(loadTodo, true);
    const { data } = await axios.get(`${Api}/api/to-dos`);
    set(todo, data.data);
  } catch (error: any) {
    set(errorTodo, error);
  } finally {
    set(loadTodo, false);
  }
});

export const getById = atom(null, async (get, set) => {
  const idx = get(infoIdx);
  try {
    const { data } = await axios.get(`${Api}/api/to-dos/${idx}`);
    console.log(data.data);

    set(ObjInfo, data.data);
  } catch (error) {
    console.error(error);
  }
});

export const delData = atom(null, async (get, set, id: number) => {
  try {
    await axios.delete(`${Api}/api/to-dos?id=${id}`);

    await set(getData);
  } catch (error) {
    console.error(error);
  }
});

export const delById = atom(null, async (get, set, imgId: number) => {
  try {
    await axios.delete(`${Api}/api/to-dos/images/${imgId}`);

    set(getById);
  } catch (error) {
    console.error(error);
  }
});

export const checkData = atom(null, async (get, set, id: number) => {
  try {
    await axios.put(`${Api}/completed?id=${id}`);

    set(getData);
  } catch (error) {
    console.error(error);
  }
});

export const postData = atom(null, async (get, set, obj) => {
  try {
    await axios.post(`${Api}/api/to-dos`, obj);

    set(getData);
  } catch (error) {
    console.error(error);
  }
});

// here
export const postImgdata = atom(null, async (get, set, obj) => {
  const idx = get(infoIdx);

  try {
    await axios.post(`${Api}/api/to-dos/${idx}/images`, obj);

    set(getById);
  } catch (error) {
    console.error(error);
  }
});

export const putData = atom(null, async (get, set, obj) => {
  try {
    await axios.put(`${Api}/api/to-dos`, obj);

    set(getData);
  } catch (error) {
    console.error(error);
  }
});
