import './App.css'
import {RouterProvider} from "react-router-dom";
import routers from "@/router.jsx";
import {useColorScheme} from "@mui/joy";
import {useEffect} from "react";
import {BG, BG_DARK} from "@/assets/js/data/static.js";

function App() {
    let themeMode = useColorScheme();

    useEffect(() => {
        document.body.classList.remove(BG_DARK);
        document.body.classList.remove(BG);
        document.body.classList.add(themeMode.mode === 'dark' ? BG_DARK : BG);
    }, [themeMode]);

    return (
        <div className={`min-w-full min-h-full ${themeMode.mode === 'dark' ? BG_DARK : BG}`}>
            <RouterProvider router={routers}/>
        </div>
    )
}

export default App
