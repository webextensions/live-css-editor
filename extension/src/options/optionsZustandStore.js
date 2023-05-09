import { create } from 'zustand';

const useDialogsStore = create((set) => ({
    flagShowConnectViaDialog: false
    // bears: 0,
    // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    // removeAllBears: () => set({ bears: 0 }),
}));

export { useDialogsStore };
