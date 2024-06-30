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
    Link, IconButton
} from "@mui/joy";
import {AccountCircle, Lock, NorthEast, Visibility, VisibilityOff} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {post_login} from "@/assets/js/api/api.js";
import {useSelector} from "react-redux";
import {selectLoginState} from "@/assets/js/data/reducer/login_state_slice.js";

export const LoginCard = () => {
    const navigate = useNavigate();

    const [visibility, setVisibility] = useState(false);
    const [checking, setChecking] = useState(false);

    const [name, setName] = useState("");
    const [pass, setPass] = useState("");

    const isLogin = useSelector(selectLoginState);

    useEffect(() => {
        if (isLogin) {
            navigate("/", {replace: true});
        }
    }, [isLogin, navigate]);


    function changeVisibility() {
        setVisibility(!visibility);
    }

    function changeName(e) {
        setName(e.target.value);
    }

    function changePass(e) {
        setPass(e.target.value);
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
                    navigate("/", {replace: true});
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
                            <Input onChange={changeName} startDecorator={
                                <Chip variant="outlined" startDecorator={<AccountCircle/>}
                                      style={{
                                          cursor: "default"
                                      }}
                                >username</Chip>
                            }
                                   color="primary" variant="soft"
                                   className={'w-11/12'}
                                   maxLength={20}
                                   size="md" sx={{
                                '--Input-focusedThickness': '0',
                            }}/>
                        </FormControl>
                        <FormControl className={'flex justify-center items-center'}>
                            <Input onChange={changePass} startDecorator={
                                <Chip variant="outlined" startDecorator={<Lock/>}
                                      style={{
                                          cursor: "default",
                                      }}
                                >password</Chip>
                            }
                                   endDecorator={
                                       <IconButton
                                           onClick={changeVisibility}
                                       >{
                                           visibility ?
                                               <Visibility/> : <VisibilityOff/>}
                                       </IconButton>
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
                    <Button loading={checking} variant="solid" color="primary" className={'capitalize'}
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
                                aria-labelledby="heading-demo"
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
        </div>
    )
}