import {create} from "zustand";

interface SearchStore{
    search : string;
    setSearch: (newSearch : string) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
    search : "",
    setSearch : (newSearch) => set({search : newSearch})
}))

export {useSearchStore}