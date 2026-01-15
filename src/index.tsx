import { VFC } from "react";
import {
  definePlugin,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { FaMicrophone } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = () => {
  return null;
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Decky Mic Boost</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaMicrophone />,
  };
});