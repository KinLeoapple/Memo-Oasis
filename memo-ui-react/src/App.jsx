import './App.css'
import {RouterProvider} from "react-router-dom";
import routers from "@/router.jsx";
import {useColorScheme} from "@mui/joy";
import {useEffect} from "react";

function App() {
    let themeMode = useColorScheme();

    useEffect(() => {
        document.body.classList.remove('bg-gray-950');
        document.body.classList.remove('bg-white');
        document.body.classList.add(themeMode.mode === 'dark' ? 'bg-gray-950' : 'bg-white');
    }, [themeMode]);

    return (
        <div className={`min-w-full min-h-full ${themeMode.mode === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
            <RouterProvider router={routers}/>
        </div>
    )
}

export default App
