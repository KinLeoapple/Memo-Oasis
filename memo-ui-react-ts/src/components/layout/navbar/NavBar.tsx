import {
    Avatar, Button,
    Dropdown,
    Grid, IconButton,
    Input, MenuButton, Skeleton, useColorScheme
} from "@mui/joy";
import {SwitchThemeButton} from "@/components/button/SwitchThemeButton.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Search from '@mui/icons-material/Search';
import {FC, useCallback, useEffect, useRef, useState} from "react";
import avatar from "@/assets/img/avatar.webp";
import {basic_info, post_token_login} from "@/assets/lib/api/api.js";
import {AvatarMenu} from "@/components/layout/navbar/AvatarMenu.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginState, setLoginStateValue} from "@/assets/lib/data/reducer/login_state_slice.js";
import {Close, HomeRounded, Person} from "@mui/icons-material";
import {AVATAR_RING, AVATAR_RING_DARK, BG, BG_DARK, SEARCH_INPUT, SEARCH_INPUT_DARK} from "@/assets/lib/data/static.ts";
import {selectUserBasicInfo, setUserBasicInfoValue} from "@/assets/lib/data/reducer/user_basic_info_slice.js";
import {
    newSearchBlogKeyword,
    selectSearchKeyword,
    setSearchBlogKeyword
} from "@/assets/lib/data/reducer/blog/search_keyword_slice.js";
import {SearchMenu} from "@/components/layout/navbar/SearchMenu.jsx";
import {setShowResultValue} from "@/assets/lib/data/reducer/blog/show_search_result_slice.js";

type PropData = {
    renderPending: (value: boolean) => void
};

export const NavBar: FC<PropData> = ({
                           renderPending
                       }) => {
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

    // Basic Information
    const userBasicInfo = useSelector(selectUserBasicInfo);
    const [name, setName] = useState(userBasicInfo.name);
    const [quote, setQuote] = useState(userBasicInfo.quote);
    const [quoteName, setQuoteName] = useState(userBasicInfo.quoteName);

    const navigate = useNavigate();
    const isLogin = useSelector(selectLoginState);
    const [login, setLogin] = useState(isLogin);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const timer = useRef(
        setTimeout(() => {})
    );

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
        renderPending(true);
        if (!login) {
            const token = localStorage.getItem("token");
            if (token !== null && token !== undefined && token !== "") {
                post_token_login(token).then(r => {
                    if (r !== null) {
                        const newToken = r.login;
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
                    renderPending(false);
                });
            } else {
                dispatch(setLoginStateValue(false));
                setLogin(false);
                renderPending(false);
            }
        } else {
            setLogin(true);
            renderPending(false);
        }
    }, []);

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

    function handleSearchChange(e: Event | React.FormEvent<HTMLDivElement>) {
        const target = e.target;
        if (target) {
            const value = (target as HTMLInputElement).value;
            setSearchText(value);
            dispatch(setSearchBlogKeyword(newSearchBlogKeyword(value)));
        }
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

    function handleMouseEnter(e: Event | React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        if (timer.current !== null) {
            clearTimeout(timer.current);
        }
        setOpen(true);
    }

    function handleMouseLeave(e: Event | React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        timer.current = setTimeout(() => {
            setOpen(false);
        }, 100);
    }

    const search = useCallback((e: Event | React.MouseEvent<HTMLButtonElement>) => {
        const fn = (e: Event| React.MouseEvent<HTMLButtonElement>) => {
            let target = e.target;
            if (target) {
                if ((target as HTMLInputElement).value === undefined) {
                    target = document.getElementById("searchInput");
                }
                const value = (target as HTMLInputElement).value;
                if (value !== "") {
                    dispatch(setSearchBlogKeyword(newSearchBlogKeyword(value, e.type)));
                    dispatch(setShowResultValue(true));
                    document.getElementById("searchInput")!.blur();
                }
            }
        }

        if (e.type === "keyup" && (e as KeyboardEvent).key === "Enter") {
            fn(e);
        } else if (e.type === "click") {
            fn(e);
        }
    }, []);

    return (
        <div className={'w-full h-24 z-[1200] overflow-hidden'}>
            <Grid container columns={3} spacing={0.1} className={`w-full fixed flex flex-col 
             justify-between items-center gap-5 flex-nowrap p-5 mb-3 backdrop-blur-lg
            bg-opacity-80 ${themeMode.mode === 'dark' ? BG_DARK : BG}`} sx={{flexGrow: 1}}>
                <Grid className={`relative z-30 flex justify-start items-center gap-3 select-none`} xs={1}>
                    {login ?
                        <Dropdown open={open}>
                            <MenuButton
                                tabIndex={-1}
                                slots={{root: Avatar}}
                                slotProps={{
                                    root: {
                                        variant: 'plain',
                                        color: 'primary',
                                        onMouseEnter: handleMouseEnter,
                                        onMouseLeave: handleMouseLeave,
                                        sx: {
                                            transform: "scale(1.6)",
                                            marginTop: "30px",
                                            marginLeft: "20px",
                                            position: "absolute",
                                            border: "2px solid",
                                            borderColor: open ?
                                                (themeMode.mode === 'dark' ? AVATAR_RING_DARK : AVATAR_RING) :
                                                "transparent",
                                            transition: "all .2s",
                                            "&:hover": {
                                                borderColor: themeMode.mode === 'dark' ? AVATAR_RING_DARK : AVATAR_RING,
                                            }
                                        }
                                    }
                                }}>
                                <Avatar alt={name} src={(loading ? '' : avatar)} color="primary"
                                        variant="soft"
                                        className={'cursor-pointer'}></Avatar>
                                <Skeleton loading={loading} animation="wave" variant="circular"/>
                            </MenuButton>
                            <AvatarMenu onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>
                        </Dropdown> :
                        <Button onClick={signIn} startDecorator={<Person/>}>
                            Sign in
                        </Button>
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
                                <Link tabIndex={-1}
                                      className={btn.path.split("/")[1] === "blog" ? (login ? "" : "hidden") : ""}
                                      key={btn.name} to={btn.path} replace={true}>
                                    <Button tabIndex={-1}
                                            startDecorator={btn.decorator}
                                            variant={
                                                location.pathname === btn.path ? "soft" : "plain"
                                            }>
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