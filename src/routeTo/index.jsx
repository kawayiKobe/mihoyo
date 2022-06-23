import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PictureUpload from "../components/PictureUpload";
import Loadable from '../utils/async';
const PcitureWall = Loadable(() => import('../components/PictureWall'));
const PictureManage = Loadable(() => import('../components/PictureManage'));

function RouteTo() {
  return (
    <Switch>
      <Route path="/main/picture-wall" component={PcitureWall} />
      <Route path="/main/picture-upload" component={PictureUpload} />
      <Route path="/main/picture-manage" component={PictureManage} />
      <Redirect to="/main/picture-wall" />
    </Switch>
  );
}

export default RouteTo;
