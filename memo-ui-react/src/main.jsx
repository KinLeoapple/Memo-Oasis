import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import '@fontsource-variable/nunito';
import {CssVarsProvider} from "@mui/joy";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CssVarsProvider
            modeStorageKey="theme-mode"
        >
            <App/>
        </CssVarsProvider>
    </React.StrictMode>,
)
