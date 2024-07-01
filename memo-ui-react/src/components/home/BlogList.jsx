import {useEffect, useState} from "react";
import {get_blog, get_blog_all} from "@/assets/js/api/api.js";
import {AspectRatio, Card, CardContent, Chip, Divider, Typography} from "@mui/joy";
import {to_date} from "@/assets/js/utils/to_date.js";
import CalculateMonth from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import {useDispatch, useSelector} from "react-redux";
import {selectBlogPage} from "@/assets/js/data/reducer/blog_page_slice.js";
import {MAX_PER_PAGE} from "@/assets/js/data/static.js";
import {setNumberValue} from "@/assets/js/data/reducer/blog_number_slice.js";
import {scroll_to_top} from "@/assets/js/utils/scroll.js";
import {append, ConditionType, newCondition, selectCondition} from "@/assets/js/data/reducer/condition_slice.js";
import img from "@/assets/img/img.webp";
import {setBlogValue} from "@/assets/js/data/reducer/blog_slice.js";

export const BlogList = () => {
    const [ids, setIds] = useState({data: [], refresh: false});
    const [blogs, setBlogs] = useState({data: [], refresh: false});
    const [filterBlogs, setFilterBlogs] = useState({data: [], refresh: false});
    const page = useSelector(selectBlogPage);
    const conditions = useSelector(selectCondition);
    const dispatch = useDispatch();

    useEffect(() => {
        scroll_to_top();
    }, [page]);

    useEffect(() => {
        get_blog_all().then(r => {
            if (r !== null) {
                let list = [];
                for (let i in r) {
                    list.push(r[i].id);
                }
                setIds({data: list, refresh: true});
            } else {
                setIds({data: [], refresh: false});
            }
        });
    }, [ids.refresh]);

    useEffect(() => {
        dispatch(setNumberValue(parseInt(Math.ceil(filterBlogs.data.length / MAX_PER_PAGE).toString()) || 0));
    }, [filterBlogs, dispatch]);

    useEffect(() => {
        if (conditions.length > 0) {
            let list = blogs.data;
            if (conditions.filter(item => item.type === ConditionType.Category).length > 0) {
                list = list.filter(item => {
                    for (let i = 0; i < conditions.length; i++) {
                        let con = conditions[i];
                        if (con.type === ConditionType.Category && item.category === con.condition) {
                            return true;
                        }
                    }
                });
            }
            if (conditions.filter(item => item.type === ConditionType.Date).length > 0) {
                list = list.filter(item => {
                    for (let i = 0; i < conditions.length; i++) {
                        let con = conditions[i];
                        if (con.type === ConditionType.Date && item.date === con.condition) {
                            return true;
                        }
                    }
                });
            }
            setFilterBlogs({data: list, refresh: true});
        } else {
            setFilterBlogs(blogs);
        }
    }, [blogs.refresh, conditions]);

    useEffect(() => {
        let requests = [];
        if (ids.data.length > 0) {
            let start = MAX_PER_PAGE * (page - 1);
            let end = start + MAX_PER_PAGE;
            let sliceCopy = ids.data.slice(start, end);
            for (let i in sliceCopy) {
                requests.push(get_blog(sliceCopy[i]));
            }
            Promise.all(requests).then(arr => {
                let list = [];
                for (let i in arr) {
                    if (arr[i] !== null) {
                        list.push(arr[i]);
                    } else {
                        list.push(null);
                    }
                }
                setBlogs({data: list, refresh: true});
            });
        }
    }, [blogs.refresh, ids.data, page]);

    function appendDateCondition(date) {
        dispatch(append(newCondition(ConditionType.Date, date)));
    }

    function appendCategoryCondition(category) {
        dispatch(append(newCondition(ConditionType.Category, category)));
    }

    function selectedBlog(blogId) {
        dispatch(setBlogValue(blogId));
    }

    return (
        <>
            {
                filterBlogs.data.sort((a, b) => {
                    return Number(b.date) - Number(a.date);
                }).map((blog, i) => (
                    <Card
                        onClick={(e) => selectedBlog(blog.id)}
                        invertedColors key={i} color="primary" variant="soft"
                          className={`mb-5 cursor-pointer select-none`}
                          sx={{
                              boxShadow: 'lg',
                          }}>
                        <AspectRatio minHeight="120px" maxHeight="200px">
                            <img
                                src={img}
                                loading="lazy"
                                alt=""
                                draggable={false}
                            />
                        </AspectRatio>
                        <div>
                            <Typography level="title-lg">{blog.title}</Typography>
                            <div className={`flex gap-2`}>
                                <span className={`flex items-center gap-1`}><CalculateMonth
                                    sx={{fontSize: 'small'}}/><Chip
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        appendDateCondition(blog.date);
                                    }}
                                    size="sm" className={'text-xs'} color="primary" variant="soft" sx={{
                                    "--Chip-paddingInline": "5px",
                                    "--Chip-minHeight": "16px",
                                    "--Chip-decoratorChildHeight": "16px",
                                }}>{to_date(blog.date)}</Chip></span>
                                <Divider orientation="vertical"/>
                                <span className={`flex items-center gap-1`}><CategoryIcon
                                    sx={{fontSize: 'small'}}/>
                                    <Chip
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            appendCategoryCondition(blog.category);
                                        }}
                                        size="sm" className={'text-xs'} color="primary" variant="soft" sx={{
                                        "--Chip-paddingInline": "5px",
                                        "--Chip-minHeight": "16px",
                                        "--Chip-decoratorChildHeight": "16px",
                                    }}>{blog.category}</Chip></span>
                            </div>
                        </div>
                        <CardContent>
                            <Typography>
                                <span className={`text-xl`}>{blog.desc.charAt(0)}</span>
                                <span>{blog.desc.substring(1, blog.desc.length)}</span>
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            }
        </>
    )
}