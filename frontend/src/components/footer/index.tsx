import React from "react";
import logo from "../../assets/imgs/unilag-logo-text.png";
import moment from "moment";

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
              <p>UNILAG Integrated Auditoria Management System</p>
              <p className="mt-10 mb-0.5">
                © {year} U-IAMS - All Rights Reserved.
              </p>
              <div className="mt-4 flex items-center gap-2.5"></div>

              {/* <!-- Social Links --> */}
              <div className="mt-9">
                <ul className="flex items-center gap-5.5">
                  <li>
                    <a
                      target="_blank"
                      rel="nofollow"
                      className="hover:text-black"
                      href="#"
                    >
                      <svg
                        className="h-5 w-5 fill-current"
                        viewBox="0 0 640 512"
                      >
                        <path d="M524.5 69.84a1.5 1.5 0 0 0 -.764-.7A485.1 485.1 0 0 0 404.1 32.03a1.816 1.816 0 0 0 -1.923 .91 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.14-30.6 1.89 1.89 0 0 0 -1.924-.91A483.7 483.7 0 0 0 116.1 69.14a1.712 1.712 0 0 0 -.788 .676C39.07 183.7 18.19 294.7 28.43 404.4a2.016 2.016 0 0 0 .765 1.375A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.063-.676A348.2 348.2 0 0 0 208.1 430.4a1.86 1.86 0 0 0 -1.019-2.588 321.2 321.2 0 0 1 -45.87-21.85 1.885 1.885 0 0 1 -.185-3.126c3.082-2.309 6.166-4.711 9.109-7.137a1.819 1.819 0 0 1 1.9-.256c96.23 43.92 200.4 43.92 295.5 0a1.812 1.812 0 0 1 1.924 .233c2.944 2.426 6.027 4.851 9.132 7.16a1.884 1.884 0 0 1 -.162 3.126 301.4 301.4 0 0 1 -45.89 21.83 1.875 1.875 0 0 0 -1 2.611 391.1 391.1 0 0 0 30.01 48.81 1.864 1.864 0 0 0 2.063 .7A486 486 0 0 0 610.7 405.7a1.882 1.882 0 0 0 .765-1.352C623.7 277.6 590.9 167.5 524.5 69.84zM222.5 337.6c-28.97 0-52.84-26.59-52.84-59.24S193.1 219.1 222.5 219.1c29.67 0 53.31 26.82 52.84 59.24C275.3 310.1 251.9 337.6 222.5 337.6zm195.4 0c-28.97 0-52.84-26.59-52.84-59.24S388.4 219.1 417.9 219.1c29.67 0 53.31 26.82 52.84 59.24C470.7 310.1 447.5 337.6 417.9 337.6z"></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      rel="nofollow"
                      className="hover:text-black"
                      href="#"
                    >
                      <svg viewBox="0 0 19 15" className="h-5 w-5 fill-current">
                        <path d="M16.3024 3.19777L17.375 1.9649C17.6855 1.63099 17.7702 1.37414 17.7984 1.24572C16.9516 1.70805 16.1613 1.86216 15.6532 1.86216H15.4556L15.3427 1.75942C14.6653 1.22003 13.8185 0.9375 12.9153 0.9375C10.9395 0.9375 9.3871 2.42723 9.3871 4.14812C9.3871 4.25086 9.3871 4.40497 9.41532 4.50771L9.5 5.0214L8.90726 4.99572C5.29435 4.89298 2.33065 2.06764 1.85081 1.57962C1.06048 2.86387 1.5121 4.09675 1.99194 4.86729L2.95161 6.30565L1.42742 5.5351C1.45565 6.61387 1.90726 7.46147 2.78226 8.07791L3.54435 8.59161L2.78226 8.87415C3.2621 10.1841 4.33468 10.7235 5.125 10.9289L6.16935 11.1858L5.18145 11.8022C3.60081 12.8296 1.625 12.7526 0.75 12.6755C2.52823 13.8057 4.64516 14.0625 6.1129 14.0625C7.21371 14.0625 8.03226 13.9598 8.22984 13.8827C16.1331 12.1875 16.5 5.76627 16.5 4.48202V4.30223L16.6694 4.19949C17.629 3.37757 18.0242 2.94092 18.25 2.68408C18.1653 2.70976 18.0524 2.76113 17.9395 2.78682L16.3024 3.19777Z"></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      rel="nofollow"
                      className="hover:text-black"
                      href="#"
                    >
                      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
                        <path d="M16 4.55078C9.625 4.55078 4.375 9.72578 4.375 16.1758C4.375 21.2758 7.7125 25.6258 12.3625 27.2008C12.9625 27.3133 13.15 26.9383 13.15 26.6758C13.15 26.4133 13.15 25.6633 13.1125 24.6508C9.8875 25.4008 9.2125 23.0758 9.2125 23.0758C8.6875 21.7633 7.9 21.3883 7.9 21.3883C6.85 20.6383 7.9375 20.6383 7.9375 20.6383C9.1 20.6758 9.7375 21.8383 9.7375 21.8383C10.75 23.6383 12.475 23.1133 13.1125 22.7758C13.225 22.0258 13.525 21.5008 13.8625 21.2008C11.3125 20.9383 8.575 19.9258 8.575 15.5008C8.575 14.2258 9.0625 13.2133 9.775 12.4258C9.6625 12.1633 9.25 10.9633 9.8875 9.35078C9.8875 9.35078 10.9 9.05078 13.1125 10.5508C14.05 10.2883 15.025 10.1383 16.0375 10.1383C17.05 10.1383 18.0625 10.2508 18.9625 10.5508C21.175 9.08828 22.15 9.35078 22.15 9.35078C22.7875 10.9258 22.4125 12.1633 22.2625 12.4258C23.0125 13.2133 23.4625 14.2633 23.4625 15.5008C23.4625 19.9258 20.725 20.9383 18.175 21.2008C18.5875 21.5758 18.9625 22.3258 18.9625 23.3758C18.9625 24.9508 18.925 26.1883 18.925 26.5633C18.925 26.8633 19.15 27.2008 19.7125 27.0883C24.2875 25.5508 27.625 21.2383 27.625 16.1008C27.5875 9.72578 22.375 4.55078 16 4.55078Z"></path>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
              {/* <!-- Social Links --> */}
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div>
              <h4 className="mb-7.5 text-custom-lg font-medium text-black dark:text-white">
                Useful Links
              </h4>

              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    className="hover:text-primary"
                    target="_blank"
                    href="https://docs.tailadmin.com"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary"
                    href="https://app.lemonsqueezy.com/my-orders"
                  >
                    Download Pro Update
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="download">
                    Download
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary"
                    href="https://docs.tailadmin.com/update-logs"
                  >
                    Update Logs
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="license.html">
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div>
              <h4 className="mb-7.5 text-custom-lg font-medium text-black dark:text-white">
                About
              </h4>

              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    className="hover:text-primary"
                    rel="nofollow noopener"
                    target="_blank"
                    href="https://uideck.com/privacy-policy/"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary"
                    rel="nofollow noopener"
                    target="_blank"
                    href="https://uideck.com/refund-policy/"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary"
                    href="https://pimjo.com/discord"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="support">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-81.5">
            <div>
              <h4 className="mb-7.5 text-custom-lg font-medium text-black dark:text-white">
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
