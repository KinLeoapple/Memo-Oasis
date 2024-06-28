import {AspectRatio, Button, Divider, Grid, Input, Typography, useColorScheme} from "@mui/joy";
import {SwitchThemeButton} from "@/components/button/SwitchThemeButton.jsx";
import {Link, useLocation} from "react-router-dom";
import Search from '@mui/icons-material/Search';
import {useEffect, useState} from "react";
import '@fontsource/kalam';
import icon from "@/assets/img/site-logo/icon.webp";

export const NavBar = () => {
    const navButtons = [{
        name: "Home",
        path: "/"
    },
        {
            name: "Admin",
            path: "/admin"
        }];
    let themeMode = useColorScheme();
    let location = useLocation();
    let [searchBar, setSearchBar] = useState(true);

    useEffect(() => {
        switch (location.pathname) {
            case "/admin":
                setSearchBar(false);
                break;
            case "/":
                setSearchBar(true);
                break;
        }
    }, [location]);

    return (
        <div className={'w-full h-24 z-[999]'}>
            <Grid container columns={3} spacing={0.1} className={`w-full fixed flex flex-col 
             justify-end items-center gap-5 p-5 mb-3 
            bg-opacity-80 ${themeMode.colorScheme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
                <Grid className={'flex justify-start items-center gap-3 select-none'} xs={1}>
                    <AspectRatio sx={{width:46}} ratio="1/1" variant="plain" objectFit="contain">
                        <img src={icon} loading="lazy" alt=""/>
                    </AspectRatio>
                    <Divider inset="none" orientation="vertical"/>
                    <Typography level="title-lg" sx={{
                        fontFamily: "'Kalam', cursive"
                    }}>Memo Oasis</Typography>
                </Grid>
                {searchBar &&
                    <Grid xs={0.9}>
                        <Input startDecorator={
                            <Search/>
                        }
                               color="primary" variant="soft"
                               size="md" placeholder="Search" sx={{
                            '--Input-focusedThickness': '0',
                        }}/>
                    </Grid>
                }
                <Grid xs={1}>
                    <div className={'flex flex-row justify-end items-center gap-2'}>
                        <div className={'flex flex-row gap-3'}>
                            {navButtons.map((btn) => (
                                <Link key={btn.name} to={btn.path} replace={true}>
                                    <Button variant={location.pathname === btn.path ? "soft" : "plain"}>
                                        {btn.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                        <div className={'flex justify-center items-center'} style={{
                            width: '5.625em'
                        }}>
                            <SwitchThemeButton/>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}