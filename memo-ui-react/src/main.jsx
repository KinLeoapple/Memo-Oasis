import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import '@fontsource-variable/nunito';
import {CssVarsProvider} from "@mui/joy";
import {Provider} from "react-redux";
import {store} from "@/assets/js/data/store.js";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
        <CssVarsProvider
            defaultMode={"dark"}
            modeStorageKey="theme-mode"
        >
            <App/>
        </CssVarsProvider>
        </Provider>
    </React.StrictMode>,
)
