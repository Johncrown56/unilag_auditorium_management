import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatatableFooter from "../../components/datatable/datatableFooter";
import DatatableHeader from "../../components/datatable/datatableHeader";
import DatatableHead from "../../components/datatable/datatableHead";
import moment from "moment";
import { BiEdit } from "react-icons/bi";
import { HiEye, HiTrash } from "react-icons/hi2";

type Props = {
  list: Array<any>;
  properties: Array<any>;
  filterOpen: boolean;
  paginateData?: any;
  loadData?: any;
  statusData?: any;
  checkAll: boolean;
  openDropdownIndex: boolean;
  loadDataBySearch?: (value: string) => void;
  viewBooking: (value: string) => void;
  editBooking: (value: string) => void;
  openCancelBookingModal: (value: string) => void;
  handleEditClick: (value: string) => void;
  toggleFilter: () => void;
};

const Datatable = (props: Props) => {
  const {
    list,
    properties,
    filterOpen,
    paginateData = null,
    loadData = null,
    statusData = null,
    checkAll,
    openDropdownIndex,
    loadDataBySearch = null,
    handleEditClick,
    openCancelBookingModal,
    viewBooking,
    editBooking,
    toggleFilter,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [numberPerPage, setNumberPerPage] = useState(10);
  const [data, setData] = useState(list);
  const [filteredData, setFilteredData] = useState(list);
  const [searchValue, setSearchValue] = useState("");
  const [filteredStatus, setfilteredStatus] = useState("");
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (paginateData) {
      setCurrentPage(paginateData["current_page"]);
      setNumberPerPage(paginateData["per_page"]);
    }
  }, [paginateData]);

  useEffect(() => {
    const newList = list.map((item) => {
      return {
        ...item,
        checked: false,
      };
    });
    setData(newList);
    setFilteredData(newList);
    //setSort(dataProperty.map(() => null));
  }, [list, properties]);

  const searchByValue = (value: string) => {
    if (paginateData && loadDataBySearch) {
      loadDataBySearch(value);
    }
    setSearchValue(value);
  };

  const searchByStatus = (value: string) => {
    if (paginateData && loadDataBySearch) {
      loadDataBySearch(value);
    }
    setfilteredStatus(value);
    toggleFilter();
  };

  const resetCheck = useCallback(() => {
    if (check) {
      setCheck(false);
    }
    setData((d) =>
      d.map((item) => {
        return {
          ...item,
          checked: false,
        };
      })
    );
  }, [check]);

  let showData = useMemo(() => {
    const startIndex = (currentPage - 1) * numberPerPage;
    const endIndex = (currentPage - 1) * numberPerPage + numberPerPage;
    if (searchValue.length && paginateData === null) {
      const result = data.filter(
        (item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchValue.toLowerCase())
          ) ||
          (item?.category &&
            item?.category?.name
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
      );
      setFilteredData(result);
      return result.slice(startIndex, endIndex);
    }

    if (
      filteredStatus.length &&
      filteredStatus !== "All" &&
      paginateData === null
    ) {
      const result = data.filter((item) =>
        item?.status.toLowerCase().includes(filteredStatus.toLowerCase())
      );
      setFilteredData(result);
      return result.slice(startIndex, endIndex);
    }

    return paginateData ? data : data.slice(startIndex, endIndex); //sortFilterResult(paginateData ? data : data.slice(startIndex, endIndex));
  }, [currentPage, numberPerPage, searchValue, data, properties, paginateData]);

  const totalPage = useMemo(() => {
    return paginateData
      ? paginateData["last_page"]
      : Math.ceil(data.length / numberPerPage);
  }, [data, numberPerPage, paginateData]);

  const searchFirstElementPageNumber = useCallback(
    (newPerPage: number) => {
      if (searchValue.length || data.length === 0) return 1;
      const totalPage = Math.ceil(data.length / newPerPage);
      const firstElement = showData[0];
      let i;
      let searchPage = 0;
      for (i = 0; i < totalPage; i++) {
        const startIndex = i * newPerPage;
        const endIndex = startIndex + newPerPage;
        const tab = [...data].slice(startIndex, endIndex);
        let i1;
        for (i1 = 0; i1 < tab.length; i1++) {
          if (tab[i1].id === firstElement.id) {
            searchPage = i + 1;
            break;
          }
        }
        if (searchPage) break;
      }
      return searchPage;
    },
    [data, searchValue.length, showData]
  );

  const handlePerPageChange = useCallback(
    (value: number) => {
      if (value !== numberPerPage) {
        if (paginateData && loadData) {
          loadData(Number(value), 1, null, true, searchValue);
        } else {
          setCurrentPage(searchFirstElementPageNumber(Number(value)));
        }
        setNumberPerPage(Number(value));
        resetCheck();
      }
    },
    [
      loadData,
      numberPerPage,
      paginateData,
      resetCheck,
      searchFirstElementPageNumber,
      searchValue,
    ]
  );

  const nextPage = useCallback(() => {
    if (currentPage !== totalPage) {
      if (paginateData && loadData) {
        loadData(
          numberPerPage,
          currentPage + 1,
          null,
          true,
          searchValue,
          statusData
        );
      }
      setCurrentPage((c) => c + 1);
      resetCheck();
    }
  }, [
    currentPage,
    loadData,
    numberPerPage,
    paginateData,
    resetCheck,
    searchValue,
    statusData,
    totalPage,
  ]);

  const previousPage = useCallback(() => {
    if (currentPage !== 1) {
      if (paginateData && loadData) {
        loadData(
          numberPerPage,
          currentPage - 1,
          null,
          true,
          searchValue,
          statusData
        );
      }
      setCurrentPage((c) => c - 1);
      resetCheck();
    }
  }, [
    currentPage,
    loadData,
    numberPerPage,
    paginateData,
    resetCheck,
    searchValue,
    statusData,
  ]);

  const gotoPage = useCallback(
    (number: number) => {
      if (number !== currentPage) {
        if (paginateData && loadData) {
          loadData(numberPerPage, number, null, true, searchValue, statusData);
        }
        setCurrentPage(number);
        resetCheck();
      }
    },
    [
      currentPage,
      loadData,
      numberPerPage,
      paginateData,
      resetCheck,
      searchValue,
      statusData,
    ]
  );

  return (
    <div className="">
      <section className="p-1 sm:p-3">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-3">
          <div className="bg-white dark:bg-gray-800 border-t relative shadow-lg sm:rounded-lg overflow-hidden">
            <DatatableHeader
              filterOpen={filterOpen}
              searchValue={searchValue}
              onChangeSearchValue={searchByValue}
              toggleFilter={toggleFilter}
              filteredStatus={filteredStatus}
              filterStatus={searchByStatus}
              checkAll={checkAll}
              paginateData={paginateData}
              //loading={loading}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <DatatableHead properties={properties} />
                <tbody>
                  {showData.length > 0 &&
                    showData.map((b, i) => (
                      <tr key={i} className="border-b dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {b.name}
                        </th>
                        <td className="px-4 py-3">{b.bookingId}</td>
                        <td className="px-4 py-3">{b?.category?.name}</td>
                        <td className="px-4 py-3">{b?.purpose}</td>
                        <td className="px-4 py-3">
                          {moment(b.dateCreated).format("DD MMM, YYYY. HH:mmA")}
                        </td>
                        <td className="px-4 py-3">
                          <p
                            className={`${
                              b.paymentStatus == 1
                                ? "bg-success-600 text-success-500"
                                : "bg-danger-600 text-danger-600"
                            } inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium`}
                          >
                            {b.paymentStatus == 1 ? "Paid" : "Unpaid"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div
                              className={`${
                                b.status === "Approved"
                                  ? "bg-green-600"
                                  : b.status === "Pending"
                                  ? "bg-red-600"
                                  : "bg-yellow-600"
                              } border rounded-full w-3 h-3 mr-2 `}
                            ></div>
                            {b.status}
                          </div>
                        </td>
                        <td className="px-4 py-3 items-center justify-end">
                          <button
                            onClick={() => handleEditClick(b.bookingId)}
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

                          <div
                            id={"id-" + i}
                            className={`${
                              openDropdownIndex === b.bookingId
                                ? "block"
                                : "hidden"
                            } absolute z-10 w-44 m-0 right-0 bg-white transform opacity-100 scale-100 origin-top-right rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
                          >
                            <ul
                              className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby={"id-" + i}
                            >
                              <li>
                                <button
                                  className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  id={`view-booking-${i}`}
                                  onClick={() => viewBooking(b.bookingId)}
                                >
                                  <HiEye
                                    className="mr-2 h-5 w-5"
                                    color="#a80a0a"
                                  />
                                  View Booking
                                </button>
                              </li>
                              <li>
                                <button
                                  id={`edit-booking-${i}`}
                                  onClick={() => editBooking(b.bookingId)}
                                  className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  <BiEdit
                                    className="mr-2 h-5 w-5"
                                    color="#a80a0a"
                                  />
                                  Edit Booking
                                </button>
                              </li>
                              <li>
                                <button
                                  className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  id={`cancel-booking-${i}`}
                                  onClick={() =>
                                    openCancelBookingModal(b.bookingId)
                                  }
                                >
                                  <HiTrash
                                    className="mr-2 h-5 w-5"
                                    color="#a80a0a"
                                  />
                                  Cancel Booking
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {showData.length === 0 && (
              <div className="items-center justify-center mt-5">
                <p className="text-center">No Data found.</p>
              </div>
            )}

            <DatatableFooter
              data={filteredData}
              numberPerPage={numberPerPage}
              onChangeNumberPerPage={handlePerPageChange}
              totalPage={totalPage}
              currentPage={currentPage}
              next={nextPage}
              previous={previousPage}
              gotoPage={gotoPage}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Datatable;
