import {
    AspectRatio,
    Avatar,
    Button,
    Chip,
    Divider, Dropdown,
    Grid,
    Input, MenuButton, Skeleton,
    Typography,
    useColorScheme
} from "@mui/joy";
import {SwitchThemeButton} from "@/components/button/SwitchThemeButton.jsx";
import {Link, useLocation} from "react-router-dom";
import Search from '@mui/icons-material/Search';
import {useEffect, useState} from "react";
import '@fontsource/kalam';
import avatar from "@/assets/img/avatar.webp";
import {basic_info, post_token_login} from "@/assets/js/api/api.js";
import {AvatarMenu} from "@/components/common/navbar/AvatarMenu.jsx";
import {useDispatch} from "react-redux";
import {setLoginStateValue} from "@/assets/js/data/reducer/login_state_slice.js";

export const NavBar = () => {
    const dispatch = useDispatch();
    const navButtons = [{
        name: "Home",
        path: "/"
    },
        {
            name: "Admin",
            path: "/admin"
        }];
    const themeMode = useColorScheme();
    const location = useLocation();
    const [searchBar, setSearchBar] = useState(true);
    const tags = ["gamer", "developer"];

    // Basic Information
    const [name, setName] = useState(null);
    const [quote, setQuote] = useState(null);
    const [quoteName, setQuoteName] = useState(null);

    const [login, setLogin] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        switch (location.pathname) {
            case "/admin":
                setSearchBar(false);
                break;
            case "/login":
                setSearchBar(false);
                break;
            case "/signup":
                setSearchBar(false);
                break;
            case "/":
                setSearchBar(true);
                break;
        }
    }, [location]);

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token !== null && token !== undefined && token !== "") {
            post_token_login(token).then(r => {
                if (r !== null) {
                    let newToken = r.login;
                    if (newToken !== null) {
                        setLogin(true);
                        dispatch(setLoginStateValue(true));
                        localStorage.setItem("token", newToken);
                    } else {
                        dispatch(setLoginStateValue(false));
                        setLogin(false);
                    }
                } else {
                    dispatch(setLoginStateValue(false));
                    setLogin(false);
                }
            });
        } else {
            dispatch(setLoginStateValue(false));
            setLogin(false);
        }
    }, [dispatch, login]);

    useEffect(() => {
        if (login) {
            setLoading(true);
            basic_info().then(r => {
                setName(r.name);
                setQuote(r.quote);
                setQuoteName(r.quote_name);
                setLoading(false);
            });
        }
    }, [login, name, quote, quoteName]);

    return (
        <div className={'w-full h-24 z-[999]'}>
            <Grid container columns={3} spacing={0.1} className={`w-full fixed flex flex-col 
             justify-between items-center gap-5 flex-nowrap p-5 mb-3 
            bg-opacity-80 ${themeMode.colorScheme === 'dark' ? 'bg-gray-950' : 'bg-white'}`} sx={{flexGrow: 1}}>
                <Grid className={'flex justify-start items-center gap-3 select-none'} xs={1}>
                    <Dropdown>
                        <AspectRatio sx={{width: 46}} ratio="1/1" variant="plain" objectFit="contain">
                            <MenuButton
                                slots={{root: Avatar}}
                                slotProps={{root: {variant: 'plain', color: 'primary'}}}>
                                {login ?
                                    <Avatar alt={name} src={(loading ? '' : avatar)} color="primary"
                                            variant="soft" className={'cursor-pointer'}></Avatar> :
                                    <Avatar color="primary" variant="soft" className={'cursor-pointer'}/>
                                }
                                <Skeleton loading={loading} animation="wave" variant="circular"/>
                            </MenuButton>
                        </AspectRatio>
                        <AvatarMenu isLogin={login}/>
                    </Dropdown>
                    {login &&
                        <>
                            <Divider inset="none" orientation="vertical"/>
                            <div className={'flex flex-col justify-center items-start'}>
                                <Skeleton loading={loading} level="title-lg" animation="wave" variant="text"/>
                                {!loading &&
                                    <Typography level="title-lg" sx={{
                                        fontFamily: "'Kalam', cursive"
                                    }}>{name}</Typography>
                                }
                                <div className={`w-full flex flex-row justify-start content-center gap-1`}>
                                    {
                                        loading ? new Array(2).fill(0).map((_, i) => (
                                            <div key={i} className={'w-16'}>
                                                <Skeleton loading={loading} level="title-lg" animation="wave"
                                                          variant="text"/>
                                            </div>
                                        )) : tags.map((tag) => (<Chip
                                            key={tag}
                                            color="primary"
                                            variant="soft"
                                            size="sm"
                                            sx={{
                                                "--Chip-radius": "2px",
                                                fontSize: '0.55rem'
                                            }}
                                        >
                                            <span className={'font-bold'}>{tag.toUpperCase()}</span>
                                        </Chip>))
                                    }
                                </div>
                            </div>
                        </>
                    }
                </Grid>
                {searchBar &&
                    <Grid xs={0.8}>
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
                        <div className={'flex justify-end items-center'} style={{
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