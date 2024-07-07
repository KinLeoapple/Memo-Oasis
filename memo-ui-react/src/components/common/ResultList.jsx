import {List, ListItem, ListItemButton, Typography} from "@mui/joy";
import {Inventory2} from "@mui/icons-material";

export const ResultList = ({
                               // eslint-disable-next-line react/prop-types
                               id = "",
                               // eslint-disable-next-line react/prop-types
                               list = [],
                               // eslint-disable-next-line react/prop-types
                               fn = null
                           }) => {
    return (
        <>
            <List
                className={`${list.length === 0 ? 'flex justify-center items-center' : ''}`}
                id={id}
                color={"primary"}
                variant="soft"
                placement="bottom-start"
                sx={{
                    padding: 0,
                    borderRadius: "var(--joy-radius-sm)",
                    backgroundColor: "transparent",
                }}>
                {list.length === 0 ?
                    <>
                        <Typography variant={"plain"} color={"primary"} level={'body-lg'}>
                            <Inventory2/>
                        </Typography>
                        <Typography level={'body-sm'}>
                            No Results Found
                        </Typography>
                    </> :
                    <>{list.map((item, i) => (
                        <div key={i}>
                            <ListItem sx={{
                                borderRadius: 6,
                                marginTop: "3px",
                                marginLeft: "3%",
                                marginRight: "3%",
                                marginBottom: "3px",
                            }}>
                                <ListItemButton tabIndex={-1} onClick={
                                    fn === null ? fn : () => fn(item.id)
                                }>
                                    <Typography>
                                        <Typography className={'font-bold'}>{item.title}</Typography><br/>
                                        <Typography noWrap level={'body-sm'}>{item.desc}</Typography><br/>
                                        <Typography level={'body-sm'}>{
                                            item.content.length <= 100 ? item.content : (item.content.slice(0, 100) + " ...")
                                        }</Typography>
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        </div>
                    ))}</>
                }
            </List>
        </>
    )
}