import {Layout} from "@/components/layout/Layout.jsx";
import {Editor} from "@/components/writer/Editor.jsx";

export const Writer = () => {
    return (
        <>
            <Layout
                center={{
                    el: <Editor/>,
                    show: true
                }}
            />
        </>
    )
}