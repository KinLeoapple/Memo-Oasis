import "@/assets/css/loader.css";
import {useColorScheme} from "@mui/joy";
import {useEffect, useState} from "react";
import {BG, BG_DARK, MAX_LOADER_WAITING} from "@/assets/js/data/static.js";

export const Loader = () => {
    let themeMode = useColorScheme();
    const [display, setDisplay] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true);
        }, MAX_LOADER_WAITING * 1000);
    }, []);

    useEffect(() => {
        let loader = document.querySelector(".loader");
        loader.querySelectorAll(".dot").forEach(el => {
            el.style.border = `2px solid ${themeMode.mode === 'dark' ? BG_DARK : BG}`;
        });
    }, [themeMode]);

    return (
        <div className={`fixed inset-0 flex items-center justify-center ${display ? 'opacity-100' : 'opacity-0'}`}>
            <div className="loader">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    )
}