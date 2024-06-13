import {ProfileCard} from "@/components/home/ProfileCard.jsx";
import {useEffect, useState} from "react";
import {basic_info} from "@/assets/js/api.js";
import {Divider, Grid, Stack} from "@mui/joy";
import {CategoriesList} from "@/components/home/CategoriesList.jsx";
import {NavBar} from "@/components/common/NavBar.jsx";

export const Home = () => {
    // Basic Information
    const [name, setName] = useState(null);
    const [quote, setQuote] = useState(null);
    const [quoteName, setQuoteName] = useState(null);

    useEffect(() => {
        basic_info().then(r => {
            setName(r.name);
            setQuote(r.quote);
            setQuoteName(r.quote_name);
        });
    });

    return (
        <>
            <Stack>
                <NavBar/>
                <Grid container spacing={0} columns={4} sx={{flexGrow: 1}}>
                    <Grid xs={0.8} className={`flex flex-col gap-5 ml-10`}>
                        <ProfileCard name={name} quote={quote} quoteName={quoteName}/>
                        <Divider/>
                        <CategoriesList/>
                    </Grid>
                    <Grid xs={2}>

                    </Grid>
                    <Grid xs={0.8}>

                    </Grid>
                </Grid>
            </Stack>
        </>
    )
}