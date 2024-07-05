import {configureStore} from '@reduxjs/toolkit';
import {blog_slice} from "@/assets/js/data/reducer/blog_slice.js";
import {blog_page_slice} from "@/assets/js/data/reducer/blog_page_slice.js";
import {blog_number_slice} from "@/assets/js/data/reducer/blog_number_slice.js";
import {condition_slice} from "@/assets/js/data/reducer/condition_slice.js";
import {blog_content_slice} from "@/assets/js/data/reducer/blog_content_slice.js";
import {login_state_slice} from "@/assets/js/data/reducer/login_state_slice.js";
import {blog_filter_number_slice} from "@/assets/js/data/reducer/blog_filter_number_slice.js";
import {user_basic_info_slice} from "@/assets/js/data/reducer/user_basic_info_slice.js";
import {search_keyword_slice} from "@/assets/js/data/reducer/search_keyword_slice.js";
import {show_search_result_slice} from "@/assets/js/data/reducer/show_search_result_slice.js";

export const store = configureStore({
    reducer: {
        blog: blog_slice.reducer,
        blogPage: blog_page_slice.reducer,
        blogNumber: blog_number_slice.reducer,
        blogFilterNumber: blog_filter_number_slice.reducer,
        blogContent: blog_content_slice.reducer,
        condition: condition_slice.reducer,
        searchKeyword: search_keyword_slice.reducer,
        loginState: login_state_slice.reducer,
        userBasicInfo: user_basic_info_slice.reducer,
        showSearchResult: show_search_result_slice.reducer
    },
})