import { Fragment } from "react";
import Encabezado from "./navbar/Encabezado";

const Layout = (props) => {
  return (
    <Fragment>
      <Encabezado />
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
