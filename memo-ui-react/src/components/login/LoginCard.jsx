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
import {useState} from "react";

export const LoginCard = () => {
    const [visibility, setVisibility] = useState(false);
    const navigate = useNavigate();

    function changeVisibility() {
        setVisibility(!visibility);
    }

    function toSignUp() {
        navigate("/signup", {replace: true});
    }

    function login() {

    }

    return (
        <div className={'flex flex-col gap-2'}>
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
                            <Input startDecorator={
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
                            <Input startDecorator={
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
                    <Button variant="solid" color="primary" className={'capitalize'}
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