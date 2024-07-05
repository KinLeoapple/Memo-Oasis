import {CategoriesList} from "@/components/home/CategoriesList.jsx";
import {BlogList} from "@/components/home/BlogList.jsx";
import {Layout} from "@/components/layout/Layout.jsx";
import {Pagination} from "@/components/common/Pagination.jsx";
import {useDispatch, useSelector} from "react-redux";
import {Condition} from "@/components/home/Condition.jsx";
import {selectBlog, setBlogValue} from "@/assets/js/data/reducer/blog_slice.js";
import {BlogRenderer} from "@/components/home/BlogRenderer.jsx";
import {BlogIndex} from "@/components/home/BlogIndex.jsx";
import {useEffect} from "react";
import {setContentValue} from "@/assets/js/data/reducer/blog_content_slice.js";
import {selectShowSearchResult} from "@/assets/js/data/reducer/show_search_result_slice.js";
import {SearchResult} from "@/components/home/SearchResult.jsx";

export const Home = () => {
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