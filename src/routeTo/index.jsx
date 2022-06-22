import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PcitureWall from "../components/PictureWall";
import PictureUpload from "../components/PictureUpload";
import PictureManage from "../components/PictureManage";
import AsyncHome from "../utils/async";

function RouteTo() {
  return (
    <Switch>
      <Route path="/main/picture-wall" component={ AsyncHome} />
      <Route path="/main/picture-upload" component={PictureUpload} />
      <Route path="/main/picture-manage" component={PictureManage} />
      <Redirect to="/main/picture-wall" />
    </Switch>
  );
}

export default RouteTo;
