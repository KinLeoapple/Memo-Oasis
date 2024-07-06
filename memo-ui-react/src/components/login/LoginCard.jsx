import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardOverflow,
    Chip,
    FormControl,
    Input,
    Stack,
    Typography,
    Link, IconButton, Snackbar
} from "@mui/joy";
import {
    AccountCircle,
    Close,
    InfoOutlined,
    Lock,
    NorthEast,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {post_login} from "@/assets/js/api/api.js";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginState} from "@/assets/js/data/reducer/login_state_slice.js";
import {setUserBasicInfoValue} from "@/assets/js/data/reducer/user_basic_info_slice.js";

export const LoginCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [visibility, setVisibility] = useState(false);
    const [checking, setChecking] = useState(false);

    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const isLogin = useSelector(selectLoginState);

    useEffect(() => {
        if (isLogin) {
            navigate("/", {replace: true});
        }
    }, [isLogin, navigate]);

    useEffect(() => {
        snackbarOpen ? null : setErrorMsg("");
    }, [snackbarOpen]);

    function changeVisibility() {
        setVisibility(!visibility);
    }

    function changeName(e) {
        setName(e.target.value);
    }

    function cleanName() {
        setName("");
    }

    function changePass(e) {
        setPass(e.target.value);
    }

    function cleanPass() {
        setPass("");
    }


    function toSignUp() {
        navigate("/signup", {replace: true});
    }

    async function login() {
        setChecking(true);
        post_login(name, pass).then(r => {
            if (r !== null) {
                if (r.login !== null && r.login !== undefined) {
                    localStorage.setItem("token", r.login);
                    dispatch(setUserBasicInfoValue({
                        id: r.id
                    }));
                    navigate("/", {replace: true});
                } else {
                    setErrorMsg(r.msg);
                    setSnackbarOpen(true);
                }
            }
            setChecking(false);
        });
    }

    async function handleKeyBoardSubmit(e) {
        if (e.keyCode === 13) {
            await login();
        }
    }

    return (
        <div className={'flex flex-col gap-2'} onKeyDown={(e) => handleKeyBoardSubmit(e)}>
            <Card invertedColors variant="soft" color="primary"
                  sx={{
                      boxShadow: "lg"
                  }}
                  className={'w-96 h-80 select-none'}>
                <CardOverflow>
                    <Typography level={"h1"} className={'capitalize text-center'}
                                style={{
                                    marginTop: 10,
                                    textShadow: "0 0 8px var(--joy-palette-text-primary, var(--joy-palette-neutral-800, #171A1C))"
                                }}>sign in</Typography>
                </CardOverflow>
                <CardContent className={'mt-8'}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        spacing={6}>
                        <FormControl className={'flex justify-center items-center'}>
                            <Input onChange={changeName} value={name} startDecorator={
                                <Chip variant="outlined" startDecorator={<AccountCircle/>}
                                      style={{
                                          cursor: "default"
                                      }}
                                >username</Chip>
                            }
                                   endDecorator={
                                       name !== "" &&
                                       <IconButton
                                           tabIndex={-1}
                                           onClick={cleanName}
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
                                   color="primary" variant="soft"
                                   className={'w-11/12'}
                                   maxLength={20}
                                   size="md" sx={{
                                '--Input-focusedThickness': '0',
                            }}/>
                        </FormControl>
                        <FormControl className={'flex justify-center items-center'}>
                            <Input onChange={changePass} value={pass} startDecorator={
                                <Chip variant="outlined" startDecorator={<Lock/>}
                                      style={{
                                          cursor: "default",
                                      }}
                                >password</Chip>
                            }
                                   endDecorator={
                                       <div className={'flex gap-2'}>
                                           {
                                               pass !== "" &&
                                               <IconButton
                                                   tabIndex={-1}
                                                   onClick={cleanPass}
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
                                           <IconButton
                                               onClick={changeVisibility}
                                           >{
                                               visibility ?
                                                   <Visibility/> : <VisibilityOff/>}
                                           </IconButton>
                                       </div>
                                   }
                                   color="primary" variant="soft"
                                   className={'w-11/12'}
                                   type={visibility ? "text" : "password"}
                                   maxLength={20}
                                   size="md" sx={{
                                '--Input-focusedThickness': '0',
                            }}/>
                        </FormControl>
                    </Stack>
                </CardContent>
                <CardActions buttonFlex="0 1 200px" className={'flex justify-center items-center'}>
                    <Button tabIndex={-1} loading={checking} variant="solid" color="primary" className={'capitalize'}
                            onClick={login}>
                        sign in
                    </Button>
                </CardActions>
            </Card>
            <Card invertedColors variant="soft" color="primary"
                  sx={{
                      boxShadow: "lg"
                  }}>
                <CardContent className={'flex justify-center items-center'}>
                    <Typography
                        endDecorator={
                            <Link
                                variant="plain"
                                onClick={toSignUp}
                                fontSize="md"
                                borderRadius="sm"
                            >
                                Create an account
                                <NorthEast/>
                            </Link>
                        }>New to Here?</Typography>
                </CardContent>
            </Card>
            <Snackbar
                autoHideDuration={3000}
                color="danger"
                variant="solid"
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                startDecorator={<InfoOutlined/>}
                endDecorator={
                    <IconButton
                        onClick={() => setSnackbarOpen(false)}
                        variant="plain" sx={{
                        color: "inherit"
                    }}>
                        <Close style={{
                            color: "inherit"
                        }}/>
                    </IconButton>
                }
            >
                <Typography sx={{
                    color: "inherit"
                }}>
                    <Typography level={"body-sm"} sx={{
                        color: "inherit"
                    }}>{errorMsg}</Typography>
                </Typography>
            </Snackbar>
        </div>
    )
}