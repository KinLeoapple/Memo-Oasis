import {ResultList} from "@/components/common/ResultList.jsx";

export const SearchResult = () => {
    return (
        <div className={'mb-10'}>
            <ResultList id={"resultList"} search={true}/>
        </div>
    )
}