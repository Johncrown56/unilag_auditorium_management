import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetch, reset } from "../../features/auditoriums/auditoriumSlice";
import { AuditoriumResponse } from "../../utils/interfaces";
import FullLoader from "../../components/fullLoader";
import { HiEye, HiTrash } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";
import { NumericFormat } from "react-number-format";

type Props = {};

const ViewAuditorium = (props: Props) => {
  const [AudData, setAudData] = useState<AuditoriumResponse[]>([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const handleActionClick = (index: any) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const { data, isLoading, isFullLoading, isError, isSuccess, message } =
    useSelector((state: any) => state.auditorium);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetch());
  }, []);

  useEffect(() => {
    if (isSuccess && data != null) {
      // if response is Success
      console.log(data);
      // reset all values
      setAudData(data);
    }
    dispatch(reset());
  }, [data, isError, isSuccess, message, dispatch]);

  if (isLoading) {
    return <FullLoader />;
  }
  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="View Auditorium" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              All Auditoriums
            </h4>
          </div>

          <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-9 md:px-4 2xl:px-7.5">
            <div className="col-span-1 flex items-center">
              <p className="font-medium">S/N</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Image</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Name</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="font-medium">Features</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Capacity</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Price</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Student Price</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Action</p>
            </div>
            {/* <div className="col-span-1 flex items-center">
              <p className="font-medium">Price</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Capacity</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Date Created</p>
            </div> */}
          </div>

          {AudData?.length > 0 &&
            AudData?.map((aud, i) => (
              <div
                key={i}
                className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-9 md:px-4 2xl:px-7.5"
              >
                <div className="col-span-1 flex items-center">
                  <p className="text-sm text-black dark:text-white">{i + 1}.</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-12.5 w-15 rounded-md">
                      <img src={`${aud.images[0].fileName}`} alt={aud.name} />
                    </div>
                    <p className="text-sm text-black dark:text-white">
                      {aud.name}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {aud.features
                      .map((f) => {
                        return f ? f.name : null;
                      })
                      .join(", ")}
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {aud.capacity}
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    <NumericFormat
                      value={Number(aud.price).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₦"}
                    />
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="text-sm text-meta-3">
                    <NumericFormat
                      value={Number(aud.studentPrice).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₦"}
                    />
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <button
                    onClick={() => handleActionClick(aud.id)}
                    className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                    type="button"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                  {openDropdownIndex === aud.id && (
                    <div
                      id={"id-" + i}
                      className={`${
                        openDropdownIndex === aud.id ? "block" : "hidden"
                      } absolute z-10 w-44 m-0 mt-36 right-0 bg-white transform opacity-100 scale-100 origin-top-right rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
                    >
                      <ul
                        className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby={"id-" + i}
                      >
                        <li>
                          <button
                            className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            id={`view-auditorium-${i}`}
                          >
                            <HiEye className="mr-2 h-5 w-5" color="#a80a0a" />
                            View Auditorium
                          </button>
                        </li>
                        <li>
                          <button
                            id={`edit-auditorium-${i}`}
                            className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            <BiEdit className="mr-2 h-5 w-5" color="#a80a0a" />
                            Edit Auditorium
                          </button>
                        </li>
                        <li>
                          <button
                            className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            id={`cancel-auditorium-${i}`}
                          >
                            <HiTrash className="mr-2 h-5 w-5" color="#a80a0a" />
                            Delete Auditorium
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ViewAuditorium;
