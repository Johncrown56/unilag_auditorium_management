import { useEffect, useRef, useState } from "react";
import { HiMiniStar } from "react-icons/hi2";
import { RadioGroup } from "@headlessui/react";
import { fetchOne, reset } from "../../../features/auditoriums/auditoriumSlice";
import { useDispatch, useSelector } from "react-redux";
import { AuditoriumResponse } from "../../../utils/interfaces";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../../store/store";
import { NumericFormat } from "react-number-format";
import auditoriumImage from "../../../assets/imgs/others/user-with-laptop.jpg"
import Img from "../../../components/lazyLoadImage";
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { AuditoriumTerms } from "../../../utils/constant";


const reviews = { href: "#", average: 4, totalCount: 17 };

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const FrontAuditoriumViewOne = () => {
  const [auditorium, setAuditorium] = useState<AuditoriumResponse>();
  const { user } = useSelector((state: any) => state.auth);
  const [selectedImage, setSelectedImage] = useState("");
  const carouselContainer = useRef({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  let params = useParams();
  const [id] = useState(params.id);
  const { data, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.auditorium
  );

  useEffect(() => {
    dispatch(fetchOne(String(id)));
  }, []);

  useEffect(() => {
    if (isSuccess && data != null) {
      // if response is Success
      console.log(data);
      const responseData = data[0];
      // Set the auditorium state
      setAuditorium(responseData);
      setSelectedImage(responseData?.images[0]?.fileName);
    }
    dispatch(reset());
  }, [data, isError, isSuccess, message, dispatch]);

  const navigation = (dir: string) => {
    const container = carouselContainer.current as any;

    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const goToAuditoriumPage = () => {
    navigate(user ? "/auditorium/create" : "/login");
  }

  // Duplicate each item in the array
  //const duplicatedData = data[0]?.images?.flatMap((item: any)=> [item, { ...item }]);
  //console.log(duplicatedData)

  return (
    <>

      {!isLoading && data != null &&
        // isSuccess && data != null &&
        (
          <div className="relative isolate px-6 pt-14 lg:px-8 py-24 sm:py-32">
            <div className="pt-6">
              {/* <div className="grid gap-4 mx-auto mt-6 max-w-2xl">
              <div>
                <img className="h-auto max-w-full rounded-lg" src={selectedImage} alt="" />
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" alt="" />
                </div>
                <div>
                  <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg" alt="" />
                </div>
                <div>
                  <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg" alt="" />
                </div>
                <div>
                  <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg" alt="" />
                </div>
                <div>
                  <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg" alt="" />
                </div>
              </div>
            </div> */}
              {/* Image gallery */}
              <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:gap-x-8 lg:px-8">
                <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
                  <Img
                    src={selectedImage}
                    alt={""}
                    className="object-cover object-center rounded-lg w-[1200px] h-[600px]"
                  />
                </div>

                <div className="w-full hidden my-6 max-w-10 lg:max-w-none mx-auto lg:block">
                  {/* <BsFillArrowLeftCircleFill
                    className="left-8 arrow"
                    onClick={() => navigation("left")}
                  />
                  <BsFillArrowRightCircleFill
                    className="right-8 arrow"
                    onClick={() => navigation("right")}
                  /> */}
                  <div className="grid gap-6 grid-cols-6" ref={carouselContainer as any}>
                    {data[0]?.images?.map((item: any, i: number) => (
                      <button
                        key={i}
                        className="uppercase text-customBlack font-medium text-sm bg-white rounded-md items-center justify-center cursor-pointer h-24 flex relative"
                        type="button"
                        onClick={() => setSelectedImage(item.fileName)}
                      >
                        <span>Aud Image</span>
                        <span className="rounded-md overflow-hidden inset-0 absolute">
                          <Img
                            className="object-center object-cover w-full h-full"
                            alt={`${data.title} ${item.sn}`}
                            src={item.fileName}
                          />
                        </span>
                        <span
                          className={`${selectedImage === item.fileName
                            ? "ring-2 ring-offset-2 "
                            : ""
                            }  ring-red-600 ring-offset-current rounded-md inset-0 absolute pointer-events-none`}
                        ></span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auditorium info */}
              <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {auditorium?.name + " Auditorium"}
                  </h1>
                </div>

                {/* Auditorium Information */}
                <div className="mt-4 lg:row-span-3 lg:mt-0">
                  <h2 className="sr-only">Auditorium Information</h2>
                  <p className="text-3xl tracking-tight text-gray-900">
                    <NumericFormat
                      value={Number(auditorium?.price).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₦"}
                    />
                  </p>

                  {/* Reviews */}
                  <div className="mt-6">
                    <h3 className="sr-only">Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <HiMiniStar
                            key={rating}
                            className={classNames(
                              reviews.average > rating
                                ? "text-warning"
                                : "text-gray-200",
                              "h-5 w-5 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="sr-only">{reviews.average} out of 5 stars</p>
                      <Link
                        to={reviews.href}
                        className="ml-3 text-sm font-medium text-indigo-900 hover:text-indigo-500"
                      >
                        {reviews.totalCount} reviews
                      </Link>
                    </div>
                  </div>

                  <div className="mt-10">
                    {/* Capacity */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Capacity</h3>
                      <p className="text-2xl tracking-tight text-gray-900">{auditorium?.capacity}</p>
                    </div>
                    {/* Cleaning Charges */}
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-900">Cleaning Charges</h3>
                      <p className="text-2xl tracking-tight text-gray-900">
                        <NumericFormat
                          value={Number(auditorium?.cleaningCharges).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₦"}
                        />
                      </p>
                    </div>

                    {/* Caution Fee */}
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-900">Caution Fee</h3>
                      <p className="text-2xl tracking-tight text-gray-900">
                        <NumericFormat
                          value={Number(auditorium?.cautionFee).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₦"}
                        /></p>
                    </div>

                    {/* VAT */}
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-900">Value Added Tax (VAT) - {`${auditorium?.vat}%`} </h3>
                      <p className="text-2xl tracking-tight text-gray-900">
                        <NumericFormat
                          value={Number(Number(auditorium?.vat) / 100 * Number(auditorium?.price)).toFixed(2) }
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₦"}
                        /></p>
                    </div>

                    <button
                      type="submit"
                      onClick={goToAuditoriumPage}
                      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Book Auditorium
                    </button>
                  </div>
                </div>

                <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                  {/* Description and details */}
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900">Description</h3>

                    <div className="space-y-6">
                      <p className="mt-4 text-gray-500 text-justify">
                        {auditorium?.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-sm font-bold text-indigo-900">Features</h3>

                    <div className="mt-4">
                      <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                        {auditorium?.features.map((feature, i) => (
                          <li key={i} className="text-gray-400">
                            <span className="font-medium text-gray-900">
                              {feature.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-sm font-bold text-indigo-900">Terms & Conditions</h2>

                    <div className="mt-4 space-y-6">
                      {/* <p className="text-sm text-gray-600">{product.details}</p> */}
                      <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                        {AuditoriumTerms.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>

  );
};

export default FrontAuditoriumViewOne;
