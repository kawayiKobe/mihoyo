import {React} from "react"
import Loadable from 'react-loadable';
import MyLoadingComponent from "./loading";

 const AsyncHome = Loadable({
    loader: () => import('../components/PictureWall'),
    loading: <div>loading...</div>
});

export default AsyncHome;