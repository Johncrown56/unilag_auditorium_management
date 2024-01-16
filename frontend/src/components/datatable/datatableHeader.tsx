import React from "react";
import { Link } from "react-router-dom";
import { HiChevronDown, HiPlus, HiTrash } from "react-icons/hi2";
import { FaAngleDown, FaFilter } from "react-icons/fa6";
import { paymentStatus } from "../../utils/constant";

type Props = {
  searchValue: string;
  onChangeSearchValue: (value: string) => void;
  filterOpen: boolean;
  toggleFilter: () => void;
  filteredStatus: string;
  filterStatus: (value: string) => void;
  checkAll: any;
  //loading: boolean,
  paginateData: any;
};

const DatatableHeader = (props: Props) => {
  const {
    searchValue,
    onChangeSearchValue,
    toggleFilter,
    filteredStatus,
    filterStatus,
    // onClick,
    // addButton,
    checkAll,
    //loading = false,
    paginateData = null,
    filterOpen,
  } = props;
  return (
    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
      <div>
        <h3 className="font-medium">All Bookings</h3>
      </div>
      <div className="w-full md:w-1/2">
        <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              name="search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search"
              required
              value={searchValue}
              onChange={(e) => onChangeSearchValue(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
        <Link
          to={"/bookings/create"}
          className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Create Booking
        </Link>
        <div className="relative mb-50 inline-block">
          <button
            onClick={toggleFilter}
            className="inline-flex items-center gap-2.5 rounded-md bg-white py-2 px-4 font-medium text-dark min-w-36 justify-between hover:bg-opacity-95 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <span> {filteredStatus ? filteredStatus : "Filter Status"} </span>
            <FaAngleDown
              className={`ml-2 w-5 h-5 transform ${
                filterOpen ? "rotate-180" : "rotate-0"
              } transition-transform`}
            />
          </button>
          <div
            className={`${
              filterOpen ? "block" : "hidden"
            } absolute left-0 top-full z-40 mt-2 w-full rounded-md border border-stroke bg-white py-3 shadow-card dark:border-strokedark dark:bg-boxdark`}
          >
            <ul className="flex flex-col">
              {paymentStatus.map((item, i) => (
                <li key={i}>
                  <button
                    className={`${
                      filteredStatus === item ? "font-bold" : "font-medium"
                    } flex py-2 px-5 hover:bg-whiter hover:text-primary-500 dark:hover:bg-meta-4`}
                    onClick={() => filterStatus(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatatableHeader;
