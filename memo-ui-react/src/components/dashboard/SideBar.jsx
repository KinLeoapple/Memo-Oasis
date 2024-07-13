import {
    Badge,
    Box,
    List,
    ListItem,
    ListItemButton, listItemClasses,
    ListItemContent,
    ListItemDecorator,
    listItemDecoratorClasses, Typography
} from "@mui/joy";
import {useEffect, useState} from "react";
import {ArrowDropDown, ArrowRight, Book, Draw, ModeEdit, Person} from "@mui/icons-material";
import {get_blog_total, get_draft_total} from "@/assets/js/api/api.js";
import {useDispatch} from "react-redux";
import {setSideBarValue, SideBarIndex} from "@/assets/js/data/reducer/dashboard/side_bar_slice.js";

export const SideBar = () => {
    const dispatch = useDispatch();
    const [index, setIndex] = useState(0);
    const [blogTotal, setBlogTotal] = useState(0);
    const [draftTotal, setDraftTotal] = useState(0);
    const [writingNest, setWritingNest] = useState(false);

    useEffect(() => {
        get_blog_total().then(r => {
            setBlogTotal(r.total);
        });
    }, []);

    useEffect(() => {
        get_draft_total(localStorage.getItem("token")).then(r => {
            setDraftTotal(r.total);
        })
    }, []);

    function handleWritingNest() {
        setWritingNest(!writingNest);
    }

    function selectedSideBar(i) {
        setIndex(i);
        dispatch(setSideBarValue(i));
    }

    return (
        <>
            <List
                aria-label="Sidebar"
                size="lg"
                className={'select-none'}
                variant="plain"
                sx={{
                    "--List-gap": "5px",
                    [`& .${listItemClasses.root}`]: {
                        width: "100%",
                    },
                    [`& .${listItemDecoratorClasses.root}`]: {
                        pr: '18px',
                    },
                    '& [role="button"]': {
                        borderRadius: '6px'
                    },
                }}
            >
                <Typography level="h4" color="neutral">
                    <span style={{
                        fontSize: 'x-large'
                    }}>M</span>enu
                </Typography>
                <ListItem>
                    <ListItemButton
                        tabIndex={-1}
                        selected={index === SideBarIndex.Profile}
                        color={'primary'}
                        variant="plain"
                        onClick={() => selectedSideBar(SideBarIndex.Profile)}
                    >
                        <ListItemDecorator>
                            <Person fontSize="lg"/>
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography noWrap className={`text-base font-bold`}
                                        sx={{
                                            color: "inherit"
                                        }}
                            >Profile</Typography>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
                <ListItem nested={writingNest}>
                    <ListItemButton
                        tabIndex={-1}
                        color={'primary'}
                        variant="plain"
                        onClick={handleWritingNest}
                    >
                        <ListItemDecorator>
                            {writingNest ?
                                <ArrowDropDown fontSize="lg"/> :
                                <ArrowRight fontSize="lg"/>
                            }
                            <ModeEdit fontSize="lg"/>
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography noWrap className={`text-base font-bold`}
                                        sx={{
                                            color: "inherit"
                                        }}
                            >Writing</Typography>
                        </ListItemContent>
                    </ListItemButton>
                    {writingNest &&
                        <List sx={{
                          marginLeft: '13px'
                        }}>
                            <ListItem>
                                <ListItemButton
                                    tabIndex={-1}
                                    selected={index === SideBarIndex.Blogs}
                                    color={'primary'}
                                    variant="plain"
                                    onClick={() => selectedSideBar(SideBarIndex.Blogs)}
                                >
                                    <ListItemDecorator>
                                        <Book fontSize="lg"/>
                                    </ListItemDecorator>
                                    <ListItemContent>
                                        <Typography noWrap className={`text-base font-bold`}
                                                    sx={{
                                                        color: "inherit"
                                                    }}
                                        >Blogs</Typography>
                                    </ListItemContent>
                                    <Badge variant="soft" size="sm" badgeContent={blogTotal} sx={{
                                        '--Badge-ring': '0 0 0 0'
                                    }}/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    tabIndex={-1}
                                    selected={index === SideBarIndex.Drafts}
                                    color={'primary'}
                                    variant="plain"
                                    onClick={() => selectedSideBar(SideBarIndex.Drafts)}
                                >
                                    <ListItemDecorator>
                                        <Draw fontSize="lg"/>
                                    </ListItemDecorator>
                                        <Typography noWrap className={`text-base font-bold`}
                                                    sx={{
                                                        color: "inherit"
                                                    }}
                                        >Drafts</Typography>
                                    <Badge variant="soft" size="sm" badgeContent={draftTotal} sx={{
                                        '--Badge-ring': '0 0 0 0'
                                    }}/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    }
                </ListItem>
            </List>
        </>
    )
}