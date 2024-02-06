import {  useState } from "react";
import { Dialog, Popover } from "@headlessui/react";
import {
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";
import logo from "../../assets/imgs/unilag-logo-text.png";
import logoWhite from "../../assets/imgs/unilag-white-text.png";
import { Link } from "react-router-dom";
import { topBarMenu } from "../../utils/constant";
import SmallLogo from "../../assets/imgs/unilag_logo.png"
import PublicDarkModeSwitch from "../darkModeSwitch/public";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">UNILAG</span>
            <img className="w-auto block dark:hidden" src={logo} alt="Unilag_logo" />
            <img className="w-auto hidden dark:block" src={logoWhite} alt="Unilag_logo_white" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <HiOutlineBars3 className={`${mobileMenuOpen ? "hidden" : ""} h-6 w-6`} aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          {topBarMenu.map((m, i)=> (
            <Link key={i} to={m.link} className="text-sm font-semibold leading-6 text-indigo-900 hover:text-indigo-600 dark:text-white dark:hover:text-primary-600">
            {m.name}
          </Link>
          ))}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-2">
          <Link
            to="/login"
            className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
          <PublicDarkModeSwitch />
        </div>        
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only"></span>
              <img
                className="h-8 w-auto"
                src={SmallLogo}
                alt=""
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {topBarMenu.map((m, i)=> (
                  <Link key={i} to={m.link}  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-indigo-900 hover:bg-gray-50 dark:text-white">
                  {m.name}
                </Link>
                ))}                
              </div>
              <div className="py-6">
                <Link
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-indigo-900 hover:bg-gray-50 dark:text-white "
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
