import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PcitureWall from "../components/PictureWall";
import PictureUpload from "../components/PictureUpload";
import PictureManage from "../components/PictureManage";

function RouteTo() {
  return (
    <Switch>
      <Route path="/main/picture-wall" component={PcitureWall} />
      <Route path="/main/picture-upload" component={PictureUpload} />
      <Route path="/main/picture-manage" component={PictureManage} />
      <Redirect to="/main/pictur-wall" />
    </Switch>
  );
}

export default RouteTo;
