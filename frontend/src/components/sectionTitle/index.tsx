
type Props = {
    title: string
    pretitle?: string;
    children?: string;
    align?: string;
}

const SectionTitle = (props: Props) => {
    const { title, pretitle, children, align} = props;
    return (
        <div
            className={`container p-8 mx-auto xl:px-0 flex w-full flex-col mt-4 ${align === "left" ? "" : "items-center justify-center text-center"
                }`}>
            {pretitle && (
                <div className="text-sm font-bold tracking-wider text-primary-600 uppercase">
                    {pretitle} 
                </div>
            )}

            {title && (
                <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl dark:text-white">
                    {title}
                </h2>
            )}

            {children && (
                <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
                    {children}
                </p>
            )}
        </div>
    );
}

export default SectionTitle;