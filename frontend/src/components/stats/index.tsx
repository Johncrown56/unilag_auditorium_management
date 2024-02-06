import Container from '../container'
import CountUp from "react-countup";

type Props = {}

const Stats = (props: Props) => {
    return (
        <Container className="wow fadeInUp relative -mt-[110px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-gray-200 border-opacity-50 shadow-2xl rounded-xl">
                <div className="text-center py-10 lg:py-16 space-y-3 text-indigo-900 font-medium">
                    <h1 className="text-5xl lg:text-6xl font-semibold text-primary-600">
                        <CountUp end={30} />+
                    </h1>
                    <p className="text-sm lg:text-base">Auditoriums</p>
                </div>

                <div className="text-center py-10 lg:py-16 space-y-3 text-indigo-900 font-medium">
                    <h1 className="text-5xl lg:text-6xl font-semibold text-primary-600">
                        <CountUp end={100} />+
                    </h1>
                    <p className="text-sm lg:text-base">Events Organized</p>
                </div>

                <div className="text-center py-10 lg:py-16 space-y-3 text-indigo-900 font-medium">
                    <h1 className="text-5xl lg:text-6xl font-semibold text-primary-600">
                        <CountUp end={200000} />+
                    </h1>
                    <p className="text-sm lg:text-base">Event Attendees</p>
                </div>

                <div className="text-center py-10 lg:py-16 space-y-3 text-indigo-900 font-medium">
                    <h1 className="text-5xl lg:text-6xl font-semibold text-primary-600">
                        <CountUp end={50} />+
                    </h1>
                    <p className="text-sm lg:text-base">Clients</p>
                </div>
            </div>
        </Container>
    )
}

export default Stats