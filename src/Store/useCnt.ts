import { create } from "zustand";

export const useCnt = create((set, get) => ({
  counter: 100,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  decrement: () => set((state) => ({ counter: state.counter - 1 })),
}));
