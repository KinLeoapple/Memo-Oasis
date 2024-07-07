import {AspectRatio, Button, Card, CardContent, CardOverflow, useColorScheme} from "@mui/joy";
import img from "@/assets/img/img.webp";
import {useDispatch, useSelector} from "react-redux";
import {selectBlog, setBlogValue} from "@/assets/js/data/reducer/blog/blog_slice.js";
import {useEffect, useState} from "react";
import {get_blog_content} from "@/assets/js/api/api.js";
import {setContentValue} from "@/assets/js/data/reducer/blog/blog_content_slice.js";
import {MdPreview} from "md-editor-rt";
import 'md-editor-rt/lib/preview.css';
import {is_html} from "@/assets/js/utils/is_html.js";
import {Close} from "@mui/icons-material";
import {newSearchBlogKeyword, setSearchBlogKeyword} from "@/assets/js/data/reducer/blog/search_keyword_slice.js";
import {setShowResultValue} from "@/assets/js/data/reducer/blog/show_search_result_slice.js";

export const BlogRenderer = () => {
    const theme = useColorScheme();
    const blog = useSelector(selectBlog);
    const dispatch = useDispatch();
    const [id] = useState('render');
    const [content, setContent] = useState("");

    useEffect(() => {
        dispatch(setSearchBlogKeyword(newSearchBlogKeyword("")));
        dispatch(setShowResultValue(false));
    }, []);

    useEffect(() => {
        get_blog_content(blog).then(r => {
            setContent(r.content);
        });
    }, [blog]);

    useEffect(() => {
        dispatch(setContentValue(content));
    }, [content, dispatch]);

    const sanitize = (html) => {
        if (content !== null) {
            if (is_html(content)) {
                return content;
            }
            return html;
        }
    }

    function goBack() {
        dispatch(setBlogValue(0));
        dispatch(setContentValue(""));
        dispatch(setSearchBlogKeyword(newSearchBlogKeyword("")));
        dispatch(setShowResultValue(false));
    }

    return (
        <div className={'relative mt-10'}>
            <Button onClick={goBack} color="neutral" variant="solid" sx={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                zIndex: 1,
                position: "absolute",
                marginTop: "-15px",
                marginLeft: "calc(100% - 35px)",
                boxShadow: "lg",
                border: "1px solid",
                borderColor: "var(--variant-outlinedBorder, var(--joy-palette-primary-outlinedBorder, var(--joy-palette-primary-300, #97C3F0)))",
                background: "var(--joy-palette-background-surface)",
                color: "rgba(var(--joy-palette-danger-mainChannel) / 1)",
                transition: "all .2s",
                "&:hover": {
                    color: "white",
                    background: "rgba(var(--joy-palette-danger-mainChannel) / 1)",
                }
            }}>
                <Close style={{
                    width: "30px",
                    height: "30px",
                }}/>
            </Button>
            <Card color="primary" variant="outlined" sx={{
                boxShadow: 'lg',
            }}>
                <CardOverflow>
                    <AspectRatio ratio="2">
                        <img
                            src={img}
                            loading="lazy"
                            alt=""
                        />
                    </AspectRatio>
                </CardOverflow>
                <CardContent>
                    <MdPreview
                        theme={theme.mode === "dark" ? "dark" : "light"}
                        style={{
                            backgroundColor: "transparent",
                        }}
                        editorId={id}
                        modelValue={content}
                        sanitize={sanitize}
                        previewTheme={"vuepress"}/>
                </CardContent>
            </Card>
        </div>
    )
}