import {Badge, List, ListItem, ListItemButton, Typography} from "@mui/joy";
import {useEffect, useState} from "react";
import {get_category, get_category_all, get_category_number} from "@/assets/js/api.js";
import {useDispatch, useSelector} from "react-redux";
import {selectCategory, setCategoryValue} from "@/assets/js/data/reducer/category_slice.js";

export const CategoriesList = () => {
    const cat = useSelector(selectCategory);
    const dispatch = useDispatch();
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

    function selectedCategory(name) {
        dispatch(setCategoryValue(name));
    }

    return (
        <>
            <List
                className={'select-none'}
                size="lg"
                color="primary"
                variant="plain"
                sx={{
                    "--List-gap": "5px"
                }}
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
                    <ListItem key={category} className={`cursor-pointer select-none`} sx={{
                        width: '100%'
                    }}>
                        <ListItemButton
                            onClick={() => selectedCategory(category.catName)}
                            selected={category.catName === cat}
                            color={category.catName === cat ? "primary" : undefined}
                            className={'flex flex-row justify-between'} sx={{
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