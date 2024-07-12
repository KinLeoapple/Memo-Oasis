import {
    AspectRatio,
    Avatar,
    Button,
    Chip,
    Divider, Dropdown,
    Grid, IconButton,
    Input, MenuButton, Skeleton,
    Typography,
    useColorScheme
} from "@mui/joy";
import {SwitchThemeButton} from "@/components/button/SwitchThemeButton.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Search from '@mui/icons-material/Search';
import {useCallback, useEffect, useState} from "react";
import '@fontsource/kalam';
import avatar from "@/assets/img/avatar.webp";
import {basic_info, post_token_login} from "@/assets/js/api/api.js";
import {AvatarMenu} from "@/components/common/navbar/AvatarMenu.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginState, setLoginStateValue} from "@/assets/js/data/reducer/login_state_slice.js";
import {Close, HomeRounded} from "@mui/icons-material";
import {BG, BG_DARK, SEARCH_INPUT, SEARCH_INPUT_DARK} from "@/assets/js/data/static.js";
import {selectUserBasicInfo, setUserBasicInfoValue} from "@/assets/js/data/reducer/user_basic_info_slice.js";
import {
    newSearchBlogKeyword,
    selectSearchKeyword,
    setSearchBlogKeyword
} from "@/assets/js/data/reducer/blog/search_keyword_slice.js";
import {SearchMenu} from "@/components/common/navbar/SearchMenu.jsx";
import {setShowResultValue} from "@/assets/js/data/reducer/blog/show_search_result_slice.js";

