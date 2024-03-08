import { IResponseType } from "../../utils/interfaces";

type Props = {
  type?: IResponseType;
  setShowModal: (value: boolean) => void;
};

const ModalHeader = (props: Props) => {
  const { type, setShowModal } = props;
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-xl"> </div>
        <button type="button" className="end-2.5 text-black bg-transparent hover:bg-primary-600 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => setShowModal(false)}>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>
      {type && (
        <div>
          <span className="mx-auto inline-block">
            {type === "success" ? (
              <div className="mx-auto flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-success-100 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-12 w-12 text-success-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
            ) : type === "error" ? (
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  opacity="0.1"
                  width="60"
                  height="60"
                  rx="30"
                  fill="#DC2626"
                ></rect>
                <path
                  d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z"
                  stroke="#DC2626"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ) : (
              <></>
            )}
          </span>
        </div>
      )}
    </>
  );
};

export default ModalHeader;
