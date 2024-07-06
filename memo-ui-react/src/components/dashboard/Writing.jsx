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
import {MAX_PER_PAGE} from "@/assets/js/data/static.js";
import {
    Card, CardContent,
    CircularProgress,
    Divider, Link,
    List,
    ListItem,
    ListItemButton,
    Typography
} from "@mui/joy";
import {append_list} from "@/assets/js/utils/append_list.js";
import {ExpandCircleDownOutlined, Inventory2} from "@mui/icons-material";

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

        let offset = offsetCount * MAX_PER_PAGE;
        if (sideBar === SideBarIndex.Blogs) {
            get_blog_all(userBasicInfo.id, offset, MAX_PER_PAGE).then(r => {
                fn(r);
            });
        } else if (sideBar === SideBarIndex.Drafts) {
            get_draft_all(localStorage.getItem("token"), userBasicInfo.id, offset, MAX_PER_PAGE).then(r => {
                fn(r);
            });
        }
    }

    function loadData() {
        if (!loadAll.current) {
            let offset = (offsetCount - 1) * MAX_PER_PAGE;
            setLoading(true);
            dynamicListRef.current = dynamicList;
            offsetCountRef.current = offsetCount;
            if (sideBar === SideBarIndex.Blogs) {
                get_blog_all(userBasicInfo.id, offset, MAX_PER_PAGE).then(r => {
                    updateList(r);
                    hasNext();
                });
            } else if (sideBar === SideBarIndex.Drafts) {
                get_draft_all(localStorage.getItem("token"), userBasicInfo.id, offset, MAX_PER_PAGE).then(r => {
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
                    <List
                        className={`${dynamicList.length === 0 ? 'flex justify-center items-center' : ''}`}
                        id={"writingList"}
                        color={"primary"}
                        variant="soft"
                        placement="bottom-start"
                        sx={{
                            padding: 0,
                            borderRadius: "var(--joy-radius-sm)",
                            backgroundColor: "transparent",
                        }}>
                        {dynamicList.length === 0 ?
                            <>
                                <Typography variant={"plain"} color={"primary"} level={'body-lg'}>
                                    <Inventory2/>
                                </Typography>
                                <Typography level={'body-sm'}>
                                    No Results Found
                                </Typography>
                            </> :
                            <>{dynamicList.map((item, i) => (
                                <div key={i}>
                                    <ListItem sx={{
                                        borderRadius: 6,
                                        marginTop: "3px",
                                        marginLeft: "3%",
                                        marginRight: "3%",
                                        marginBottom: "3px",
                                    }}>
                                        <ListItemButton tabIndex={-1} onClick={null}>
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
                            ))}</>
                        }
                    </List>
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
                                                    <Link className={'flex justify-center items-center gap-1'}
                                                          variant="plain"
                                                          onClick={loadData}
                                                          fontSize="md"
                                                          borderRadius="sm"
                                                    >
                                                        <ExpandCircleDownOutlined/>
                                                        show more
                                                    </Link>
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