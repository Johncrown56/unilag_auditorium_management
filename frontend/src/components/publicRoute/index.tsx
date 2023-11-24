import React from "react";
import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router-dom";

type Props = {};

const PublicRoute = (props: Props) => {
  return (
    <main>
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </main>
  );
};

export default PublicRoute;
