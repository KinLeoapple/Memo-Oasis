import {Button, Card, CardActions, CardContent, Typography, useColorScheme} from "@mui/joy";
import {MdEditor} from "md-editor-rt";
import {useCallback, useEffect, useState} from "react";
import 'md-editor-rt/lib/style.css';
import "@/assets/css/editor.css";
import {client_width} from "@/assets/js/utils/client_size.js";
import {sanitize} from "@/assets/js/utils/sanitize.js";
import {post_img} from "@/assets/js/api/api.js";

export const Editor = () => {
    const exclude = [
        '-',
        'revoke',
        'next',
        'save',
        'pageFullscreen',
        'fullscreen',
        'htmlPreview',
        'catalog',
        'github'
    ]


    const themeMode = useColorScheme();
    const [mounted, setMounted] = useState(false);
    const [text, setText] = useState("");
    const [width, setWidth] = useState(countWidth());
    const [height, setHeight] = useState(countHeight());
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
            window.removeEventListener('resize', onResize);
            window.addEventListener('resize', onResize);
        }
    }, []);

    const onResize = useCallback(() => {
        setWidth(countWidth());
        setHeight(countHeight());
    }, []);

    function countWidth() {
        return client_width() / 3 * 2;
    }

    function countHeight() {
        return width / 16 * 9;
    }

    const uploadImg = async (files, callback) => {
        const res = await Promise.all(
            files.map((file) => {
                return new Promise(resolve => {
                    post_img(localStorage.getItem("token"), file).then(r => {
                        if (r.saved !== null && r.saved !== undefined) {
                            resolve(r.saved);
                        }
                    });
                });
            })
        );

        let protocol = window.location.protocol;
        let hostname = window.location.hostname;
        let port = window.location.port;
        if (port === null || port === undefined || port === "")
            port = null;

        callback(res.map((id) =>
            `${protocol}//${hostname}${port != null ? `:${8080}` : ""}/img/${id}`
        ));
        document.querySelectorAll(".md-editor-modal-close").forEach(el => {
            el.click();
        });
    };

    return (
        <div className={'mt-10'} style={{
            width: `${width}px`,
            height: `${height}px`
        }}>
            <Card color={"primary"} variant={"outlined"} className={'overflow-hidden'} sx={{
                boxShadow: "lg",
            }}>
                <CardContent sx={{
                    padding: "0",
                }}>
                    <MdEditor
                        style={{
                            minWidth: "100%",
                            minHeight: "100%"
                        }}
                        language={"en-US"}
                        className={'editor min-w-full min-h-full'}
                        modelValue={text}
                        sanitize={(html) => sanitize(text, html)}
                        onChange={setText}
                        theme={themeMode.mode === "dark" ? "dark" : "light"}
                        previewTheme={"vuepress"}
                        htmlPreview={false}
                        toolbarsExclude={exclude}
                        footers={['']}
                        inputBoxWitdh={"50%"}
                        scrollAuto={true}
                        onUploadImg={uploadImg}
                    />
                </CardContent>
                <CardActions buttonFlex="0 2 200px" className={'flex justify-between items-end'} style={{
                    padding: "0",
                }}>
                    <Typography level={"body-xs"} color="primary" variant={"plain"}>{`${text.length}  character(s)`}</Typography>
                    <Button tabIndex={-1} loading={checking} variant="solid" color="primary" className={'capitalize'}
                            onClick={null}>
                        save as
                    </Button>
                </CardActions>
            </Card>
        </div>
    )
}