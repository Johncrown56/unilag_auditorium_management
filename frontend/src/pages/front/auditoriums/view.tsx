import useFetch from '../../../hooks/useFetch';
import endpoint from '../../../utils/endpoints';
import { Link, useNavigate } from 'react-router-dom';

type Props = {}

const FrontAuditoriumView = (props: Props) => {
    const { data, loading, message, success } = useFetch(endpoint.AUDITORIUMS);
    console.log(data)
    const navigate = useNavigate();
    const goToAuditorium = (audID: string) => {
        navigate(`/auditorium/details/${audID}`)
    }
    const Skeleton = ()=> {
        return (
            <div role="status" className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }
    if (loading) {
        return (
        <div className="grid gap-8 lg:grid-cols-3 px-6 py-24 sm:py-32 lg:px-8">
            {<Skeleton />}
            {<Skeleton />}
            {<Skeleton />}
            {<Skeleton />}
            {<Skeleton />}
            {<Skeleton />}
        </div>
        )
         
    }
    return (
        <>
            {!loading && data != null && (
                <div className="grid gap-8 lg:grid-cols-3 px-6 py-24 sm:py-32 lg:px-8">
                    {data?.data?.length > 0 &&
                        data?.data?.map((item: any, i: number) => (
                            <article
                                key={i}
                                className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
                            >
                                <figure>
                                    <img
                                        src={item?.images[0]?.fileName}
                                        alt={item?.name}
                                        className="custom-image rounded-lg"
                                    />
                                </figure>
                                <div className="flex justify-between items-center my-5 text-gray-500">
                                </div>
                                <Link to={`/auditorium/details/${item.audID}`}>
                                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {`${item.name} Hall`}
                                    </h2>
                                </Link>
                                <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                                    {item.description}
                                </p>

                                <button type="button" onClick={() => goToAuditorium(item.audID)} className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">View Auditorium</button>

                            </article>
                        ))}
                </div>
            )}
        </>
    )
}

export default FrontAuditoriumView