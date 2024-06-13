import {Badge, List, ListItem, ListItemDecorator, Typography} from "@mui/joy";
import {useEffect, useState} from "react";
import {get_category, get_category_all, get_category_number} from "@/assets/js/api.js";

export const CategoriesList = ({
                                   theme = localStorage.getItem("theme-mode") || "dark"
                               }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let list = [];
        get_category_all().then(r => {
            if (r !== null) {
                for (let i in r) {
                    Promise.all([get_category(r[i].id), get_category_number(r[i].id)]).then(arr => {
                        if (arr[1].count > 0) {
                            arr[0].number = arr[1].count;
                            list.push(arr[0]);
                            setCategories(list);
                        }
                    });
                }
            }
        });
    });

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
                {categories.length > 0 && categories.sort((a, b) => {
                    return a.catName.toLowerCase()
                        .localeCompare(b.catName.toLowerCase());
                }).map((category) => (
                    <ListItem key={category} className={`flex flex-row justify-between`} sx={{
                        width: '100%'
                    }}>
                        <p className={`text-base font-bold`}>{category.catName}</p>
                        <ListItemDecorator>
                            <Badge variant="solid" size="sm" badgeContent={category.number}/>
                        </ListItemDecorator>
                    </ListItem>
                ))}
            </List>
        </>
    )
}