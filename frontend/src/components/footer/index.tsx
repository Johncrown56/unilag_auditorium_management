import React from "react";
import logo from "../../assets/imgs/unilag-logo-text.png";
import moment from "moment";
import { BiLogoFacebook, BiLogoInstagram, BiLogoTwitter } from "react-icons/bi";

type Props = {};

const Footer = (props: Props) => {
  const year = moment().format("YYYY");
  return (
    <footer className="relative z-10 py-20 bg-white dark:bg-black-dark bg-white dark:bg-black-dark">
      <div className="mx-auto max-w-292.5 px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-10 xl:justify-between">
          <div className="max-w-100">
            <div>
              <a className="mb-7.5 inline-block" href="/">
                <img className="dark:hidden" src={logo} alt="Logo Light" />
                <img className="hidden dark:block" src={logo} alt="Logo Dark" />
              </a>
              <p>UNILAG Auditorium Management System</p>
              <p className="mt-10 mb-0.5">
                © {year} University Auditorium Commitee - All Rights Reserved.
              </p>
              <div className="mt-4 flex items-center gap-2.5"></div>

              {/* <!-- Social Links --> */}
              <div className="mt-1">
                <ul className="flex items-center gap-5.5">
                  <li>
                    <a
                      target="_blank"
                      rel="nofollow"
                      className="hover:text-black"
                      href="#"
                    >
                      <BiLogoFacebook className="h-5 w-5 fill-current" />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      rel="nofollow"
                      className="hover:text-black"
                      href="#"
                    >
                      <BiLogoTwitter className="h-5 w-5 fill-current" />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      rel="nofollow"
                      className="hover:text-black"
                      href="#"
                    >
                      <BiLogoInstagram className="h-5 w-5 fill-current" />
                    </a>
                  </li>
                </ul>
              </div>
              {/* <!-- Social Links --> */}
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div>
              <h4 className="mb-7.5 text-lg font-medium text-black dark:text-white">
                Useful Links
              </h4>

              <ul className="flex flex-col gap-3">
                <li>
                  <a className="hover:text-primary-500" target="_blank" href="">
                    Documentation
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-500" href="">
                    Download Pro Update
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-500" href="download">
                    Download
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-500" href="">
                    Update Logs
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-500" href="">
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div>
              <h4 className="mb-7.5 text-lg font-medium text-black dark:text-white">
                About
              </h4>

              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    className="hover:text-primary-500"
                    rel="nofollow noopener"
                    target="_blank"
                    href=""
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary-500"
                    rel="nofollow noopener"
                    target="_blank"
                    href=""
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-500" href="">
                    FAQ
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-500" href="/contact-us">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-81.5">
            <div>
              <h4 className="mb-7.5 text-lg font-medium text-black dark:text-white">
                Subscribe
              </h4>
              <p>Subscribe to our newsletter for the latest updates</p>

              <form
                className="mt-6"
                action=""
                method="POST"
                acceptCharset="utf-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-full">
                    <input
                      type="email"
                      name="email"
                      id="footeremail"
                      placeholder="Enter your email"
                      className="bg-gray-50 w-full rounded-md border border-stroke py-2.5 px-5 text-black-4 outline-none focus:border-primary-500 dark:border-form-stroke-dark dark:bg-form-input dark:focus:border-primary-500 bg-gray-50"
                    />
                  </div>
                  <button
                    type="submit"
                    name="submit"
                    id="submit"
                    className="flex h-11.5 w-full max-w-11.5 items-center justify-center rounded-md bg-primary-700 text-white"
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.6357 13.6701L18.3521 8.5208C19.8516 4.02242 20.6013 1.77322 19.414 0.585953C18.2268 -0.601315 15.9776 0.148415 11.4792 1.64788L6.32987 3.36432C2.69923 4.57453 0.883919 5.17964 0.368059 6.06698C-0.122686 6.91112 -0.122686 7.95369 0.368058 8.79783C0.883919 9.68518 2.69923 10.2903 6.32987 11.5005C6.77981 11.6505 7.28601 11.5434 7.62294 11.2096L13.1286 5.75495C13.4383 5.44808 13.9382 5.45041 14.245 5.76015C14.5519 6.06989 14.5496 6.56975 14.2398 6.87662L8.82312 12.2432C8.45175 12.6111 8.3342 13.1742 8.49951 13.6701C9.70971 17.3007 10.3148 19.1161 11.2022 19.6319C12.0463 20.1227 13.0889 20.1227 13.933 19.6319C14.8204 19.1161 15.4255 17.3008 16.6357 13.6701Z"
                        fill=""
                      ></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
