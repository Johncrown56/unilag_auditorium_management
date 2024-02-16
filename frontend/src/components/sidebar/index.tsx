import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../../assets/imgs/unilag-white-text.png";
import SidebarLinkGroup from "./linkGroup";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { RootState } from "../../store/store";
import { menus } from "../../utils/constant";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useSelector((state: RootState) => state.auth);
  const { firstName, role } = user;

  const filteredMenus = menus.filter(
    (menu) => role === "user" && menu.name !== "Admin"
  );
  console.log(filteredMenus);

  //setFilteredSections(filteredMenus);

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-primary-700 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-2">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white"
        >
          <MdClose className="w-5 h-5 text-white" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-2 lg:px-6">
          {/* <!-- Menu Group --> */}
          {(role === "user" ? filteredMenus : menus).map(
            (m: any, id: number) => (
              <div key={id}>
                {role === "admin" && m.name !== "" && (
                  <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                    {m.name}
                  </h3>
                )}

                <ul className="mb-2 flex flex-col gap-1.5">
                  {m.section.map((menu: any, i: number) => (
                    <Fragment key={i}>
                      {menu.submenus != undefined &&
                      menu.submenus.length > 0 ? (
                        <SidebarLinkGroup
                          activeCondition={
                            pathname === menu.link ||
                            pathname.includes(menu.link)
                          }
                        >
                          {(handleClick, open) => {
                            return (
                              <>
                                <Link
                                  to={menu.link}
                                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
                                ${
                                  (pathname === menu.link ||
                                    pathname.includes(menu.link)) &&
                                  "bg-graydark dark:bg-meta-4"
                                }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    sidebarExpanded
                                      ? handleClick()
                                      : setSidebarExpanded(true);
                                  }}
                                >
                                  {menu.icon}
                                  {menu.name}
                                  <svg
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                      open && "rotate-180"
                                    }`}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                      fill=""
                                    />
                                  </svg>
                                </Link>

                                <div
                                  className={`translate transform overflow-hidden ${
                                    !open && "hidden"
                                  }`}
                                >
                                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                    {menu.submenus.map(
                                      (submenu: any, ix: number) => (
                                        <li key={ix}>
                                          <Link
                                            to={submenu.link}
                                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white 
                                      ${
                                        pathname === submenu.link &&
                                        "text-white"
                                      } `}
                                          >
                                            {submenu.name}
                                          </Link>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                                {/* <!-- Dropdown Menu End --> */}
                              </>
                            );
                          }}
                        </SidebarLinkGroup>
                      ) : (
                        <li>
                          <Link
                            to={menu.link}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              pathname.includes(menu.link) &&
                              "bg-graydark dark:bg-meta-4"
                            }`}
                          >
                            {menu.icon}
                            {menu.name}
                            {menu.count != undefined && menu.count > 0 && (
                              <span className="absolute right-14 top-1/2 -translate-y-1/2 rounded bg-primary-600 py-1 px-2.5 text-xs font-medium text-white">
                                {menu.count}
                              </span>
                            )}
                            {menu.badge != undefined && menu.badge !== "" && (
                              <span className="absolute right-4 block rounded bg-primary-600 py-1 px-2 text-xs font-medium text-white">
                                {menu.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      )}
                    </Fragment>
                  ))}
                </ul>
              </div>
            )
          )}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