export const NavBar = () => {
    const dispatch = useDispatch();
    const navButtons = [
        {
            name: "Home",
            decorator: <HomeRounded/>,
            path: "/blog"
        },
    ];
    const themeMode = useColorScheme();
    const location = useLocation();
    const keyword = useSelector(selectSearchKeyword);
    const [searchBar, setSearchBar] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchBarFocus, setSearchBarFocus] = useState(false);
    const tags = ["gamer", "developer"];

    // Basic Information
    const userBasicInfo = useSelector(selectUserBasicInfo);
    const [name, setName] = useState(userBasicInfo.name);
    const [quote, setQuote] = useState(userBasicInfo.quote);
    const [quoteName, setQuoteName] = useState(userBasicInfo.quoteName);

    const navigate = useNavigate();
    const isLogin = useSelector(selectLoginState);
    const [login, setLogin] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        switch (location.pathname.split("/")[1]) {
            case "dashboard":
                setSearchBar(false);
                break;
            case "login":
                setSearchBar(false);
                break;
            case "signup":
                setSearchBar(false);
                break;
            case "blog":
                setSearchBar(true);
                break;
            case "":
                setSearchBar(true);
                break;
        }
    }, [location]);

    useEffect(() => {
        if (!isLogin) {
            let token = localStorage.getItem("token");
            if (token !== null && token !== undefined && token !== "") {
                post_token_login(token).then(r => {
                    if (r !== null) {
                        let newToken = r.login;
                        if (newToken !== null) {
                            setLogin(true);
                            dispatch(setLoginStateValue(true));
                            localStorage.setItem("token", newToken);
                            dispatch(setUserBasicInfoValue({
                                id: r.id
                            }));
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
        } else {
            setLogin(true);
        }
    }, [dispatch, isLogin, login]);

    useEffect(() => {
        if (login) {
            setLoading(true);
            basic_info(userBasicInfo.id).then(r => {
                setName(r.name);
                setQuote(r.quote);
                setQuoteName(r.quote_name);
                dispatch(setUserBasicInfoValue({
                    id: userBasicInfo.id,
                    name: r.name,
                    quote: r.quote,
                    quoteName: r.quote_name
                }));
                setLoading(false);
            });
        }
    }, [dispatch, login, name, quote, quoteName]);

    useEffect(() => {
        setSearchText(keyword.value);
    }, [keyword]);

    function signIn() {
        navigate("/login", {replace: true});
    }

    function handleSearchChange(e) {
        let value = e.target.value;
        setSearchText(value);
        dispatch(setSearchBlogKeyword(newSearchBlogKeyword(value)));
    }

    function cleanSearchText() {
        setSearchText("");
        dispatch(setSearchBlogKeyword(newSearchBlogKeyword("")));
        dispatch(setShowResultValue(false));
    }

    function handleFocus() {
        setSearchBarFocus(true);
        document.body.addEventListener("keyup", search);
    }

    function handleBlur() {
        setSearchBarFocus(false);
        document.body.removeEventListener("keyup", search);
    }

    const search = useCallback((e) => {
        const fn = (e) => {
            let target = e.target;
            if (target.value === undefined) {
                target = document.getElementById("searchInput");
            }
            let value = target.value;
            if (value !== "") {
                dispatch(setSearchBlogKeyword(newSearchBlogKeyword(value, e.type)));
                dispatch(setShowResultValue(true));
                document.getElementById("searchInput").blur();
            }
        }

        if (e.type === "keyup" && e.keyCode === 13) {
            fn(e);
        } else if (e.type === "click") {
            fn(e);
        }
    }, []);

    return (
        <div className={'w-full h-24 z-[999] overflow-hidden'}>
            <Grid container columns={3} spacing={0.1} className={`w-full fixed flex flex-col 
             justify-between items-center gap-5 flex-nowrap p-5 mb-3 backdrop-blur-lg
            bg-opacity-80 ${themeMode.mode === 'dark' ? BG_DARK : BG}`} sx={{flexGrow: 1}}>
                <Grid onClick={login ? null : signIn} className={`z-30 flex justify-start items-center gap-3
                ${login ? '' : 'cursor-pointer'}
                 select-none`} xs={1}>
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
                        {login &&
                            <AvatarMenu/>
                        }
                    </Dropdown>
                    {login ?
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
                        </> :
                        <Typography color="primary" variant="plain" className={'capitalize'}>Sign In</Typography>
                    }
                </Grid>
                {searchBar &&
                    <Grid xs={0.8} className={'relative'}>
                        <Input
                            slots={{root: Input}}
                            slotProps={{
                                root: {
                                    id: "searchInput",
                                    endDecorator: <div className={'flex gap-2'}>
                                        {
                                            searchText !== "" &&
                                            <IconButton
                                                tabIndex={-1}
                                                onClick={cleanSearchText}
                                                sx={{
                                                    background: "transparent",
                                                    "&:hover": {
                                                        background: "transparent",
                                                    }
                                                }}
                                            >
                                                <Close/>
                                            </IconButton>
                                        }
                                        <IconButton
                                            onClick={search}
                                            tabIndex={-1} variant={"plain"} color={"primary"} sx={{
                                            borderRadius: "50%",
                                        }}>
                                            <Search/>
                                        </IconButton>
                                    </div>,
                                    onFocus: handleFocus,
                                    onBlur: handleBlur,
                                    onChange: (e) => handleSearchChange(e),
                                    onInput: (e) => handleSearchChange(e),
                                    value: searchText,
                                    variant: "soft",
                                    size: "md",
                                    placeholder: "Search",
                                    sx: {
                                        '--Input-focusedThickness': '0',
                                        transition: 'box-shadow .2s',
                                        backgroundColor: themeMode.mode === 'dark' ? SEARCH_INPUT_DARK : SEARCH_INPUT,
                                        boxShadow: searchBarFocus ? 'lg' : ''
                                    }
                                }
                            }}>
                        </Input>
                        {location.pathname.split("/")[1] === "blog" &&
                            <div className={`absolute w-full ${searchBarFocus ? '' : 'opacity-0 -z-50'}`}>
                                <SearchMenu/>
                            </div>
                        }
                    </Grid>
                }
                <Grid xs={1}>
                    <div className={'flex flex-row justify-end items-center gap-2'}>
                        <div className={'flex flex-row gap-3'}>
                            {navButtons.map((btn) => (
                                <Link
                                    className={btn.path === "/dashboard" ? (isLogin ? "" : "hidden") : ""}
                                    key={btn.name} to={btn.path} replace={true}>
                                    <Button
                                        startDecorator={btn.decorator}
                                        variant={location.pathname === btn.path ? "soft" : "plain"}>
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