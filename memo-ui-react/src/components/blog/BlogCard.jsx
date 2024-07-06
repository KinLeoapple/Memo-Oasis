import {AspectRatio, Card, CardContent, Chip, Divider, Typography} from "@mui/joy";
import img from "@/assets/img/img.webp";
import CalculateMonth from "@mui/icons-material/CalendarMonth";
import {to_date} from "@/assets/js/utils/to_date.js";
import CategoryIcon from "@mui/icons-material/Category";
import {append, ConditionType, newCondition} from "@/assets/js/data/reducer/blog/condition_slice.js";
import {setBlogValue} from "@/assets/js/data/reducer/blog/blog_slice.js";
import {useDispatch} from "react-redux";
import {newSearchBlogKeyword, setSearchBlogKeyword} from "@/assets/js/data/reducer/blog/search_keyword_slice.js";

export const BlogCard = ({
                             // eslint-disable-next-line react/prop-types
                             id = 0,
                             // eslint-disable-next-line react/prop-types
                             title = "",
                             // eslint-disable-next-line react/prop-types
                             date = 0,
                             // eslint-disable-next-line react/prop-types
                             category = "",
                             // eslint-disable-next-line react/prop-types
                             desc = ""
                         }) => {
    const dispatch = useDispatch();

    function appendDateCondition(date) {
        dispatch(append(newCondition(ConditionType.Date, date)));
    }

    function appendCategoryCondition(category) {
        dispatch(append(newCondition(ConditionType.Category, category)));
    }

    function selectedBlog(blogId) {
        dispatch(setBlogValue(blogId));
        dispatch(setSearchBlogKeyword(newSearchBlogKeyword("")));
    }

    return (
        <>
            <Card
                onClick={() => selectedBlog(id)}
                invertedColors color="primary" variant="soft"
                className={`mb-5 cursor-pointer select-none`}
                sx={{
                    boxShadow: 'lg',
                    transition: "all .2s",
                    "&:hover": {
                        background: "var(--variant-softHoverBg, var(--joy-palette-primary-softHoverBg, var(--joy-palette-primary-200, #C7DFF7)))"
                    }
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
                    <Typography level="title-lg">{title}</Typography>
                    <div className={`flex gap-2`}>
                                <span className={`flex items-center gap-1`}><CalculateMonth
                                    sx={{fontSize: 'small'}}/><Chip
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        appendDateCondition(date);
                                    }}
                                    size="sm" className={'text-xs'} color="primary" variant="soft" sx={{
                                    "--Chip-paddingInline": "5px",
                                    "--Chip-minHeight": "16px",
                                    "--Chip-decoratorChildHeight": "16px",
                                }}>{to_date(date)}</Chip></span>
                        <Divider orientation="vertical"/>
                        <span className={`flex items-center gap-1`}><CategoryIcon
                            sx={{fontSize: 'small'}}/>
                                    <Chip
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            appendCategoryCondition(category);
                                        }}
                                        size="sm" className={'text-xs'} color="primary" variant="soft" sx={{
                                        "--Chip-paddingInline": "5px",
                                        "--Chip-minHeight": "16px",
                                        "--Chip-decoratorChildHeight": "16px",
                                    }}>{category}</Chip></span>
                    </div>
                </div>
                <CardContent>
                    <Typography noWrap>
                        <span className={`text-xl`}>{desc.charAt(0)}</span>
                        <span>{desc.substring(1, desc.length)}</span>
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}