import React from "react";
import { Footer } from "./Footer";
import { Navbar } from "./navbar";

type Props = {
  footer?: boolean;
  children: React.ReactElement | React.ReactElement[];
};

export function Layout({ footer, children }: Props) {
  return (
    <>
      <Navbar />
      <div className="@relative mainContainer">
        <main className="@flex @flex-col @w-full @items-center @justify-center mainHeight">
          {children}
        </main>
      </div>
      {(footer != undefined && footer) && <Footer />}
    </>
  );
}
