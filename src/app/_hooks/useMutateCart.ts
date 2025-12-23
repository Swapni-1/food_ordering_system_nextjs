import {create} from "zustand";

const useMutateCart = create((set) => ({
    mutateCart : null,
    setMutateCart : (mutateFn) => set({mutateCart : mutateFn })
}))

export {useMutateCart};
