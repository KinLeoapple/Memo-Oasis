import {IconButton, Stack, SvgIcon} from "@mui/joy";
import {KeyboardArrowLeft, KeyboardArrowRight, MoreHoriz} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {decrement, increment, selectBlogPage, setPageValue} from "@/assets/js/data/reducer/blog_page_slice.js";

export const Pagination = ({
                               // eslint-disable-next-line react/prop-types
                               count = 0
                           }) => {
    const page = useSelector(selectBlogPage);
    const dispatch = useDispatch();
    const [dots, setDots] = useState({front: false, back: false});
    const [renderCount, setRenderCount] = useState(fillRenderCount());

    useEffect(() => {
        let front = true;
        let back = true;
        if (count > 3) {
            if (page - 1 < 3) {
                front = false;
            } else if (count - page < 3) {
                back = false;
            }
        } else {
            front = false;
            back = false;
        }
        setDots({front: front, back: back});
    }, [page]);

    useEffect(() => {
        setRenderCount(fillRenderCount());
    }, [dots]);

    function fillRenderCount() {
        let length = count;
        let start = 1;
        if (count > 3) {
            if (dots.front && dots.back) {
                length = 3;
                start = page - 1;
            } else {
                length = 4;
                if (!dots.front) {
                    start = 2;
                } else {
                    start = count - 4;
                }
            }
        }
        let end = length === count ? length - 1 : length + start;
        let list = [];
        for (let i = start; i < end; i++) {
            list.push(i);
        }
        return list;
    }

    function previousPage() {
        if (page > 1)
            dispatch(decrement());
    }

    function nextPage() {
        if (page < count)
            dispatch(increment());
    }

    function jumpTo(number) {
        // eslint-disable-next-line no-constant-condition
        if (number => 1 && number <= count)
            dispatch(setPageValue(number));
    }

    return (
        <div className={`w-full flex flex-col justify-center items-center mt-2 mb-10`}>
            {count > 1 &&
                <Stack direction="row" spacing={2} className={`w-11/12 flex flex-col justify-center`}>
                    <IconButton
                        onClick={previousPage}
                        color="primary" size="sm" tabIndex={-1}>
                        <KeyboardArrowLeft/>
                    </IconButton>
                    <IconButton
                        onClick={() => jumpTo(1)} size="sm" color={page === 1 ? "success" : "primary"}
                        tabIndex={-1}>{1}</IconButton>
                    {dots.front &&
                        <div className={'flex justify-center items-center'}>
                            {/* eslint-disable-next-line react/no-children-prop */}
                            <SvgIcon children={<MoreHoriz/>}/>
                        </div>
                    }
                    {
                        renderCount.map((number, i) => (
                            <IconButton
                                onClick={() => jumpTo(number)}
                                key={i} size="sm" color={number === page ? "success" : "primary"}
                                tabIndex={-1}>{number}</IconButton>
                        ))
                    }
                    {dots.back &&
                        <div className={'flex justify-center items-center'}>
                            {/* eslint-disable-next-line react/no-children-prop */}
                            <SvgIcon children={<MoreHoriz/>}/>
                        </div>
                    }
                    <IconButton
                        onClick={() => jumpTo(count)} size="sm" color={page === count ? "success" : "primary"}
                        tabIndex={-1}>{count}</IconButton>
                    <IconButton
                        onClick={nextPage}
                        color="primary" size="sm" tabIndex={-1}>
                        <KeyboardArrowRight/>
                    </IconButton>
                </Stack>
            }
        </div>
    )
}