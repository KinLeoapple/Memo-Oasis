import {
    Button,
    Card,
    CardActions,
    CardContent, CardOverflow, Divider,
    Dropdown, IconButton, Input,
    ListItemDecorator,
    Menu,
    MenuButton, MenuItem,
    Typography,
    useColorScheme
} from "@mui/joy";
import {MdEditor} from "md-editor-rt";
import {useCallback, useEffect, useRef, useState} from "react";
import 'md-editor-rt/lib/style.css';
import "@/assets/css/editor.css";
import {client_width} from "@/assets/js/utils/client_size.js";
import {sanitize} from "@/assets/js/utils/sanitize.js";
import {post_img} from "@/assets/js/api/api.js";
import {ArrowDropDown, Book, Close, ModeEditOutline} from "@mui/icons-material";
import {color_css_var} from "@/assets/js/utils/color_css_var.js";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectLoginState} from "@/assets/js/data/reducer/login_state_slice.js";

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

    const menuItems = [
        {
            decorator: <Book/>,
            text: "blog",
            color: "primary",
            func: null
        },
        {
            decorator: <ModeEditOutline/>,
            text: "draft",
            color: "primary",
            func: null
        },
    ]

    const params = useParams();
    const themeMode = useColorScheme();
    const [mounted, setMounted] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [width, setWidth] = useState(countWidth());
    const [height, setHeight] = useState(countHeight());
    const [checking, setChecking] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [isModify, setIsModify] = useState(false);
    const blogId = useRef(params.id);
    const location = useLocation();
    const navigate = useNavigate();
    const loginState = useSelector(selectLoginState);

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
        if (text.length <= 0) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [text]);

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
        let num = client_width() / 3 * 2;
        if (num < 772) {
            return 772;
        }
        return num;
    }

    function countHeight() {
        return width / 16 * 9;
    }

    function handleTitleChange(e) {
        if (title.length < 40) {
            setTitle(e.target.value);
        }
    }

    function cleanTitle() {
        setTitle("");
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
        <div style={{
            width: `${width}px`,
            height: `${height}px`
        }}>
            <Card color={"primary"} variant={"outlined"} className={'overflow-hidden'} sx={{
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
                <CardContent sx={{
                    padding: "0",
                }}>
                    <MdEditor
                        style={{
                            minWidth: "100%",
                            minHeight: "100%"
                        }}
                        placeholder={"Type your markdown..."}
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
                <CardActions className={'flex justify-between items-end mt-[-20px]'} style={{
                    padding: "0",
                }}>
                    <Typography className={'select-none'} level={"body-xs"} color="primary"
                                variant={"plain"}>{`${text.length}  character(s)`}</Typography>
                    {isModify ?
                        <Button loading={checking} className={'capitalize'} disabled={disabled} tabIndex={-1}
                                size={'sm'}
                                variant={'soft'}
                                color={'primary'}>
                            save
                        </Button> :
                        <Dropdown>
                            <MenuButton startDecorator={
                                <ArrowDropDown/>
                            } disabled={disabled} className={'capitalize'} tabIndex={-1} slots={{root: Button}}
                                        slotProps={{
                                            root: {
                                                loading: checking,
                                                size: 'sm',
                                                variant: 'soft',
                                                color: 'primary',
                                            }
                                        }}>
                                save as
                            </MenuButton>
                            <Menu variant="soft"
                                  color="primary"
                                  placement="bottom"
                                  className={'select-none'}
                                  size="sm">
                                {menuItems.map((item, index) => (
                                    <div key={index}>
                                        <MenuItem
                                            onClick={item.func}
                                            tabIndex={-1}
                                            autoFocus={false}
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
                </CardActions>
            </Card>
        </div>
    )
}