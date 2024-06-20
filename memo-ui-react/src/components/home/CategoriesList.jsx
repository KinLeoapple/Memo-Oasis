import {Badge, List, ListItem, ListItemButton, Typography, useColorScheme} from "@mui/joy";
import {useEffect, useState} from "react";
import {get_category, get_category_all, get_category_number} from "@/assets/js/api.js";

export const CategoriesList = () => {
    const themeMode = useColorScheme();
    const [categories, setCategories] = useState({data: [], refresh: true});

    useEffect(() => {
        let list = [];
        get_category_all().then(r => {
            if (r !== null) {
                for (let i in r) {
                    Promise.all([get_category(r[i].id), get_category_number(r[i].id)]).then(arr => {
                        if (arr[1].count > 0) {
                            arr[0].number = arr[1].count;
                            list.push(arr[0]);
                            setCategories({data: list, refresh: true});
                        }
                    });
                }
            }
        });
    }, [categories.refresh]);

    return (
        <>
            <List
                size="lg"
                color="primary"
                variant="plain"
            >
                <Typography level="h4" color="neutral">
                    <span style={{
                        fontSize: 'x-large'
                    }}>C</span>ategory
                </Typography>
                {categories.data.length > 0 && categories.data.sort((a, b) => {
                    return a.catName.toLowerCase()
                        .localeCompare(b.catName.toLowerCase());
                }).map((category) => (
                    <ListItem key={category} className={`cursor-pointer`} sx={{
                        width: '100%'
                    }}>
                        <ListItemButton className={'flex flex-row justify-between'} sx={{
                            borderRadius: '6px'
                        }}>
                            <p className={`text-base font-bold`}>{category.catName}</p>
                            <Badge variant="soft" size="sm" badgeContent={category.number} sx={{
                                '--Badge-ring': '0 0 0 0'
                            }}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    )
}