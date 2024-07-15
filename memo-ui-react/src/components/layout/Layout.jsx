import {Grid, Stack} from "@mui/joy";
import {useCallback, useEffect, useMemo, useState} from "react";
import {NavBar} from "@/components/layout/navbar/NavBar.jsx";
import {ToTopButton} from "@/components/button/ToTopButton.jsx";
import {scroll_distance_to_top} from "@/assets/js/utils/distance_to_top.js";
import {Loader} from "@/components/layout/Loader.jsx";
import {MAX_RENDER_PENDING} from "@/assets/js/data/static.js";

export const Layout = ({
                           // eslint-disable-next-line react/prop-types
                           left = {el: <></>, fixed: false,},
                           // eslint-disable-next-line react/prop-types
                           right = {el: <></>, fixed: false},
                           // eslint-disable-next-line react/prop-types
                           content = {el: <></>},
                           // eslint-disable-next-line react/prop-types
                           center = {el: <></>, show: false, fixed: false},
                           // eslint-disable-next-line react/prop-types
                           leftMargin = true,
                           // eslint-disable-next-line react/prop-types
                           rightMargin = true,
                           // eslint-disable-next-line react/prop-types
                           navigate = true
                       }) => {
    const marginLeft = leftMargin === undefined ? true : leftMargin;
    const marginRight = rightMargin === undefined ? true : rightMargin;
    const [mounted, setMounted] = useState(false);
    const [display, setDisplay] = useState(false);
    const [renderPending, setRenderPending] = useState(true);

    const navBar = useMemo(() => {
        return <NavBar renderPending={handleRenderPending}/>;
    }, []);

    useEffect(() => {
        pendingTimeout();
    }, []);

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
            window.removeEventListener("scroll", displayToTopButton);
            window.addEventListener("scroll", displayToTopButton);
        }
    }, []);

    const displayToTopButton = useCallback(() => {
        scroll_distance_to_top() > 100 ? setDisplay(true) : setDisplay(false);
    }, []);

    function handleRenderPending(value) {
        setRenderPending(value);
    }

    function pendingTimeout() {
        setTimeout(() => {
            if (renderPending) {
                setRenderPending(false);
            }
        }, MAX_RENDER_PENDING * 1000);
    }

    return (
        <>
            <Stack className={`min-h-full min-w-full`}>
                {navigate &&
                    navBar
                }
                {!renderPending &&
                    <Grid className={`min-h-full min-w-full flex justify-between gap-1`} container spacing={0}
                          columns={4}
                          sx={{flexGrow: 1}}>
                        <Grid xs={0.8} className={`flex flex-col gap-5 ${marginLeft ? 'ml-5' : ''}`}>
                            <div className={`${left.fixed ? 'fixed w-[20%]' : ''}
                        h-[100%] flex-shrink-0`}>
                                {left.el}
                            </div>
                        </Grid>
                        <Grid xs={2}>
                            <div className={`min-h-full flex-shrink-0`}>
                                {content.el}
                            </div>
                        </Grid>
                        <Grid xs={0.8} className={`flex flex-col gap-5 ${marginRight ? 'mr-5' : ''}`}>
                            <div className={`${right.fixed ? 'fixed w-[20%]' : ''}
                        h-[100%] flex-shrink-0`}>
                                {right.el}
                            </div>
                        </Grid>
                    </Grid>
                }
                <div className={display ? '' : 'hidden'}>
                    <ToTopButton/>
                </div>
            </Stack>
            {center.show &&
                <>{!renderPending &&
                    <div className={`${center.fixed ? 'fixed' : ''} inset-0 flex items-center justify-center`}>
                        {center.el}
                    </div>
                }</>
            }
            {renderPending &&
                <Loader/>
            }
        </>
    )
}