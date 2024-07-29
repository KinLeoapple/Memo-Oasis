import {
    AspectRatio, Box,
    Button, ButtonGroup,
    Card,
    CardActions,
    CardContent, CardCover, CardOverflow, Divider, Grid, IconButton, Input, ModalClose, Textarea,
    Typography
} from "@mui/joy";
import {useCallback, useEffect, useRef, useState} from "react";
import {client_height, client_width} from "@/assets/lib/utils/client_size.js";
import {post_img} from "@/assets/lib/api/api.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectLoginState} from "@/assets/lib/data/reducer/login_state_slice.js";
import ReactQuill from 'react-quill-new';
import "react-quill-new/dist/quill.snow.css";
import "@/assets/css/quill.css";
import PerfectScrollbar from 'react-perfect-scrollbar';
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.min.css";
import {Close, ImageOutlined} from "@mui/icons-material";

export const Editor = () => {
    const modules = {
        toolbar: [
            "bold",
            "italic",
            "underline",
            "strike",
            {'script': 'super'},
            {'script': 'sub'},
            {header: 1},
            {header: 2},
            "blockquote",
            "code-block",
            "link",
            {list: "ordered"},
            {list: "bullet"},
            "image"
        ],
    };

    const toolBarItems = [
        {
            id: "bold",
            icon: "format_bold",
            color: "primary",
            func: () => handleToolBarClick("bold")
        },
        {
            id: "italic",
            icon: "format_italic",
            color: "primary",
            func: () => handleToolBarClick("italic")
        },
        {
            id: "underline",
            icon: "format_underlined",
            color: "primary",
            func: () => handleToolBarClick("underline")
        },
        {
            id: "strike",
            icon: "strikethrough_s",
            color: "primary",
            func: () => handleToolBarClick("strike")
        },
        {
            id: "script#super",
            icon: "superscript",
            color: "primary",
            func: () => handleToolBarClick("script", "super")
        },
        {
            id: "script#sub",
            icon: "subscript",
            color: "primary",
            func: () => handleToolBarClick("script", "sub")
        },
        {
            id: "header#1",
            icon: "format_h1",
            color: "primary",
            func: () => handleToolBarClick("header", 1)
        },
        {
            id: "header#2",
            icon: "format_h2",
            color: "primary",
            func: () => handleToolBarClick("header", 2)
        },
        {
            id: "blockquote",
            icon: "format_quote",
            color: "primary",
            func: () => handleToolBarClick("blockquote")
        },
        {
            id: "code-block",
            icon: "code",
            color: "primary",
            func: () => handleToolBarClick("code-block")
        },
        {
            id: "link",
            icon: "link",
            color: "primary",
            func: () => handleToolBarClick("link")
        },
        {
            id: "list#ordered",
            icon: "format_list_numbered",
            color: "primary",
            func: () => handleToolBarClick("list", "ordered")
        },
        {
            id: "list#bullet",
            icon: "format_list_bulleted",
            color: "primary",
            func: () => handleToolBarClick("list", "bullet")
        },
        {
            id: "image",
            icon: "imagesmode",
            color: "primary",
            func: () => handleToolBarClick("image")
        }
    ]

    const params = useParams();
    const [mounted, setMounted] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(countWidth());
    const [height, setHeight] = useState(countHeight());
    const [checking, setChecking] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [isModify, setIsModify] = useState(false);
    const blogId = useRef(params.id);
    const location = useLocation();
    const navigate = useNavigate();
    const loginState = useSelector(selectLoginState);
    const editorRef = useRef(null);
    const [description, setDescription] = useState("");
    const coverInputRef = useRef(null);
    const [coverImage, setCoverImage] = useState(null);

    useEffect(() => {
        if (location.pathname.split("/")[1] === "writeblog") {
            if (loginState) {
                blogId.current = params.id;
                if (blogId.current === undefined || blogId.current === null) {
                    setIsModify(false);
                } else {
                    setIsModify(true);
                }
            } else {
                navigate("/login", {replace: true});
            }
        }
    }, []);

    useEffect(() => {
        let editor = editorRef?.current?.getEditor();
        if (editor) {
            let length = editor.getLength() - 1;
            setLength(length);
            if (length <= 0) {
                setDisabled(true);
            } else {
                setDisabled(false);
            }
            toolBarItems.forEach(item => {
                let id = item.id;
                let isActive = buttonIsActive(id.split("#")[0], id.split("#")[1]);
                triggerHighlight(id, isActive);
            });

        }
    }, [text]);

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
            window.removeEventListener('resize', onResize);
            window.addEventListener('resize', onResize);
            setEditorHeight();
        }
    }, []);

    useEffect(() => {
        setEditorHeight();
    }, [width, height]);

    useEffect(() => {
        if (open) {
            // setSaveOpsMenuWidth();
        }
    }, [open]);

    const onResize = useCallback(() => {
        setWidth(countWidth());
        setHeight(countHeight());
    }, []);

    function countWidth() {
        // let num = client_width() / 3 * 2;
        let num = client_width();
        if (num < 772) {
            return 772;
        }
        return num;
    }

    function countHeight() {
        // return width / 16 * 9;
        return client_height() - 96;
    }

    function setEditorHeight() {
        let dom = document.querySelector(".ql-editor");
        if (dom) {
            dom.style.minHeight = `calc(${height}px - 153px)`;
        } else {
            window.removeEventListener('resize', onResize);
        }
    }

    function handleTitleChange(e) {
        if (title.length < 40) {
            setTitle(e.target.value);
        }
    }

    function cleanTitle() {
        setTitle("");
    }

    function handleToolBarClick(button, value) {
        let btn;
        if (value === undefined) {
            btn = document.querySelector(`.ql-${button}`);
        } else {
            btn = document.querySelector(`.ql-${button}[value='${value}']`);
        }
        btn.click();
        let isActive = buttonIsActive(button, value);
        triggerHighlight(button, isActive);
    }

    function buttonIsActive(button, value) {
        let btn;
        let dom;
        if (value === undefined) {
            btn = document.querySelector(`.ql-${button}`);
            dom = document.getElementById(button);
        } else {
            btn = document.querySelector(`.ql-${button}[value='${value}']`);
            dom = document.getElementById(button + "#" + value);
        }
        let isActive = btn.classList.contains("ql-active");
        dom.style.backgroundColor = isActive ?
            "var(--variant-softHoverBg, var(--joy-palette-primary-softHoverBg, var(--joy-palette-primary-200, #C7DFF7)))" :
            "";
        return isActive;
    }

    function triggerHighlight(button, isActive) {
        if (button === "code-block") {
            if (!isActive) {
                handleHighlight();
            }
        }
    }

    function handleHighlight() {
        document.querySelector(".ql-editor").querySelectorAll("pre").forEach(el => {
            new Promise(() => {
                hljs.highlightElement(el);
                el.removeAttribute("data-highlighted");
            }).catch(() => null);
        });
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

    function handleDescriptionChange(e) {
        let value = e.target.value;
        if (value.length <= 1000)
            setDescription(value);
    }

    function handleSelectCover() {
        coverInputRef.current.click();
    }

    function handleCoverImageChange(e) {
        let target = e.target;
        let files = target.files;
        if (files.length) {
            let file = files[0];
            let fileReader = new FileReader();
            fileReader.onload = () => {
                setCoverImage(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    }

    function handleCleanCoverImage(e) {
        e.stopPropagation();
        setCoverImage(null);
    }

    return (
        <div className={'ml-5 mr-5'} style={{
            width: `${width}px`
        }}>
            <Grid container spacing={2} columns={4} sx={{
                flexGrow: 1,
                minHeight: `${height}px`,
                maxHeight: `${height}px`,
            }}>
                <Grid xs={1}>
                    <Card color={"primary"} variant={"outlined"} sx={{
                        minHeight: "100%",
                        boxShadow: "lg",
                    }}>
                        <CardOverflow>
                            <Input
                                className={'mt-5'}
                                slots={{root: Input}}
                                slotProps={{
                                    root: {
                                        maxLength: 40,
                                        endDecorator: <div className={'flex justify-end items-center gap-2'}>
                                            {
                                                title !== "" &&
                                                <IconButton
                                                    tabIndex={-1}
                                                    onClick={cleanTitle}
                                                    sx={{
                                                        background: "transparent",
                                                        "&:hover": {
                                                            background: "transparent",
                                                        }
                                                    }}
                                                >
                                                    <Close/>
                                                </IconButton>
                                            }
                                            <Typography color={'primary'} variant={"plain"} level={"body-sm"}>
                                                {`${title.length}/40`}
                                            </Typography>
                                        </div>,
                                        onChange: (e) => handleTitleChange(e),
                                        onInput: (e) => handleTitleChange(e),
                                        value: title,
                                        color: "primary",
                                        variant: "outlined",
                                        size: "md",
                                        placeholder: "Type your title...",
                                        sx: {
                                            '--Input-focusedThickness': '0',
                                        }
                                    }
                                }}>
                            </Input>
                        </CardOverflow>
                        <Divider inset="none"/>
                        <CardContent>
                            <Typography level={"title-sm"}>
                                Description
                            </Typography>
                            <Card color={"primary"} variant={"outlined"} className={'overflow-hidden'} sx={{
                                padding: 1,
                            }}>
                                <PerfectScrollbar options={{suppressScrollX: true, useBothWheelAxes: false}}>
                                    <Box
                                        minHeight={80}
                                        maxHeight={80}>
                                        <Textarea
                                            maxLength={1000}
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            onInput={handleDescriptionChange}
                                            color="primary"
                                            variant={"plain"}
                                            disabled={false}
                                            minRows={3}
                                            placeholder="Type description..."
                                            size="sm"
                                            sx={{
                                                '&::before': {
                                                    border: 'none',
                                                    left: '2.5px',
                                                    right: '2.5px',
                                                    bottom: 0,
                                                    top: 'unset',
                                                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                                    borderRadius: 0,
                                                    borderBottomLeftRadius: '64px 20px',
                                                    borderBottomRightRadius: '64px 20px',
                                                },
                                            }}
                                        />
                                    </Box>
                                </PerfectScrollbar>
                                <Typography
                                    level="body-xs"
                                    color={"primary"}
                                    variant={"plain"}
                                    sx={{ml: 'auto'}}>
                                    {description.length}/1000
                                </Typography>
                            </Card>

                            <Typography level={"title-sm"}>
                                Cover
                            </Typography>
                            <AspectRatio onClick={handleSelectCover} className={'cursor-pointer'}>
                                <Card
                                    color="primary"
                                    variant="outlined"
                                    size="sm"
                                >
                                    <CardCover>
                                        {coverImage === null ?
                                            <Box display="flex"
                                                 gap={2}
                                                 justifyContent="center"
                                                 alignItems="center">
                                                <ImageOutlined/>
                                                <Typography
                                                    color={"primary"}
                                                    variant={"plain"}
                                                    level={"body-sm"}>
                                                    Select your cover
                                                </Typography>
                                            </Box> :
                                            <Box sx={{
                                                overflow: "hidden"
                                            }}>
                                                <ModalClose
                                                    onClick={handleCleanCoverImage}
                                                    color={"danger"} variant={"solid"}/>
                                                <img src={coverImage} loading={"lazy"} alt=""/>
                                            </Box>

                                        }
                                    </CardCover>
                                </Card>
                                <input
                                    onChange={handleCoverImageChange}
                                    ref={coverInputRef}
                                    hidden
                                    type={"file"}
                                    accept={"image/*"}/>
                            </AspectRatio>
                        </CardContent>
                        <CardActions>
                            {isModify ?
                                <Button loading={checking} className={'capitalize'} disabled={disabled} tabIndex={-1}
                                        size={'sm'}
                                        variant={'soft'}
                                        color={'primary'}>
                                    post
                                </Button> :
                                <div className={'w-full flex justify-end items-center gap-5'}>
                                    <Button loading={checking} className={'capitalize'} disabled={disabled}
                                            tabIndex={-1}
                                            size={'sm'}
                                            variant={'soft'}
                                            color={'primary'}>
                                        post
                                    </Button>
                                    <Button loading={checking} className={'capitalize'} disabled={disabled}
                                            tabIndex={-1}
                                            size={'sm'}
                                            variant={'soft'}
                                            color={'primary'}>
                                        save as draft
                                    </Button>
                                </div>
                            }
                        </CardActions>
                    </Card>
                </Grid>
                <Grid xs={3}>
                    <Card color={"primary"} variant={"outlined"} sx={{
                        minHeight: "100%",
                        boxShadow: "lg",
                    }}>
                        <CardContent sx={{
                            padding: "0",
                        }}>
                            <Grid container
                                  rowSpacing={1}
                                  direction="column"
                                  justifyContent="flex-start"
                                  alignItems="stretch"
                                  sx={{flexGrow: 1}}>
                                <Grid xs>
                                    <Card size="sm" color={"primary"} variant={"plain"} sx={{
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        paddingTop: 1,
                                        paddingBottom: 1,
                                    }}>
                                        <ButtonGroup
                                            size="sm"
                                            color="primary"
                                            orientation="horizontal"
                                            variant="outlined"
                                        >
                                            {toolBarItems.map((item, index) => (
                                                <IconButton tabIndex={-1} id={item.id} size="sm" key={index}
                                                            variant={"soft"}
                                                            onClick={item.func} sx={{
                                                    paddingLeft: 2.5,
                                                    paddingRight: 2.5,
                                                }}>
                                                    <span className="material-symbols-outlined">{item.icon}</span>
                                                </IconButton>
                                            ))}
                                        </ButtonGroup>
                                    </Card>
                                </Grid>
                                <Grid xs>
                                    <Card size="sm" color={"primary"} variant={"outlined"}
                                          sx={{
                                              padding: 1,
                                              minHeight: `calc(${height}px - 135px)`,
                                              height: "100%",
                                              maxHeight: `calc(${height}px - 135px)`,
                                              cursor: "text"
                                          }}>
                                        <PerfectScrollbar>
                                            <ReactQuill
                                                style={{
                                                    minHeight: `calc(${height}px - 153px)`,
                                                }}
                                                ref={editorRef}
                                                placeholder={"Type here..."}
                                                preserveWhitespace
                                                defaultValue={text}
                                                onChange={setText}
                                                modules={modules}
                                                onBlur={handleHighlight}
                                            />
                                        </PerfectScrollbar>
                                    </Card>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions className={'flex justify-end items-end mt-[-20px]'}>
                            <Typography className={'select-none'} level={"body-xs"} color="primary"
                                        variant={"plain"}>{`${length}  character(s)`}</Typography>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}