import {Avatar, Card, Chip, Skeleton, Typography, useColorScheme} from "@mui/joy";
import avatarWhite from "@/assets/img/megalobox-white.webp";
import avatarBlack from "@/assets/img/megalobox.webp";
import {useState} from "react";

export const ProfileCard = ({
                                name = "",
                                quote = "",
                                quoteName = ""
                            }) => {
    const themeMode = useColorScheme();
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className={`flex flex-col gap-4`}>
                <div className={`w-full flex flex-row justify-start content-center gap-5`}>
                    <Avatar
                        color="neutral"
                        size="lg"
                        variant="plain"
                        src={`${loading ? '' : `${themeMode.colorScheme === "dark" ? avatarWhite : avatarBlack}`}`}
                        sx={{
                            width: '4rem',
                            height: '4rem'
                        }}
                    >
                        <Skeleton loading={loading}/>
                        {(name !== null && name !== "") && name.charAt(0).toUpperCase()}
                    </Avatar>
                    {(name !== null && name !== "") &&
                        <Typography className={`flex justify-center content-center`} level="title-lg">
                            <span className={`text-xl font-bold`}>
                                {name.charAt(0).toUpperCase()}
                            </span>
                            <span className={`text-xs font-bold`}>
                                {name.substring(1, name.length).toUpperCase()}
                            </span>
                        </Typography>}
                </div>
                <div className={`w-full flex flex-row justify-start content-center gap-1`}>
                    <Chip
                        color="success"
                        variant="soft"
                        size="sm"
                    >
                        <span className={'font-bold'}>GAMER</span>
                    </Chip>
                    <Chip
                        color="primary"
                        variant="soft"
                        size="sm"
                    >
                        <span className={'font-bold'}>DEVELOPER</span>
                    </Chip>
                </div>
                {(quote !== null && quote !== "") && <Card sx={{
                    boxShadow: 'lg',
                }}
                                                           color="neutral" variant="soft">
                    <Typography level="title-md" color="neutral">
                        <span className={`font-bold block`}>
                            {quote}
                        </span>
                        {quoteName !== null && <span>
                            <i> - {quoteName} </i>
                        </span>}
                    </Typography>
                </Card>}
            </div>
        </>
    )
}