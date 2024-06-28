import {Avatar, Card, Chip, Divider, Skeleton, Typography, useColorScheme} from "@mui/joy";
import avatarWhite from "@/assets/img/megalobox-white.webp";
import avatarBlack from "@/assets/img/megalobox.webp";
import {useState} from "react";

export const ProfileCard = ({
                                name = "",
                                quote = "",
                                quoteName = ""
                            }) => {
    const themeMode = useColorScheme();
    const tags = ["gamer", "developer"];
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
                    {tags.map((tag) => (<Chip
                        key={tag}
                        color="primary"
                        variant="soft"
                        size="sm"
                        sx={{
                            borderRadius: '2px',
                            fontSize: '0.55rem'
                        }}
                    >
                        <span className={'font-bold'}>{tag.toUpperCase()}</span>
                    </Chip>))}
                </div>
                {(quote !== null && quote !== "") && <Card
                    color="primary" variant="soft" sx={{
                    boxShadow: 'lg',
                }}
                >
                    <Typography level="title-md" color="neutral">
                        <span className={`font-bold block`}>
                            {quote}
                        </span>
                        {quoteName !== null && <span>
                            <i> - {quoteName} </i>
                        </span>}
                    </Typography>
                </Card>}
                <Divider />
            </div>
        </>
    )
}