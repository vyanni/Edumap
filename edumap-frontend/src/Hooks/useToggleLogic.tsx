import { useState, useEffect } from "react";

function useToggleLogic(){
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() =>{
       const cachedTheme = localStorage.getItem('theme')
       if(cachedTheme === 'light' || cachedTheme === 'dark') return cachedTheme
       
       const darkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
       return darkPreference ? 'dark' : 'light'; 
    });

    useEffect(() => {
      localStorage.setItem('theme', currentTheme);
      
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [currentTheme]);

    return {currentTheme, setCurrentTheme};
}

export default useToggleLogic