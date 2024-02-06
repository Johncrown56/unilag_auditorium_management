import React from 'react'
import Container from '../container'
import solutionsBg from "../../assets/imgs/png-icons/our-solutions-bg.png"
import { features, workingSteps } from '../../utils/constant'
import checkIcon from "../../assets/imgs/png-icons/check.png"
import auditoriumDashboard from "../../assets/imgs/others/auditorium_dashboard.png";


type Props = {}

const Features3 = (props: Props) => {
    return (
        <>
            <div
                className="mt-28 pt-10 md:pt-28 pb-52 space-y-8 text-center text-white bg-no-repeat bg-cover bg-center"
                style={{ backgroundImage: `url('${solutionsBg}')` }}
            >
                <h3 className="wow fadeInUp text-xl md:text-2xl text-primary-400 font-bold">
                    Fast booking. No conflict. No hassle.
                </h3>
                <h1 className="wow fadeInUp text-3xl md:text-4xl xl:text-6xl font-bold">
                    Manage All Your Bookings In <br className="hidden lg:block" /> One Place
                </h1>
                <p className="wow fadeInUp text-white font-medium text-opacity-80 text-sm md:text-base">
                    Manage and track your bookings on your dashboard from application <br /> {" "}
                    stage to approval stage.
                </p>
            </div>

            <Container className="-mt-[150px] wow fadeInUp">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="w-2/3 mx-auto md:w-full bg-white transition-all duration-300 border border-gray-200 border-opacity-50 rounded-3xl p-4 lg:p-8 text-center flex flex-col space-y-8 shadow-xl">
                            <div className="flex items-center justify-center">
                                <img src={f.icon} alt="" />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-bold text-primary-900">{f.name}</h3>
                            <p className="max-w-lg text-lg text-indigo-900">
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center flex-col-reverse  lg:flex-row space-x-16 mt-24">
                    {/* <img
                        src="/images/app-download-img.png"
                        className="w-full lg:w-1/2 mt-8 lg:mt-0 object-cover object-center"
                        alt=""
                    /> */}

                    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                        <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
                            <img src={auditoriumDashboard} className="dark:hidden h-[156px] md:h-[278px] w-full rounded-xl" alt="" />
                            <img src={auditoriumDashboard} className="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg" alt="" />
                        </div>
                    </div>
                    <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
                    </div>


                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="text-indigo-900 space-y-8 mt-28">
                            {/* <h4 className="text-xl text-primary-600 lg:text-2xl font-bold">
                                How it works
                            </h4> */}

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                                How It Works
                            </h1>

                            <p className="text-sm sm:text-base">
                                Access your account through your device. View bookings, schedule
                                auditoriums, manage your bookings, wherever you are.
                            </p>
                        </div>

                        {workingSteps.map((w, i) => (
                            <div key={i} className="space-y-5 text-indigo-900">
                                <div className="flex items-center space-x-3 lg:space-x-5">
                                    <img src={checkIcon} alt="" />
                                    <p>{w}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </Container>
        </>
    )
}

export default Features3