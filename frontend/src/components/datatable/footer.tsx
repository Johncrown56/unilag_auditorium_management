import { useMemo } from "react";
import { scrollTop } from "../../utils/helpers";
import { numbersPerPage } from "../../utils/constant";

type Props = {
  data: Array<any>;
  paginatedData: Array<any>;
  currentPage: number;
  numberPerPage: number;
  totalPage: number;
  next: () => void;
  previous: () => void;
  gotoPage: (value: number) => void;
  onChangeNumberPerPage: (value: number) => void;
};

const DatatableFooter = (props: Props) => {
  const {
    data,
    paginatedData,
    currentPage = 0,
    totalPage = 0,
    numberPerPage = 10,
    onChangeNumberPerPage,
    next,
    previous,
    gotoPage,
  } = props;
  const scrollToPagination = () => {
    document.getElementById("table_pagination")!.scrollIntoView();
    scrollTop();
  };

  const onNext = async () => {
    await next();
    scrollToPagination();
  };

  const onPrevious = async () => {
    await previous();
    scrollToPagination();
  };

  const onGotoPage = async (item: number) => {
    await gotoPage(item);
    scrollToPagination();
  };

  const main = "px-3 py-1.5 font-medium text-sm rounded-md hover:outline-none focus:outline-none ";
  const active = "bg-primary-600 text-white hover:bg-primary-700";
  const notActive = "text-gray-600 text-black hover:bg-primary-100 hover:text-primary-500 ";
  const buttonHover =
    "w-8 h-8 text-gray-500 px-1 py-0.5 rounded-md hover:bg-primary-100 hover:text-primary-500";
  const buttonNotHover = "w-8 h-8 text-gray-300  px-1 py-0.5";

  const pages = useMemo(() => {
    let result = [];
    let i;
    for (i = 0; i < totalPage; i++) {
      result[i] = i + 1;
    }
    if (result.length === 0) {
      return [1];
    }
    return result;
  }, [totalPage]);
  const pagesLength = pages.length;
  const firstPage = pages[0];
  const lastPage = pages[pagesLength - 1];
  const firstNextPages = [...pages].splice(1, 4);
  const lastPreviousPages = [...pages].splice(pagesLength - 5, 4);
  const previousCurrent = pages[pages.indexOf(currentPage) - 1];
  const nextCurrent = pages[pages.indexOf(currentPage) + 1];
  const centerPages =
    previousCurrent && nextCurrent
      ? [previousCurrent, currentPage, nextCurrent]
      : [];
  const showFirstNextPages = currentPage <= 4;
  const showLastPreviousPages = currentPage >= lastPreviousPages[1];
  const startIndex = (currentPage - 1) * numberPerPage;
  const endIndex = (currentPage - 1) * numberPerPage + numberPerPage;
  return (
    <div id="table_pagination">
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <div className="flex items-center space-x-2">
          <select
            className="py-1.5 rounded-md text-sm px-3 focus:ring-0 border border-gray-300 text-gray-700 focus:border-gray-500"
            value={numberPerPage}
            onChange={(e) => onChangeNumberPerPage(Number(e.target.value))}
          >
            {numbersPerPage.map((item, i)=> (
            <option key={i} value={item}>{item}</option>
          ))}
          </select>

          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {1 + startIndex} - {` `}
              {paginatedData.length}
              {` `}
            </span>
            of
            <span className="font-semibold text-gray-900 dark:text-white">
              {`  ${data.length}`}
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className={`hover:outline-none focus:outline-none ${
              currentPage === 1 ? "cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
            onClick={onPrevious}
          >
            <svg
              className={currentPage === 1 ? buttonNotHover : buttonHover}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {pagesLength <= 10 &&
            pages.map((item: any, index: number) => (
              <button
                key={index}
                className={`${item === currentPage ? active : notActive} ${main}`}
                onClick={() => onGotoPage(item)}
              >
                {item}
              </button>
            ))}

          {pagesLength >= 11 && (
            <>
              <button
                className={`${firstPage === currentPage ? active : notActive} ${main}`}
                onClick={() => onGotoPage(firstPage)}
              >
                {firstPage}
              </button>

              {showFirstNextPages &&
                firstNextPages.map((item, index) => (
                  <button
                    key={index}
                    className={`${item === currentPage ? active : notActive } ${main}`}
                    onClick={() => onGotoPage(item)}
                  >
                    {item}
                  </button>
                ))}

              {!showLastPreviousPages && (
                <button className="px-3 py-1.5 text-gray-600 font-medium rounded-md text-sm hover:outline-none focus:outline-none cursor-text">
                  ...
                </button>
              )}

              {!showLastPreviousPages &&
                !showFirstNextPages &&
                centerPages.map((item, index) => (
                  <button
                    key={index}
                    className={`${item === currentPage ? active : notActive} ${main}`}
                    onClick={() => onGotoPage(item)}
                  >
                    {item}
                  </button>
                ))}

              {!showFirstNextPages && (
                <button className="px-3 py-1.5 text-gray-600 font-medium rounded-md text-sm hover:outline-none focus:outline-none cursor-text">
                  ...
                </button>
              )}

              {showLastPreviousPages &&
                lastPreviousPages.map((item, index) => (
                  <button
                    key={index}
                    className={`${item === currentPage ? active : notActive } ${main}`}
                    onClick={() => onGotoPage(item)}
                  >
                    {item}
                  </button>
                ))}

              <button
                className={`${lastPage === currentPage ? active : notActive } ${main}`}
                onClick={() => onGotoPage(lastPage)}
              >
                {lastPage}
              </button>
            </>
          )}

          <button
            className={`hover:outline-none focus:outline-none ${
              currentPage === totalPage || totalPage === 0
                ? "cursor-not-allowed"
                : ""
            }`}
            disabled={currentPage === totalPage || totalPage === 0}
            onClick={onNext}
          >
            <svg
              className={
                currentPage === totalPage || totalPage === 0
                  ? buttonNotHover
                  : buttonHover
              }
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DatatableFooter;
