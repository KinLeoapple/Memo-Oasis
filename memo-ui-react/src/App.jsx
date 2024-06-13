import './App.css'
import {RouterProvider} from "react-router-dom";
import routers from "@/router.jsx";
import {useColorScheme} from "@mui/joy";

function App() {
    let themeMode = useColorScheme();

    return (
        <div className={`w-full h-full ${themeMode.colorScheme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
            <RouterProvider router={routers}/>
        </div>
    )
}

export default App
