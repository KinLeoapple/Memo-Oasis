import {Button, Input, Stack, useColorScheme} from "@mui/joy";
import {SwitchThemeButton} from "@/components/button/SwitchThemeButton.jsx";
import {Link, useLocation} from "react-router-dom";
import Search from '@mui/icons-material/Search';

export const NavBar = () => {
    const navButtons = [{
        name: "Home",
        path: "/"
    },
        {
            name: "Admin",
            path: "/admin"
        }];
    let themeMode = useColorScheme();
    let location = useLocation();

    return (
        <div className={'w-full h-24 z-[999]'}>
            <Stack direction="row" className={`w-full fixed flex flex-col justify-between items-center gap-5 p-5 mb-3 
            bg-opacity-80 ${themeMode.colorScheme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
                <Input startDecorator={
                    <Search/>
                }
                       color="primary" variant="soft"
                       size="md" placeholder="Search" sx={{
                    '--Input-focusedThickness': '0',
                }}
                />
                <div className={'flex flex-row items-center gap-2'}>
                    <div className={'flex flex-row gap-2'}>
                        {navButtons.map((btn) => (
                            <Link key={btn.name} to={btn.path} replace={true}>
                                <Button variant={location.pathname === btn.path ? "soft" : "plain"}>
                                    {btn.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                    <SwitchThemeButton/>
                </div>
            </Stack>
        </div>
    )
}