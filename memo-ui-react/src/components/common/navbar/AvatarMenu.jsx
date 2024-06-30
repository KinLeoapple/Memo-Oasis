import {Divider, ListItemDecorator, Menu, MenuItem} from "@mui/joy";
import {Login, PersonAdd} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export const AvatarMenu = ({
                               // eslint-disable-next-line react/prop-types
                               isLogin = false
                           }) => {
    const navigate = useNavigate();

    const notLoginMenuItem = [
        {
            decorator: <Login/>,
            text: "sign in",
            func: login
        },
        {
            decorator: <PersonAdd/>,
            text: "sign up",
            func: signUp
        }
    ];

    function login() {
        navigate("/login", {replace: true});
    }

    function signUp() {
        navigate("/signup", {replace: true});
    }

    return (
        <>
            <Menu
                variant="soft"
                color="primary"
                placement="bottom-start"
                sx={{
                    boxShadow: "lg"
                }}>
                {isLogin ?
                    <>

                    </> :
                    <>
                        {
                            notLoginMenuItem.map((item, index) => (
                                <div key={index}>
                                    <MenuItem onClick={item.func} className={'pl-2 pr-2'}>
                                        <ListItemDecorator>
                                            {item.decorator}
                                        </ListItemDecorator>
                                        <span className={'text-sm font-bold capitalize'}>
                                            {item.text}
                                        </span>
                                    </MenuItem>
                                    {
                                        index !== notLoginMenuItem.length - 1 &&
                                        <Divider/>
                                    }
                                </div>
                            ))
                        }
                    </>
                }
            </Menu>
        </>
    )
}