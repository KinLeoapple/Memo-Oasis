import {
    AspectRatio,
    Card,
    CardContent,
    Chip,
    Divider,
    Dropdown,
    IconButton, ListItemDecorator,
    Menu,
    MenuButton, MenuItem,
    Typography
} from "@mui/joy";
import img from "@/assets/img/img.webp";
import CalculateMonth from "@mui/icons-material/CalendarMonth";
import {to_date} from "@/assets/js/utils/to_date.js";
import CategoryIcon from "@mui/icons-material/Category";
import {append, ConditionType, newCondition} from "@/assets/js/data/reducer/blog/condition_slice.js";
import {setBlogValue} from "@/assets/js/data/reducer/blog/blog_slice.js";
import {useDispatch} from "react-redux";
import {newSearchBlogKeyword, setSearchBlogKeyword} from "@/assets/js/data/reducer/blog/search_keyword_slice.js";
import {AutoFixHigh, Delete, MoreVert} from "@mui/icons-material";
import {useRef, useState} from "react";
import {color_css_var} from "@/assets/js/utils/color_css_var.js";

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
    const menuItems = [
        {
            decorator: <AutoFixHigh/>,
            text: "modify",
            color: "primary",
            func: null
        },
        {
            decorator: <Delete/>,
            text: "delete",
            color: "danger",
            func: null
        },
    ]

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const timer = useRef(null);

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

    function handleMouseEnter(e) {
        e.stopPropagation();
        if (timer.current !== null) {
            clearTimeout(timer.current);
        }
        setOpen(true);
    }

    function handleMouseLeave(e) {
        e.stopPropagation();
        timer.current = setTimeout(() => {
            setOpen(false);
        }, 100);
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
                <div className={'flex justify-between items-start'}>
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
                    {
                        <Dropdown
                            open={open}>
                            <MenuButton
                                slots={{root: IconButton}}
                                slotProps={{
                                    root: {
                                        size: 'sm',
                                        variant: 'plain',
                                        color: 'primary',
                                        onMouseEnter: handleMouseEnter,
                                        onMouseLeave: handleMouseLeave
                                    }
                                }}
                            >
                                <MoreVert/>
                            </MenuButton>
                            <Menu
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                variant="soft"
                                color="primary"
                                placement="bottom-end"
                                className={'select-none'}
                                size="sm">
                                {menuItems.map((item, index) => (
                                    <div key={index}>
                                        <MenuItem
                                            onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    item.func()
                                                }}
                                            tabIndex={-1}
                                            className={'flex justify-center items-center capitalize pl-2 pr-2'}
                                            sx={{
                                                borderRadius: 6,
                                                marginTop: "3px",
                                                marginLeft: "5px",
                                                marginRight: "5px",
                                                marginBottom: "4px",
                                            }}>
                                            <ListItemDecorator variant="plain" sx={{
                                                color: color_css_var(item.color)
                                            }}>
                                                {item.decorator}
                                            </ListItemDecorator>
                                            <span className={'text-sm font-bold capitalize'} style={{
                                                color: color_css_var(item.color)
                                            }}>
                                                {item.text}
                                            </span>
                                        </MenuItem>
                                        {
                                            index !== menuItems.length - 1 &&
                                            <Divider sx={{
                                                width: "80%",
                                                marginLeft: "10%"
                                            }}/>
                                        }
                                    </div>
                                ))}
                            </Menu>
                        </Dropdown>
                    }
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