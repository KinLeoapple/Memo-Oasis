import {
    CircularProgress, Divider, List,
    ListItem,
    ListItemButton, Stack,
    Typography,
    useColorScheme
} from "@mui/joy";
import {useDispatch, useSelector} from "react-redux";
import {
    newSearchBlogKeyword,
    selectSearchKeyword,
    setSearchBlogKeyword
} from "@/assets/js/data/reducer/blog/search_keyword_slice.js";
import {SEARCH_INPUT, SEARCH_INPUT_DARK} from "@/assets/js/data/static.js";
import {setBlogValue} from "@/assets/js/data/reducer/blog/blog_slice.js";
import {useEffect, useRef, useState} from "react";
import {get_search_blog} from "@/assets/js/api/api.js";
import {Inventory2} from "@mui/icons-material";

export const SearchMenu = () => {
    const themeMode = useColorScheme();
    const keyword = useSelector(selectSearchKeyword);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const delaySearchTimer = useRef({timer: null, time: new Date().getTime()});

    useEffect(() => {
        setSearchList([]);
        let time = new Date().getTime();
        if (time - delaySearchTimer.current.time <= 1200) {
            clearTimeout(delaySearchTimer.current.timer);
        }
        setLoading(true);
        delaySearchTimer.current.timer = setTimeout(() => {
            if (keyword.value !== "") {
                get_search_blog(keyword.value).then(r => {
                    let list = [];
                    if (r !== null) {
                        for (let i in r) {
                            list.push(r[i]);
                        }
                    }
                    setSearchList(list);
                    setLoading(false)
                });
            } else
                setSearchList([]);
        }, 1200);
        delaySearchTimer.current.time = time;
    }, [keyword]);

    function goToRender(id) {
        dispatch(setSearchBlogKeyword(newSearchBlogKeyword("")));
        dispatch(setBlogValue(id));
    }

    return (
        <>
            {
                keyword.value !== "" &&
                <Stack
                    className={`w-full ${searchList.length === 0 ? 'min-h-24' : 'h-auto'} select-none`}
                    sx={{
                        boxShadow: "lg",
                        marginTop: .5,
                        borderRadius: "var(--joy-radius-sm)",
                        backgroundColor: themeMode.mode === 'dark' ? SEARCH_INPUT_DARK : SEARCH_INPUT,
                    }}>
                    <List
                        variant="soft"
                        placement="bottom-start"
                        className={`${searchList.length === 0 ? 'flex justify-center items-center' : ''}`}
                        sx={{
                            padding: 0,
                            borderRadius: "var(--joy-radius-sm)",
                            backgroundColor: themeMode.mode === 'dark' ? SEARCH_INPUT_DARK : SEARCH_INPUT,
                        }}>
                        {searchList.length > 0 ?
                            <>{
                                searchList.map((item, i) => (
                                    <div key={i}>
                                        <ListItem className={'pl-2 pr-2'} sx={{
                                            borderRadius: 6,
                                            marginTop: "3px",
                                            marginLeft: "5px",
                                            marginRight: "5px",
                                            marginBottom: "4px",
                                        }}>
                                            <ListItemButton tabIndex={-1} color={"primary"}
                                                            onClick={() => goToRender(item.id)}>
                                                <Typography>
                                                    <Typography
                                                        className={'font-bold'}>{item.title}</Typography><br/>
                                                    <Typography level={'body-sm'}>{item.desc}</Typography>
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        {i < searchList.length - 1 &&
                                            <Divider/>
                                        }
                                    </div>
                                ))
                            }</> :
                            <>{loading ?
                                <CircularProgress
                                    color="primary"
                                    determinate={false}
                                    size="md"
                                    variant="soft"
                                /> :
                                <>{
                                    searchList.length === 0 &&
                                    <>
                                        <Typography variant={"plain"} color={"primary"} level={'body-lg'}>
                                            <Inventory2/>
                                        </Typography>
                                        <Typography level={'body-sm'}>
                                            No Results Found
                                        </Typography>
                                    </>
                                }</>
                            }</>
                        }
                    </List>
                </Stack>
            }
        </>
    )
}