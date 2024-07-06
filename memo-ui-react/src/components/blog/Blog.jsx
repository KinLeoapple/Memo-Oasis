import {CategoriesList} from "@/components/blog/CategoriesList.jsx";
import {BlogList} from "@/components/blog/BlogList.jsx";
import {Layout} from "@/components/layout/Layout.jsx";
import {Pagination} from "@/components/common/Pagination.jsx";
import {useDispatch, useSelector} from "react-redux";
import {Condition} from "@/components/blog/Condition.jsx";
import {selectBlog, setBlogValue} from "@/assets/js/data/reducer/blog/blog_slice.js";
import {BlogRenderer} from "@/components/blog/BlogRenderer.jsx";
import {BlogIndex} from "@/components/blog/BlogIndex.jsx";
import {useEffect} from "react";
import {setContentValue} from "@/assets/js/data/reducer/blog/blog_content_slice.js";
import {selectShowSearchResult} from "@/assets/js/data/reducer/blog/show_search_result_slice.js";
import {SearchResult} from "@/components/blog/SearchResult.jsx";

export const Blog = () => {
    const dispatch = useDispatch();
    const blog = useSelector(selectBlog);
    const showResult = useSelector(selectShowSearchResult);

    useEffect(() => {
        dispatch(setBlogValue(0));
        dispatch(setContentValue(""));
    }, []);

    return (
        <>
            <Layout
                left={{
                    el: <>
                        {blog === 0 ?
                            <CategoriesList/> :
                            <BlogIndex/>
                        }
                    </>,
                    fixed: true
                }}
                content={{
                    el: <div className={`min-h-full`}>
                        {blog === 0 ?
                            <>
                                <Condition/>
                                {showResult ? <SearchResult/> :
                                    <>
                                        <BlogList/>
                                        <Pagination/>
                                    </>
                                }
                            </> :
                            <BlogRenderer/>
                        }
                    </div>
                }}
            />
        </>
    )
}