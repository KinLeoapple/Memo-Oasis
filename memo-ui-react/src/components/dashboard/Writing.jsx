import {useSelector} from "react-redux";
import {selectUserBasicInfo} from "@/assets/js/data/reducer/user_basic_info_slice.js";
import {useEffect, useRef, useState} from "react";
import {selectSideBar, SideBarIndex} from "@/assets/js/data/reducer/dashboard/side_bar_slice.js";
import {
    get_blog,
    get_blog_all,
    get_blog_content,
    get_draft,
    get_draft_all,
    get_draft_content
} from "@/assets/js/api/api.js";
import {MAX_LOAD, MAX_PER_PAGE} from "@/assets/js/data/static.js";
import {
    Button,
    Card, CardContent,
    CircularProgress,
    Divider, Typography
} from "@mui/joy";
import {append_list} from "@/assets/js/utils/append_list.js";
import {ExpandCircleDownOutlined} from "@mui/icons-material";
import {ResultList} from "@/components/common/ResultList.jsx";

export const Writing = () => {
    const userBasicInfo = useSelector(selectUserBasicInfo);
    const sideBar = useSelector(selectSideBar);

    const [dynamicList, setDynamicList] = useState([]);
    const dynamicListRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const [isLoadAll, setIsLoadAll] = useState(false);
    const loadAll = useRef(false);
    const [offsetCount, setOffsetCount] = useState(1);
    const offsetCountRef = useRef(1);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setDynamicList([]);
        dynamicListRef.current = [];
        setOffsetCount(1);
        offsetCountRef.current = 1;
        loadAll.current = false;
        setIsLoadAll(false);
        setRefresh(!refresh);
    }, [sideBar]);

    useEffect(() => {
        loadData();
    }, [refresh]);

    function hasNext() {
        const fn = (r) => {
            Object.getOwnPropertyNames(r).length === 0 ? (() => {
                setIsLoadAll(true);
                loadAll.current = true;
            })() : null;
            setOffsetCount(offsetCountRef.current + 1);
        }

        let offset = offsetCount * MAX_LOAD;
        if (sideBar === SideBarIndex.Blogs) {
            get_blog_all(userBasicInfo.id, offset, MAX_LOAD).then(r => {
                fn(r);
            });
        } else if (sideBar === SideBarIndex.Drafts) {
            get_draft_all(localStorage.getItem("token"), userBasicInfo.id, offset, MAX_LOAD).then(r => {
                fn(r);
            });
        }
    }

    function loadData() {
        if (!loadAll.current) {
            let offset = (offsetCount - 1) * MAX_LOAD;
            setLoading(true);
            dynamicListRef.current = dynamicList;
            offsetCountRef.current = offsetCount;
            if (sideBar === SideBarIndex.Blogs) {
                get_blog_all(userBasicInfo.id, offset, MAX_LOAD).then(r => {
                    updateList(r);
                    hasNext();
                });
            } else if (sideBar === SideBarIndex.Drafts) {
                get_draft_all(localStorage.getItem("token"), userBasicInfo.id, offset, MAX_LOAD).then(r => {
                    updateList(r);
                    hasNext();
                });
            }
        }
    }

    function updateList(r) {
        let size = 0;
        let list = [];
        let timer = null;
        for (let i in r) {
            size++;
            clearTimeout(timer);
            let requestList;
            if (sideBar === SideBarIndex.Blogs) {
                requestList = [get_blog(userBasicInfo.id, r[i].id), get_blog_content(r[i].id)];
            } else if (sideBar === SideBarIndex.Drafts) {
                let token = localStorage.getItem("token");
                requestList = [get_draft(token, userBasicInfo.id, r[i].id), get_draft_content(token, r[i].id)];
            }
            Promise.all(requestList).then(arr => {
                arr[0].content = arr[1].content;
                list.push(arr[0]);
                timer = setTimeout(() => {
                    if (list.length !== 0)
                        setDynamicList(append_list(dynamicListRef.current, list));
                    setLoading(false);
                }, 100);
            });
        }
        if (size === 0) {
            setIsLoadAll(true);
            loadAll.current = true;
        }
    }

    return (
        <div className={'mb-10'}>
            <Card invertedColors variant={"soft"} color={"primary"}>
                <div className={'flex justify-start gap-2 select-none'}>
                    <Typography className={'font-bold'} level="title-sm" variant="plain" color="primary">
                        {sideBar === SideBarIndex.Blogs ? 'Blogs' : 'Drafts'}
                    </Typography>
                </div>
                <Divider sx={{
                    width: "95%",
                    marginLeft: "2.5%"
                }}/>
                <CardContent>
                    <ResultList id={"writingList"} list={dynamicList} fn={null}/>
                </CardContent>
                {!isLoadAll &&
                    <>
                        {loading ?
                            <div className="flex justify-center items-center">
                                <CircularProgress
                                    color="primary"
                                    determinate={false}
                                    size="md"
                                    variant="soft"
                                />
                            </div> :
                            <>
                                <Divider sx={{
                                    width: "95%",
                                    marginLeft: "2.5%"
                                }}/>
                                <CardContent className={'flex justify-center items-center'}>
                                    <Typography className={'p-[1px]'}
                                                endDecorator={
                                                    <Button className={'flex justify-center items-center gap-1'}
                                                          variant="plain"
                                                          onClick={loadData}
                                                          fontSize="md"
                                                          sx={{
                                                              borderRadius: "sm"
                                                          }}
                                                    >
                                                        <ExpandCircleDownOutlined/>
                                                        show more
                                                    </Button>
                                                }/>
                                </CardContent>
                            </>
                        }
                    </>
                }
            </Card>
        </div>
    )
}