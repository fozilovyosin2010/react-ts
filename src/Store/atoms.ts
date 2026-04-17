import { Api } from "@/App";
import axios from "axios";
import { atom } from "jotai";
import { loadable } from "jotai/utils";

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

export const infoIdx = atom<null | number>(null);
export const ObjInfo = atom<null | IObjTodo>(null);

const trigger = atom(false);
const triggerId = atom(false);

// here
const getData = atom(async (get, set) => {
  // if trigger changes the func will run again
  get(trigger);
  try {
    const { data } = await axios.get(`${Api}/api/to-dos`);
    return data.data;
  } catch (error: any) {
    console.error(error);
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

    set(trigger, !get(trigger));
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
    set(trigger, !get(trigger));
  } catch (error) {
    console.error(error);
  }
});

export const postData = atom(null, async (get, set, obj) => {
  try {
    await axios.post(`${Api}/api/to-dos`, obj);
    set(trigger, !get(trigger));
  } catch (error) {
    console.error(error);
  }
});

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
    set(trigger, !get(trigger));
  } catch (error) {
    console.error(error);
  }
});

export const getLoadData = loadable(getData);
