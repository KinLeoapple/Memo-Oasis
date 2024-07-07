import {Divider, ListItemDecorator, Menu, MenuItem} from "@mui/joy";
import {AccountCircle, Logout} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {setLoginStateValue} from "@/assets/js/data/reducer/login_state_slice.js";
import {setUserBasicInfoValue} from "@/assets/js/data/reducer/user_basic_info_slice.js";

export const AvatarMenu = () => {
    const dispatch = useDispatch();

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

    function colorCssVar(name) {
        switch (name) {
            case "primary":
                return "var(--variant-plainColor, var(--joy-palette-primary-plainColor, var(--joy-palette-primary-500, #0B6BCB)))";
            case "danger":
                return "var(--variant-plainColor, var(--joy-palette-danger-plainColor, var(--joy-palette-danger-500, #C41C1C)))";
        }
    }

    function signOut() {
        localStorage.removeItem("token");
        dispatch(setLoginStateValue(false));
        dispatch(setUserBasicInfoValue({
            id: null,
            name: null,
            quote: null,
            quoteName: null
        }));
    }

    return (
        <>
            <Menu
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
                            <MenuItem onClick={item.func} className={'pl-2 pr-2'} sx={{
                                borderRadius: 6,
                                marginTop: "3px",
                                marginLeft: "5px",
                                marginRight: "5px",
                                marginBottom: "4px",
                            }}>
                                <ListItemDecorator variant="plain" sx={{
                                    color: colorCssVar(item.color)
                                }}>
                                    {item.decorator}
                                </ListItemDecorator>
                                <span className={'text-sm font-bold capitalize'} style={{
                                    color: colorCssVar(item.color)
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
        </>
    )
}