import {configureStore} from '@reduxjs/toolkit';
import {blog_slice} from "@/assets/js/data/reducer/blog_slice.js";
import {blog_page_slice} from "@/assets/js/data/reducer/blog_page_slice.js";
import {blog_number_slice} from "@/assets/js/data/reducer/blog_number_slice.js";
import {condition_slice} from "@/assets/js/data/reducer/condition_slice.js";
import {blog_content_slice} from "@/assets/js/data/reducer/blog_content_slice.js";

export const store = configureStore({
    reducer: {
        blog: blog_slice.reducer,
        blogPage: blog_page_slice.reducer,
        blogNumber: blog_number_slice.reducer,
        blogContent: blog_content_slice.reducer,
        condition: condition_slice.reducer,
    },
})