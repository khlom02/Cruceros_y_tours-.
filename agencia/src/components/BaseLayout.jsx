import React, { useEffect } from "react";
import Header from "./header.jsx";
import Footer from "./footer.jsx";

const BaseLayout = ({ children, title = "TIENDA ONLINE" }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      
      <main className="container py-5">{children}</main>
      
    </>
  );
};

export default BaseLayout;
