import moment from "moment";
import React from "react";
import {
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedin,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

type Props = {};

const BottomBar = (props: Props) => {
  const year = moment().format("YYYY");
  return (
    <footer className="bg-white rounded-lg shadow sm:flex sm:items-center sm:justify-between p-4 sm:p-6 xl:p-8 dark:bg-gray-800 antialiased">
      <p className="mb-4 text-sm text-center text-gray-500 dark:text-gray-400 sm:mb-0">
        &copy; {year}{" "}
        <a
          href="https://uiams.unilag.edu.ng/"
          className="hover:underline"
          target="_blank"
        >
          Unilag.edu.ng
        </a>
        . All rights reserved.
      </p>
      <div className="flex justify-center items-center space-x-1">
        <a
          href="#"
          className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <BiLogoFacebook className="w-4 h-4" />
          <span className="sr-only">Facebook</span>
        </a>
        <div
          id="tooltip-facebook"
          role="tooltip"
          className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
        >
          Like us on Facebook
          <div className="tooltip-arrow"></div>
        </div>
        <a
          href="#"
          className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <FaXTwitter className="w-4 h-4" />
          <span className="sr-only">Twitter</span>
        </a>
        <div
          id="tooltip-twitter"
          role="tooltip"
          className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
        >
          Follow us on Twitter
          <div className="tooltip-arrow"></div>
        </div>
        <a
          href="#"
          className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <BiLogoInstagram className="w-4 h-4" />
          <span className="sr-only">Instagram</span>
        </a>
        <div
          id="tooltip-github"
          role="tooltip"
          className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
        >
          Follow us on Instagram
          <div className="tooltip-arrow"></div>
        </div>
        <a
          href="#"
          className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <BiLogoLinkedin className="w-4 h-4" />
          <span className="sr-only">Linkedin</span>
        </a>
        <div
          id="tooltip-dribbble"
          role="tooltip"
          className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
        >
          Follow us on Linkedin
          <div className="tooltip-arrow"></div>
        </div>
      </div>
    </footer>
  );
};

export default BottomBar;
