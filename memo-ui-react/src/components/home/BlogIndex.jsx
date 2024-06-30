import {useSelector} from "react-redux";
import {selectBlogContent} from "@/assets/js/data/reducer/blog_content_slice.js";
import {List, ListItem, ListItemButton, Typography} from "@mui/joy";
import {useEffect, useState} from "react";
import {marked} from "marked";
import {smooth_scroll} from "@/assets/js/utils/scroll.js";

export const BlogIndex = () => {
    const content = useSelector(selectBlogContent);
    const [maxTitle, setMaxTitle] = useState(null);
    const [blogIndex, setBlogIndex] = useState([]);
    const [max, setMax] = useState(1);
    const [min] = useState(6);

    useEffect(() => {
        indexOfBlog(content);
        console.log(blogIndex)
    }, [content]);

    useEffect(() => {
        setMax(maxTitle);
    }, [maxTitle]);

    useEffect(() => {
        const render = document.querySelector("#render");
        for (let i = min; i >= max; i--)
            markHeadings(render, i);
    }, [blogIndex, max, min]);

    async function markHeadings (render, level){
        const levelHeading = blogIndex.filter(el => {
            return el.tag === level;
        });
        if (levelHeading.length === 0) {
            return;
        }
        render.querySelectorAll(`h${level}`).forEach((el, i) => {
            el.setAttribute("id", `blog-index-${levelHeading[i].id}`);
        });
    }

    function indexOfBlog(content) {
        if (content !== null) {
            let anchor = 0;
            let rendererMD = new marked.Renderer();
            // eslint-disable-next-line no-unused-vars
            rendererMD.heading = (text, level, _) => {
                if (maxTitle === null || level < maxTitle) {
                    setMaxTitle(level);
                }
                anchor += 1;

                let isExists = false;
                for (let i = 0; i < blogIndex.length; i++) {
                    if (blogIndex[i].id === anchor) {
                        isExists = true;
                        break;
                    }
                }

                if (!isExists) {
                    let list = blogIndex;
                    list.push(
                        {
                            'id': anchor,
                            'tag': level,
                            'text': text
                        });
                    setBlogIndex(list);
                }
                return `<h${level}>${text}</h${level}>`;
            }

            marked.setOptions({
                renderer: rendererMD,
                pedantic: false,
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
            });
            marked(content);
        }
    }

    return (
        <>
            <List
                className={'select-none'}
                size="lg"
                color="primary"
                variant="plain"
                sx={{
                    "--List-gap": "5px"
                }}
            >
                <Typography level="h4" color="neutral">
                    <span style={{
                        fontSize: 'x-large'
                    }}>I</span>ndex
                </Typography>
                {
                    blogIndex.map((item, i) => (
                        <ListItem key={i} className={`cursor-pointer select-none`}
                                  style={{
                                      marginLeft: `${((item.tag - maxTitle) * 10)}px`
                                  }}
                                  sx={{
                                      width: '100%'
                                  }}>
                            <ListItemButton
                                onClick={() => smooth_scroll(`blog-index-${item.id}`)}
                                color={"primary"}
                                className={'flex flex-row justify-start'} sx={{
                                borderRadius: '6px'
                            }}>
                                <p className={`text-base font-bold`}>{item.text}</p>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </>
    )
}