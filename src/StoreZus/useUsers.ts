import { create } from "zustand";

interface IStates {
  id: number;
  status: boolean;
}

interface IStore {
  data2: IStates[];
  delData2(id: number): void;
  addData2(obj: IStates): void;
}

export const useUsers = create<IStore>((set) => ({
  data2: [
    { id: 1, status: false },
    { id: 2, status: true },
  ],
  delData2: (id) => {
    set((state) => ({ data2: state.data2.filter((e) => e.id !== id) }));
  },

  addData2: (obj) => {
    set((state) => ({ data2: [...state.data2, obj] }));
  },
}));
