import {Card, CardContent, Chip, CircularProgress, Divider, List, ListItem, ListItemButton, Typography} from "@mui/joy";
import {useDispatch, useSelector} from "react-redux";
import {
    newSearchBlogKeyword,
    selectSearchKeyword,
    setSearchBlogKeyword
} from "@/assets/js/data/reducer/search_keyword_slice.js";
import {get_search_blog} from "@/assets/js/api/api.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {MAX_PER_PAGE} from "@/assets/js/data/static.js";

export const SearchResult = () => {
    const dispatch = useDispatch();
    const keyword = useSelector(selectSearchKeyword);

    const [mounted, setMounted] = useState(false);
    const [currKeyWord, setCurrKeyWord] = useState(keyword.value);
    const [longList, setLongList] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadAll = useRef(false);
    const scrollCount = useRef(1);

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
            setCurrKeyWord(keyword.value);
            dispatch(setSearchBlogKeyword(newSearchBlogKeyword("")));
            window.addEventListener("scroll", scrollLoad);
        } else {
            window.removeEventListener("scroll", scrollLoad);
        }
    }, []);

    useEffect(() => {
        if (keyword.triggeredBy !== null) {
            setLongList([]);
            setCurrKeyWord(keyword.value);
            loadData();
        }
    }, [keyword]);

    const scrollLoad = useCallback(() => {
        const options = {
            threshold: 1.0,
        };
        const callback = (entries) => {
            entries.forEach(((entry, index) => {
                if (index === entries.length - 1) {
                    if (entry.intersectionRatio === 1.0) {
                        if (!loadAll.current) {
                            loadData();
                            scrollCount.current++;
                        }
                    }
                }
            }));
        }
        const observer = new IntersectionObserver(callback, options);
        let children = document.querySelector('#resultList').children;
        observer.observe(children[children.length - 1]);
    }, []);

    function loadData() {
        let offset = (scrollCount.current - 1) * MAX_PER_PAGE;
        setLoading(true);
        get_search_blog(keyword.value, offset, MAX_PER_PAGE).then(r => {
            let list = [];
            if (r !== null) {
                for (let i in r) {
                    list.push(r[i]);
                }
            }
            if (list.length === 0) {
                loadAll.current = true;
            } else {
                let temp = longList;
                for (let i = 0; i < list.length; i++) {
                    let isContains = false;
                    for (let j = 0; j < temp.length; j++) {
                        if (temp[j].id === list[i].id) {
                            isContains = true;
                            break;
                        }
                    }
                    if (!isContains) {
                        temp.push(list[i]);
                    }
                }
                setLongList(temp);
            }
            setLoading(false);
        });
    }

    return (
        <div className={'mb-10'}>
            <Card invertedColors variant={"soft"} color={"primary"}>
                <div className={'flex justify-start gap-2 select-none'}>
                    <Typography className={'font-bold'} level="title-sm" variant="plain" color="primary">
                        Results of
                    </Typography>
                    <Chip variant="outlined" color="primary">{currKeyWord}</Chip>
                </div>
                <Divider sx={{
                    width: "95%",
                    marginLeft: "2.5%"
                }}/>
                <CardContent>
                    <List
                        id={"resultList"}
                        color={"primary"}
                        variant="soft"
                        placement="bottom-start"
                        sx={{
                            padding: 0,
                            borderRadius: "var(--joy-radius-sm)",
                            backgroundColor: "transparent",
                        }}>
                        {longList.map((item, i) => (
                            <div key={i}>
                                <ListItem sx={{
                                    borderRadius: 6,
                                    marginTop: "3px",
                                    marginLeft: "3%",
                                    marginRight: "3%",
                                    marginBottom: "3px",
                                }}>
                                    <ListItemButton>
                                        <Typography>
                                            <Typography className={'font-bold'}>{item.title}</Typography><br/>
                                            <Typography noWrap level={'body-sm'}>{item.desc}</Typography><br/>
                                            <Typography level={'body-sm'}>{
                                                item.content.length <= 100 ? item.content : (item.content.slice(0, 100) + " ...")
                                            }</Typography>
                                        </Typography>
                                    </ListItemButton>
                                </ListItem>
                            </div>
                        ))}
                    </List>
                    {loading &&
                        <div className="flex justify-center items-center">
                            <CircularProgress
                                color="primary"
                                determinate={false}
                                size="md"
                                variant="soft"
                            />
                        </div>
                    }
                </CardContent>
            </Card>
        </div>
    )
}