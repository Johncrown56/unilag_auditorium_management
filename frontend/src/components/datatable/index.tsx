import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import DatatableFooter from "./footer";
import DatatableHeader from "./header";
import DatatableHead from "./head";
import DatatableBody from "./body";

type Props = {
  list: Array<any>;
  columns: { name: string; label: string, display?: string }[];
  idColumnName: string;
  paginateData?: any;
  loadData?: any;
  statusData?: any;
  title: string;
  showFilter: boolean;
  loadDataBySearch?: (value: string) => void;
  createButton?: () => void;
  viewButton?: (value: any) => void;
  editButton?: (value: any) => void;
  cancelButton?: (value: any) => void;
};

const Datatable = (props: Props) => {
  const {
    list,
    title,
    paginateData = null,
    loadData = null,
    statusData = null,
    loadDataBySearch = null,
    cancelButton,
    createButton,
    viewButton,
    editButton,
    columns,
    idColumnName,
    showFilter
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [numberPerPage, setNumberPerPage] = useState(10);
  const [data, setData] = useState(list);
  const [filteredData, setFilteredData] = useState(list);
  const [searchValue, setSearchValue] = useState("");
  const [filteredStatus, setfilteredStatus] = useState("");
  const [check, setCheck] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filterOpen, setfilterOpen] = useState(false);
  
  const toggleFilter = () => {
    setfilterOpen(!filterOpen);
  };

  const handleAction = (index: any) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

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
  }, [list, columns]);

  const searchByValue = (value: string) => {
    if (paginateData && loadDataBySearch) {
      loadDataBySearch(value);
    }
    setSearchValue(value);
  };

  const filterByStatus = (value: string) => {
    if (paginateData && loadDataBySearch) {
      loadDataBySearch(value);
    }
    setfilteredStatus(value);
    toggleFilter && toggleFilter();
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

    if ( filteredStatus.length > 0 && filteredStatus !== "All" && paginateData === null ) {
      const result = data.filter((item) =>
        item?.status.toLowerCase().includes(filteredStatus.toLowerCase())
      );
      setFilteredData(result);
      return result.slice(startIndex, endIndex);
    }

    return paginateData ? data : data.slice(startIndex, endIndex); //sortFilterResult(paginateData ? data : data.slice(startIndex, endIndex));
  }, [currentPage, numberPerPage, searchValue, data, filteredStatus, paginateData]);

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
              filterOpen={filterOpen!}
              searchValue={searchValue}
              title={title}
              showFilter={showFilter}
              filteredStatus={filteredStatus}
              createButton={createButton}
              onChangeSearchValue={searchByValue}
              toggleFilter={toggleFilter!}
              filterByStatus={filterByStatus}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <DatatableHead columns={columns} />
                <DatatableBody showData={showData} columns={columns} title={title} handleAction={handleAction} idColumnName={idColumnName}
                  openDropdown={openDropdown} viewButton={viewButton} editButton={editButton} cancelButton={cancelButton} setOpenDropdown={setOpenDropdown} />
              </table>
            </div>
            {showData.length === 0 && (
              <div className="items-center justify-center mt-5">
                <p className="text-center">No Data found.</p>
              </div>
            )}

            <DatatableFooter
              data={data}
              paginatedData={showData}
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




