import { ReactNode } from "react";

type Params ={
    children: ReactNode
    className: string
}

const Container = ({ children, className }: Params) => {
    return (
        <div
            className={`mx-auto 2xl:max-w-[1320px] xl:max-w-[1140px] lg:max-w-[960px] md:max-w-[860px] px-4 lg:p-0 sm:max-w-[520px] w-full${
                className ? " " + className : ""
            }`}
        >
            {children}
        </div>
    );
};

export default Container