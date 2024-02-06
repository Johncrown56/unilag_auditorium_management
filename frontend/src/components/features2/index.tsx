import Container from '../container';
import paymentImage1 from "../../assets/imgs/png-icons/global-payment-icon-1.png"
import paymentImage2 from "../../assets/imgs/png-icons/global-payment-icon-2.png"
import paymentImage3 from "../../assets/imgs/png-icons/global-payment-icon-3.png"
import paymentImage4 from "../../assets/imgs/png-icons/global-payment-icon-4.png"
import userWithLaptop from "../../assets/imgs/others/user-with-laptop-3.jpg";

type Props = {}

const Features2 = (props: Props) => {
    return (

        <Container className="wow fadeInUp flex items-center flex-col-reverse xl:flex-row xl:space-y-0 xl:space-x-5">
            <div className="w-full xl:w-1/2">
                <img
                    src={userWithLaptop}
                    className="h-auto object-contain object-center rounded-lg align-middle mt-16 xl:mt-0"
                    alt=""
                />
            </div>

            <div className="w-full xl:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 text-indigo-900">
                <div className="transition-all duration-300 border border-indigo-200 rounded-3xl p-4 lg:p-8 text-center flex flex-col space-y-8 hover:border-gray-200 hover:border-opacity-50 hover:shadow-2xl">
                    <div className="flex items-center justify-center">
                        <img src={paymentImage1} alt="" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-primary-900">
                    Event Management
                    </h3>
                    <p className="max-w-lg text-indigo-900">
                        Allow Event Organizers to schedule, edit, and manage 
                        events. Lorem ipsum dolor sit amet consectetur adipiscing.
                    </p>
                </div>

                <div className="transition-all duration-300 border border-indigo-200 rounded-3xl p-4 lg:p-8 text-center flex flex-col space-y-8 hover:border-gray-200 hover:border-opacity-50 hover:shadow-2xl">
                    <div className="flex items-center justify-center">
                        <img src={paymentImage2} alt="" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-primary-900">
                    Reporting System
                    </h3>
                    <p className="max-w-lg text-indigo-900">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit posuere vel
                        venenatis, eu sit massa. Volutpat massa rhoncus odio.
                    </p>
                </div>

                <div className="transition-all duration-300 border border-indigo-200 rounded-3xl p-4 lg:p-8 text-center flex flex-col space-y-8 hover:border-gray-200 hover:border-opacity-50 hover:shadow-2xl">
                    <div className="flex items-center justify-center">
                        <img src={paymentImage3} alt="" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-primary-900">
                    Online Payment
                    </h3>
                    <p className="max-w-lg text-indigo-900">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit posuere vel
                        venenatis, eu sit massa. Volutpat massa rhoncus odio.
                    </p>
                </div>

                <div className="transition-all duration-300 border border-indigo-200 rounded-3xl p-4 lg:p-8 text-center flex flex-col space-y-8 hover:border-gray-200 hover:border-opacity-50 hover:shadow-2xl">
                    <div className="flex items-center justify-center">
                        <img src={paymentImage4} alt="" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-primary-900">
                        Online Application
                    </h3>
                    <p className="max-w-lg text-indigo-900">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit posuere vel
                        venenatis, eu sit massa. Volutpat massa rhoncus odio.
                    </p>
                </div>
            </div>
        </Container>
    )
}

export default Features2