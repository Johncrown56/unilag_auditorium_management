import React from "react";
import { IResponseType } from "../../utils/interfaces";

type Props = {
  type: IResponseType;
};

const ModalHeader = (props: Props) => {
  const { type } = props;
  return (
    <div>
      <span className="mx-auto inline-block">
        {type === "success" ? (
          <div className="mx-auto flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-success-100 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              aria-hidden="true"
              className="h-12 w-12 text-success-500"
            >
              <path
                strokeLinecap="round"
                stroke-linejoin="round"
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
  );
};

export default ModalHeader;
