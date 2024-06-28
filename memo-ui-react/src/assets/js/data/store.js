import { configureStore } from '@reduxjs/toolkit'
import {blog_page_slice} from "@/assets/js/data/reducer/blog_page_slice.js";
import {blog_number_slice} from "@/assets/js/data/reducer/blog_number_slice.js";
import {category_slice} from "@/assets/js/data/reducer/category_slice.js";

export const store = configureStore({
    reducer: {
        blogPage: blog_page_slice.reducer,
        blogNumber: blog_number_slice.reducer,
        category: category_slice.reducer,
    },
})