import {Layout} from "@/components/layout/Layout.js";
import {LoginCard} from "@/components/login/LoginCard.jsx";

export const Login = () => {
    return (
        <>
            <Layout
                center={{
                    el:
                        <>
                            <LoginCard/>
                        </>,
                    show: true,
                    fixed: true
                }}
            />
        </>
    )
}