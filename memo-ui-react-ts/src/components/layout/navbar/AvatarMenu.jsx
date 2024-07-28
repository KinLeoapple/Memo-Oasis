import {Divider, ListItem, ListItemDecorator, Menu, useColorScheme} from "@mui/joy";
import {AccountCircle, Logout} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {setLoginStateValue} from "@/assets/lib/data/reducer/login_state_slice.js";
import {setUserBasicInfoValue} from "@/assets/lib/data/reducer/user_basic_info_slice.js";
import {useNavigate} from "react-router-dom";
import {color_css_var} from "@/assets/lib/utils/color_css_var.js";
import {MENU_ITEM, MENU_ITEM_DARK} from "@/assets/lib/data/static.js";
import {cloneElement} from "react";

export const AvatarMenu = ({
                               onMouseEnter,
                               onMouseLeave
                           }) => {
    const themeMode = useColorScheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const menuItems = [
        {
            decorator: <AccountCircle/>,
            text: "profile",
            color: "primary",
            func: null
        },
        {
            decorator: <Logout/>,
            text: "sign out",
            color: "danger",
            func: signOut
        },
    ]

    function signOut() {
        localStorage.removeItem("token");
        dispatch(setLoginStateValue(false));
        dispatch(setUserBasicInfoValue({
            id: null,
            name: null,
            quote: null,
            quoteName: null
        }));
        navigate("/", {replace: true});
    }

    return (
        <>
            <Menu
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                variant="soft"
                color="primary"
                placement="bottom-start"
                className={'select-none'}
                sx={{
                    boxShadow: "lg",
                    padding: 0
                }}>
                {
                    menuItems.map((item, index) => (
                        <div key={index}>
                            <ListItem tabIndex={-1} onClick={item.func} className={'pl-2 pr-2 cursor-pointer'} sx={{
                                borderRadius: 6,
                                marginTop: "3px",
                                marginLeft: "5px",
                                marginRight: "5px",
                                marginBottom: "4px",
                                "&:hover": {
                                    backgroundColor: themeMode.mode === 'dark' ? MENU_ITEM_DARK : MENU_ITEM,
                                }
                            }}>
                                <ListItemDecorator variant="plain">
                                    {cloneElement(item.decorator, {
                                        sx: {
                                            color: color_css_var(item.color)
                                        }
                                    })}
                                </ListItemDecorator>
                                <span className={'text-sm font-bold capitalize'} style={{
                                    color: color_css_var(item.color)
                                }}>
                                    {item.text}
                                </span>
                            </ListItem>
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
        </>
    )
}