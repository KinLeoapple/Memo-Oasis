import {Grid, Stack} from "@mui/joy";
import {useMemo} from "react";
import {NavBar} from "@/components/common/NavBar.jsx";

export const Layout = ({
                           left = <></>,
                           right = <></>,
                           content = <></>
                       }) => {

    const navBar = useMemo(() => {
        return <NavBar/>;
    }, []);

    return (
        <>
            <Stack className={`min-h-full`}>
                {navBar}
                <Grid className={`min-h-full`} container spacing={0} columns={4} sx={{flexGrow: 1}}>
                    <Grid xs={0.8} className={`flex flex-col gap-5 ml-10`}>
                        {left}
                    </Grid>
                    <Grid xs={2} className={`ml-5 mr-5`}>
                        {content}
                    </Grid>
                    <Grid xs={0.8}>
                        {right}
                    </Grid>
                </Grid>
            </Stack>
        </>
    )
}