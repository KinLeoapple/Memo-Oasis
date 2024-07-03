import {CategoriesList} from "@/components/home/CategoriesList.jsx";
import {BlogList} from "@/components/home/BlogList.jsx";
import {Layout} from "@/components/layout/Layout.jsx";
import {Pagination} from "@/components/common/Pagination.jsx";
import {useSelector} from "react-redux";
import {Condition} from "@/components/home/Condition.jsx";
import {selectBlog} from "@/assets/js/data/reducer/blog_slice.js";
import {BlogRenderer} from "@/components/home/BlogRenderer.jsx";
import {BlogIndex} from "@/components/home/BlogIndex.jsx";

export const Home = () => {
    const blog = useSelector(selectBlog);

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
                                <BlogList/>
                                <Pagination/>
                            </> :
                            <BlogRenderer/>
                        }
                    </div>
                }}
            />
        </>
    )
}