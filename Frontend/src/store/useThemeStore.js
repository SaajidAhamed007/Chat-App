import {create} from "zustand";

export const useThemeStore = create((set,get) => ({
    theme:localStorage.getItem("theme")||"light",

    toggleTheme:()=>{
        const newTheme = get().theme==="light"?"dark":"light";
        localStorage.setItem("theme",newTheme)
        set({theme:newTheme})
    }
}));

