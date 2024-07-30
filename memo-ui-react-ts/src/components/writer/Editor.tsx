import {
    Alert,
    AspectRatio,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CardCover,
    CardOverflow,
    Chip,
    Divider,
    Grid,
    IconButton,
    Input,
    ModalClose,
    Option,
    Select,
    SelectStaticProps,
    Textarea,
    Typography
} from "@mui/joy";
import {useCallback, useEffect, useRef, useState} from "react";
import {client_height, client_width} from "@/assets/lib/utils/client_size.js";
import {get_category, get_category_all} from "@/assets/lib/api/api.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginState} from "@/assets/lib/data/reducer/login_state_slice.js";
import ReactQuill from 'react-quill-new';
import "react-quill-new/dist/quill.snow.css";
import "@/assets/css/quill.css";
import PerfectScrollbar from 'react-perfect-scrollbar';
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.min.css";
import {Close, CloseRounded, ImageOutlined} from "@mui/icons-material";
import {CutImageModal} from "@/components/writer/CutImageModal.tsx";
import {setSelectedCoverImageValue} from "@/assets/lib/data/reducer/writer/selected_cover_image_slice";
import {selectCoverImage, setCoverImageValue} from "@/assets/lib/data/reducer/writer/cover_image_slice";
import {setCoverModalOpenValue} from "@/assets/lib/data/reducer/writer/cover_modal_open_slice";
import {elementPosition} from "@/assets/lib/utils/element_position.ts";
import {ClickAwayListener} from "@mui/base";

interface category {
    id: string | number,
    catName: string
}

