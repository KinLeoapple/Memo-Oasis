import {AspectRatio, Card, CardContent, CardOverflow, Typography, useColorScheme} from "@mui/joy";
import img from "@/assets/img/img.webp";
import {useDispatch, useSelector} from "react-redux";
import {selectBlog} from "@/assets/js/data/reducer/blog_slice.js";
import {useEffect, useState} from "react";
import {get_blog_content} from "@/assets/js/api/api.js";
import {setContentValue} from "@/assets/js/data/reducer/blog_content_slice.js";
import {MdPreview} from "md-editor-rt";
import 'md-editor-rt/lib/preview.css';
import {is_html} from "@/assets/js/utils/is_html.js";

export const BlogRenderer = () => {
    const theme = useColorScheme();
    const blog = useSelector(selectBlog);
    const dispatch = useDispatch();
    const [id] = useState('render');
    const [content, setContent] = useState("");

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

    return (
        <>
            <Card color="primary" className={'mb-10'} variant="outlined" sx={{
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
                    <Typography>
                        <MdPreview
                            theme={theme.mode === "dark" ? "dark" : "light"}
                            style={{
                                backgroundColor: "transparent",
                            }}
                            editorId={id}
                            modelValue={content}
                            sanitize={sanitize}
                            previewTheme={"vuepress"}/>
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}