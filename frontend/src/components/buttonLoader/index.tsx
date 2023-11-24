import React from "react";
import PropTypes from "prop-types";
import Loader from "./Loader";

type Props = {
  isLoading: boolean;
  text: string;
  loadingText: string;
};

const ButtonLoader = (props: Props) => {
  const { isLoading, text, loadingText } = props;
  return (
    <>
      {isLoading ? (
        <>
          <Loader text={loadingText != undefined ? loadingText : undefined} />
        </>
      ) : (
        <span>{text}</span>
      )}
    </>
  );
};

ButtonLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  loadingText: PropTypes.string,
};

export default ButtonLoader;
