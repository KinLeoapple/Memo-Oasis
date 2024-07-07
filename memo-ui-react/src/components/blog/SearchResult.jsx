import {Card, CardContent, Chip, CircularProgress, Divider, Typography} from "@mui/joy";
import {useDispatch, useSelector} from "react-redux";
import {
    newSearchBlogKeyword,
    selectSearchKeyword,
    setSearchBlogKeyword
} from "@/assets/js/data/reducer/blog/search_keyword_slice.js";
import {get_search_blog} from "@/assets/js/api/api.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {MAX_LOAD} from "@/assets/js/data/static.js";
import {setBlogValue} from "@/assets/js/data/reducer/blog/blog_slice.js";
import {append_list} from "@/assets/js/utils/append_list.js";
import {ResultList} from "@/components/common/ResultList.jsx";
import {setShowResultValue} from "@/assets/js/data/reducer/blog/show_search_result_slice.js";

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
        if ((typeof children[children.length - 1]) != "undefined")
            observer.observe(children[children.length - 1]);
    }, []);

    function loadData() {
        let offset = (scrollCount.current - 1) * MAX_LOAD;
        setLoading(true);
        get_search_blog(keyword.value, offset, MAX_LOAD).then(r => {
            let list = [];
            if (r !== null) {
                for (let i in r) {
                    list.push(r[i]);
                }
            }
            if (list.length === 0) {
                loadAll.current = true;
            } else {
                setLongList(append_list(longList, list));
            }
            setLoading(false);
        });
    }

    function goToRender(id) {
        dispatch(setSearchBlogKeyword(newSearchBlogKeyword("")));
        dispatch(setBlogValue(id));
        dispatch(setShowResultValue(false));
    }

    return (
        <div className={'mb-10'}>
            <Card invertedColors variant={"soft"} color={"primary"}>
                <div className={'flex justify-start gap-2 select-none'}>
                    <Typography className={'font-bold'} level="title-sm" variant="plain" color="primary">
                        Results of
                    </Typography>
                    <Chip color="primary"
                          size="sm"
                          variant="outlined"
                          sx={{
                              "--Chip-minHeight": "19px",
                              "--Chip-gap": "8px",
                              "--Chip-paddingInline": "12px"
                          }}>
                        <span className={'w-full text-center'}>{currKeyWord}</span>
                    </Chip>
                </div>
                <Divider sx={{
                    width: "95%",
                    marginLeft: "2.5%"
                }}/>
                <CardContent>
                    <ResultList id={"resultList"} list={longList} fn={goToRender}/>
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