import { Link } from "react-router-dom";
import backgroundImage from '../../assets/imgs/png-icons/banner-map.png'
import bannerBox from "../../assets/imgs/png-icons/banner-box.png"
import bannerClock from "../../assets/imgs/png-icons/banner-clock.png"
import bannerRocket from "../../assets/imgs/png-icons/banner-rocket.png"
import bannerHuman from "../../assets/imgs/png-icons/banner-human.png"
import bannerWallet from "../../assets/imgs/png-icons/banner-wallet.png"


// import { checkUser } from "../helpers"; 
import Container from "../container";

const Banner = () => {
    return (
        <section className="w-full overflow-hidden bg-[#f2f3f9] wow fadeInUp">
            <div
                className="relative bg-auto bg-no-repeat bg-[top_120px_right] md:bg-[top_70px_right] lg:bg-[top_100px_right]"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div>
                    {/* <img
                        className="w-[25%] lg:w-[20%] xl:max-w-full h-auto align-middle absolute left-0 bottom-[5%] animate-ripple2"
                        src={bannerBox}
                        alt=""
                    /> */}
                    <img
                        className="hidden md:block w-[25%] lg:w-[15%] xl:w-[19%] h-auto align-middle absolute top-0 left-0"
                        src={bannerClock}
                        alt=""
                    />
                    {/* <img
                        className="w-[10%] xl:w-[13%] h-auto align-middle absolute left-[calc(48%)] bottom-[12%] animate-ripple2"
                        src={bannerRocket}
                        alt=""
                    /> */}
                    {/* <img
                        className="block w-[10%] xl:w-[15.5%] h-auto align-middle absolute right-0 bottom-[calc(5%)] animate-ripple"
                        src={bannerHuman}
                        alt=""
                    /> */}
                </div>

                <div className="pt-[150px] pb-[250px] xl:pb-[200px]">
                    <Container className="pt-5 flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-4 lg:space-x-0 lg:justify-between relative z-10">
                        {/* <img
                            src={bannerWallet}
                            className="hidden lg:block lg:w-[11%] absolute top-[3%] left-[47%] xl:left-[54%] animate-ripple"
                            alt=""
                        /> */}
                        <div>
                            <h5 className="font-bold lg:text-xl xl:text-2xl text-indigo-900 mb-3">
                            Avoid scheduling conflicts!
                            {/* Book your next event with ease! */}
                            </h5>
                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-900">
                                Book Auditoriums,
                                <br /> With Ease.
                                {/* Anywhere */}
                            </h1>
                            <p className="lg:text-xl xl:text-2xl text-indigo-900 my-8">
                                Are you an event organizer or planner?{" "}
                                {/* Quickly and easily book, pay and{" "} */}
                                <br className="hidden md:block xl:hidden" /> We've{" "}
                                <br className="hidden md:block hidden xl:block" /> got you covered.
                                Book <br className="hidden md:block xl:hidden" /> for your
                                next event <br className="hidden xl:block" /> in few minutes.{" "}
                                <br className="hidden md:block xl:hidden" />
                            </p>

                            <div className="flex items-center space-x-4">
                                {/* {!checkUser() && ( */}
                                    <Link
                                        to="/register"
                                        className="lg:text-lg truncate transition-all duration-300 px-3 lg:px-4 xl:px-8 font-medium py-3 bg-primary-600 text-white rounded-md focus:outline-none hover:bg-primary-700 focus:ring focus:border-indigo-500 focus:ring-indigo-500/50"
                                    >
                                        Create Account
                                    </Link>
                                {/* )} */}

                                <Link
                                    to="/auditoriums"
                                    className="lg:text-lg truncate transition-all duration-300 px-3 lg:px-4 xl:px-8 font-medium py-3 text-indigo-900 border border-indigo-900 rounded-md focus:outline-none hover:text-white hover:bg-primary-700 focus:ring focus:border-indigo-500 focus:ring-indigo-500/50"
                                >
                                    View Auditoriums
                                </Link>
                            </div>
                        </div>

                        {/* <div className="bg-white border border-gray-100 rounded-lg shadow-xl p-4 md:p-5 w-full md:w-1/2 lg:w-[40%] xl:w-[33%]">
                            <div className="space-y-8 lg:space-y-10">
                                <TransferForm />
                            </div>
                        </div> */}
                    </Container>
                </div>
            </div>
        </section>
    );
};

export default Banner;
