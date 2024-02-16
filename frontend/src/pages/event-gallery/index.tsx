import React, { useState } from 'react'
import SectionTitle from '../../components/sectionTitle';

type Props = {}

const EventGallery = (props: Props) => {
    const buttons = ["All categories", "Inaugural Lectures", "Sports", "Convocation", "Convention"]
    const [text, setText] = useState("All categories");
    return (
        <div className='container lg:px-8 py-24 lg:py-24 sm:py-32'>
            <SectionTitle title="Event Gallery">
                View some of out past and memorable events here.
            </SectionTitle>

            <div className="flex items-center justify-center py-4 md:py-8 flex-wrap">
                {buttons.map((b, i) => (
                    <button type="button" onClick={() => setText(b)} className={`${b === text ?
                        " text-primary-700 hover:text-white  border-primary-600 hover:bg-primary-700 dark:border-primary-500 dark:text-primary-500 dark:hover:bg-primary-500 dark:hover:text-white dark:bg-gray-900 "
                        : "text-gray-900 border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 focus:ring-gray-300 dark:text-white dark:focus:ring-gray-800"} " border bg-white focus:outline-none rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 "`}>
                        {b}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[0,1,2,3,4,5,6,7,8].map((item, i)=> (
                    <div key={i}>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg" alt={i.toString()} />
                </div>
                ))}
                
            </div>
        </div>
    )
}

export default EventGallery