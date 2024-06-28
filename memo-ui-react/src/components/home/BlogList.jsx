import {useEffect, useState} from "react";
import {get_blog, get_blog_all} from "@/assets/js/api/api.js";
import {AspectRatio, Card, CardContent, Divider, Typography} from "@mui/joy";
import {to_date} from "@/assets/js/utils/to_date.js";
import CalculateMonth from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import {useDispatch, useSelector} from "react-redux";
import {selectBlogPage} from "@/assets/js/data/reducer/blog_page_slice.js";
import {MAX_PER_PAGE} from "@/assets/js/data/static.js";
import {setNumberValue} from "@/assets/js/data/reducer/blog_number_slice.js";
import {scroll_to_top} from "@/assets/js/utils/scroll.js";

export const BlogList = () => {
    const [ids, setIds] = useState({data: [], refresh: false});
    const [blogs, setBlogs] = useState({data: [], refresh: false});
    const page = useSelector(selectBlogPage);
    const dispatch = useDispatch();

    useEffect(() => {
        scroll_to_top();
    }, [page]);

    useEffect(() => {
        get_blog_all().then(r => {
            if (r !== null) {
                let list = new Array(9);
                for (let j = 0; j < list.length; j++) {
                    for (let i in r) {
                        list[j] = r[i].id;
                    }
                }
                setIds({data: list, refresh: true});
            } else {
                setIds({data: [], refresh: false});
            }
        });
    }, [ids.refresh]);
    
    useEffect(() => {
        dispatch(setNumberValue(parseInt(Math.ceil(ids.data.length / MAX_PER_PAGE).toString()) || 0));
    }, [dispatch, ids]);

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

    return (
        <>
            {
                blogs.data.sort((a, b) => {
                    return Number(b.date) - Number(a.date);
                }).map((blog) => (
                    <Card key={blog} color="primary" variant="soft" className={`mb-5 cursor-pointer select-none`}
                          sx={{
                        boxShadow: 'lg',
                    }}>
                        <AspectRatio minHeight="120px" maxHeight="200px">
                            <img
                                src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                                loading="lazy"
                                alt=""
                                draggable={false}
                            />
                        </AspectRatio>
                        <div>
                            <Typography level="title-lg">{blog.title}</Typography>
                            <div className={`text-xs flex gap-2`}>
                                <span className={`flex items-center gap-1`}><CalculateMonth
                                    sx={{fontSize: 'small'}}/>{to_date(blog.date)}</span>
                                <Divider orientation="vertical"/>
                                <span className={`flex items-center gap-1`}><CategoryIcon
                                    sx={{fontSize: 'small'}}/>{blog.category}</span>
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