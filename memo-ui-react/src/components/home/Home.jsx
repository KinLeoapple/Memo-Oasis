import {ProfileCard} from "@/components/home/ProfileCard.jsx";
import {useEffect, useState} from "react";
import {basic_info} from "@/assets/js/api/api.js";
import {Divider} from "@mui/joy";
import {CategoriesList} from "@/components/home/CategoriesList.jsx";
import {BlogList} from "@/components/home/BlogList.jsx";
import {Layout} from "@/components/layout/Layout.jsx";
import {Pagination} from "@/components/common/Pagination.jsx";
import {useSelector} from "react-redux";
import {selectBlogNumber} from "@/assets/js/data/reducer/blog_number_slice.js";
import {Condition} from "@/components/home/Condition.jsx";

export const Home = () => {
    // Basic Information
    const [name, setName] = useState(null);
    const [quote, setQuote] = useState(null);
    const [quoteName, setQuoteName] = useState(null);

    const pagination = useSelector(selectBlogNumber);

    useEffect(() => {
        basic_info().then(r => {
            setName(r.name);
            setQuote(r.quote);
            setQuoteName(r.quote_name);
        });
    }, [name, quote, quoteName]);

    return (
        <>
            <Layout
                left={
                    <div className={'fixed w-[20%] h-[100%]'}>
                        <ProfileCard name={name} quote={quote} quoteName={quoteName}/>
                        <CategoriesList/>
                    </div>
                }
                content={
                    <div className={`min-h-full`}>
                        <Condition/>
                        <BlogList/>
                        <Pagination count={pagination}/>
                    </div>
                }
            />
        </>
    )
}