interface categoryId {
    id: string | number,
}

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

    const dispatch = useDispatch();
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
    const toolTipRef = useRef<HTMLDivElement>(null);
    const [toolTipClickAway, setToolTipClickAway] = useState(true);
    const toolTipClickAwayRef = useRef(toolTipClickAway);
    const blogId = useRef(params.id);
    const location = useLocation();
    const navigate = useNavigate();
    const loginState = useSelector(selectLoginState);
    const editorRef = useRef<ReactQuill | null>(null);
    const [description, setDescription] = useState("");
    const coverInputRef = useRef<HTMLInputElement | null>(null);
    const coverImage = useSelector(selectCoverImage);
    const [categoryList, setCategoryList] = useState<category[]>([]);
    const [selection, setSelection] = useState<string | null>('dog');
    const selectionAction: SelectStaticProps['action'] = useRef(null);

    useEffect(() => {
        if (location.pathname.split("/")[1] === "writeblog") {
            if (loginState) {
                blogId.current = params.id;
                if (blogId.current === undefined || blogId.current === null) {
                    setIsModify(false);
                } else {
                    setIsModify(true);
                }
                getCategory();
                overrideToolTip();
            } else {
                navigate("/login", {replace: true});
            }
        }
    }, []);

    useEffect(() => {
        const editor = editorRef?.current?.getEditor();
        if (editor) {
            const length = editor.getLength() - 1;
            setLength(length);
            if (length <= 0) {
                setDisabled(true);
            } else {
                setDisabled(false);
            }
            toolBarItems.forEach(item => {
                const id = item.id;
                const isActive = buttonIsActive(id.split("#")[0], id.split("#")[1]);
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

    const onResize = useCallback(() => {
        setWidth(countWidth());
        setHeight(countHeight());
    }, []);

    function countWidth() {
        // let num = client_width() / 3 * 2;
        const num = client_width();
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
        const dom = document.querySelector(".ql-editor");
        if (dom) {
            (dom as HTMLElement).style.minHeight = `calc(${height}px - 153px)`;
        } else {
            window.removeEventListener('resize', onResize);
        }
    }

    function handleTitleChange(e: React.FormEvent<HTMLDivElement>) {
        if (title.length < 40) {
            const target = e.target;
            setTitle((target as HTMLInputElement).value);
        }
    }

    function cleanTitle() {
        setTitle("");
    }

    function handleToolBarClick(button: string, value?: string | number) {
        let btn;
        if (value === undefined) {
            btn = document.querySelector(`.ql-${button}`);
        } else {
            btn = document.querySelector(`.ql-${button}[value='${value}']`);
        }
        (btn as HTMLButtonElement)?.click();
        const isActive = buttonIsActive(button, value);
        triggerHighlight(button, isActive);
    }

    function buttonIsActive(button: string, value?: string | number): boolean {
        let btn;
        let dom;
        if (value === undefined) {
            btn = document.querySelector(`.ql-${button}`);
            dom = document.getElementById(button);
        } else {
            btn = document.querySelector(`.ql-${button}[value='${value}']`);
            dom = document.getElementById(button + "#" + value);
        }
        const isActive = btn!.classList.contains("ql-active");
        (dom as HTMLElement).style.backgroundColor = isActive ?
            "var(--variant-softHoverBg, var(--joy-palette-primary-softHoverBg, var(--joy-palette-primary-200, #C7DFF7)))" :
            "";
        return isActive;
    }

    function triggerHighlight(button: string, isActive: boolean) {
        if (button === "code-block") {
            if (!isActive) {
                handleHighlight();
            }
        }
    }

    function handleHighlight() {
        const dom = document.querySelector(".ql-editor");
        if (dom) {
            dom.querySelectorAll("pre").forEach(el => {
                new Promise(() => {
                    hljs.highlightElement(el);
                    el.removeAttribute("data-highlighted");
                }).catch(() => null);
            });
        }
    }

    const handleToolTipClickAway = () => {
        toolTipClickAwayRef.current = true;
        setToolTipClickAway(toolTipClickAwayRef.current);
    };

    const handleToolTipInputClick = () => {
        toolTipClickAwayRef.current = false;
        setToolTipClickAway(toolTipClickAwayRef.current);
    }

    function overrideToolTip() {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === "class") {
                    const target = mutation.target as HTMLElement;
                    const classList = target.classList;
                    if (classList.contains("ql-tooltip") && classList.contains("ql-editing")) {
                        const mode = target.getAttribute("data-mode");
                        if (mode === "link") {
                            const toolTip = toolTipRef.current;
                            if (toolTip) {
                                if (classList.contains("ql-hidden")) {
                                    console.log(toolTipClickAwayRef.current)
                                    if (toolTipClickAwayRef.current) {
                                        toolTip.style.zIndex = "-9999";
                                        toolTip.style.display = "none";
                                    }
                                } else {
                                    toolTipClickAwayRef.current = false;
                                    setToolTipClickAway(toolTipClickAwayRef.current);
                                    const position = elementPosition(target);
                                    toolTip.style.zIndex = "9999";
                                    toolTip.style.left = position.x + "px";
                                    toolTip.style.top = position.y + "px";
                                    toolTip.style.display = "block";
                                }
                            }
                        }
                    }
                }
            });
        });

        const dom = document.querySelector(".ql-tooltip");
        if (dom) {
            (dom as HTMLElement).style.visibility = "hidden";
            observer.observe(dom, {attributes: true});
        }
    }

    const uploadImg = async () => {
        // return new Promise(resolve => {
        //     post_img(localStorage.getItem("token"), file).then(r => {
        //         if (r.saved !== null && r.saved !== undefined) {
        //             resolve(r.saved);
        //         }
        //     });
        // });
    };

    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const target = e.target;
        const value = (target as HTMLTextAreaElement).value;
        if (value.length <= 500)
            setDescription(value);
    }

    function handleSelectCover() {
        if (coverImage || coverImage !== "") {
            dispatch(setCoverModalOpenValue(true));
        } else
            coverInputRef?.current?.click();
    }

    function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const files = target.files;
        if (files && files.length) {
            const file = files[files.length - 1];
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const result = fileReader.result;
                if (result) {
                    dispatch(setSelectedCoverImageValue(result as string));
                    target.value = "";
                }
            };
            fileReader.readAsDataURL(file);
        }
    }

    function handleCleanCoverImage(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        dispatch(setCoverImageValue(""));
    }

    const getCategory = () => {
        const catList: category[] = [];
        get_category_all().then(r => {
            if (r !== null) {
                if (r instanceof Object) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    Object.entries(r).forEach(([_, value]) => {
                        get_category((value as categoryId).id).then(c => {
                            catList.push(c as category);
                            setCategoryList(catList);
                        });
                    });
                }
            }
        });
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
                                        size: "sm",
                                        placeholder: "Type your title...",
                                        sx: {
                                            '--Input-focusedThickness': '0',
                                        }
                                    }
                                }}>
                            </Input>
                        </CardOverflow>
                        <Divider inset="none"/>
                        <CardContent sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            gap: 2
                        }}>
                            {/*Description*/}
                            <Box display="flex" flexDirection={"column"} gap={1}>
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
                                                value={description}
                                                onChange={handleDescriptionChange}
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
                                        {description.length}/500
                                    </Typography>
                                </Card>
                            </Box>
                            {/*Cover*/}
                            <Box display="flex" flexDirection={"column"} gap={1}>
                                <Typography level={"title-sm"}>
                                    Cover
                                </Typography>
                                <AspectRatio onClick={handleSelectCover}
                                             className={'cursor-pointer'}>
                                    <Card
                                        color="primary"
                                        variant="outlined"
                                        size="sm"
                                    >
                                        <CardCover>
                                            {!coverImage || coverImage === "" ?
                                                <Box display="flex"
                                                     gap={2}
                                                     justifyContent="center"
                                                     alignItems="center">
                                                    <ImageOutlined/>
                                                    <Typography
                                                        color={"primary"}
                                                        variant={"plain"}
                                                        level={"body-sm"}>
                                                        Select cover image
                                                    </Typography>
                                                </Box> :
                                                <Box sx={{
                                                    overflow: "hidden"
                                                }}>
                                                    <ModalClose
                                                        onClick={handleCleanCoverImage}
                                                        color={"danger"} variant={"solid"}/>
                                                    <img draggable={false} src={coverImage} alt=""/>
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
                                <CutImageModal/>
                            </Box>
                            {/*Category*/}
                            <Box display="flex" flexDirection={"column"} gap={1}>
                                <Typography level={"title-sm"}>
                                    Category
                                </Typography>
                                <Select
                                    action={selectionAction}
                                    size="sm"
                                    color={"primary"}
                                    variant={"outlined"}
                                    placeholder="Choose one category…"
                                    value={selection}
                                    onChange={(_e, newValue) => setSelection(newValue)}
                                    {...(selection && {
                                        endDecorator: (
                                            <IconButton
                                                variant="solid"
                                                color="danger"
                                                onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                onClick={() => {
                                                    setSelection(null);
                                                    selectionAction.current?.focusVisible();
                                                }}
                                                sx={{
                                                    maxWidth: "var(--IconButton-size, 2rem)",
                                                    maxHeight: "var(--IconButton-size, 2rem)"
                                                }}
                                            >
                                                <CloseRounded/>
                                            </IconButton>
                                        ),
                                        indicator: null,
                                    })}
                                    renderValue={(selected) => (
                                        <Box sx={{display: 'flex', gap: '0.25rem'}}>
                                            <Chip size="sm" variant="solid" color="primary">
                                                {selected?.label}
                                            </Chip>
                                        </Box>
                                    )}
                                    slotProps={{
                                        listbox: {
                                            sx: {
                                                padding: 0,
                                                boxShadow: "lg"
                                            }
                                        },
                                    }}>
                                    <PerfectScrollbar options={{suppressScrollX: true, useBothWheelAxes: false}}>
                                        <Box maxHeight={150}>
                                            {categoryList.map((cat, index) => (
                                                <Option key={index}
                                                        color={"primary"}
                                                        variant={"plain"}
                                                        tabIndex={-1}
                                                        value={cat.id}
                                                        label={cat.catName}>
                                                    {cat.catName}
                                                </Option>
                                            ))}
                                        </Box>
                                    </PerfectScrollbar>
                                </Select>
                            </Box>
                        </CardContent>
                        <CardActions>
                            {isModify ?
                                <Button loading={checking} className={'capitalize'} disabled={disabled} tabIndex={-1}
                                        size={'sm'}
                                        variant={'solid'}
                                        color={'primary'}>
                                    post
                                </Button> :
                                <div className={'w-full flex justify-end items-center gap-5'}>
                                    <Button loading={checking} className={'capitalize'} disabled={disabled}
                                            tabIndex={-1}
                                            size={'sm'}
                                            variant={'solid'}
                                            color={'primary'}>
                                        post
                                    </Button>
                                    <Button loading={checking} className={'capitalize'} disabled={disabled}
                                            tabIndex={-1}
                                            size={'sm'}
                                            variant={'solid'}
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
                                        <PerfectScrollbar options={{suppressScrollX: true, useBothWheelAxes: false}}>
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
            <ClickAwayListener onClickAway={handleToolTipClickAway}>
                <Box
                    onClick={handleToolTipInputClick}
                    ref={toolTipRef}
                    sx={{
                        position: "absolute",
                    }}
                >
                    <Input color="primary"
                           variant="outlined"
                           size="sm"
                           sx={{
                               '--Input-focusedThickness': '0',
                           }}/>
                </Box>
            </ClickAwayListener>
        </div>
    )
}