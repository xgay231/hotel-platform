import { useEffect } from "react";
import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { RouterProvider } from "react-router-dom";
import router from "@/router";
import appTheme from "@/styles/theme";
import { setGlobalMessage } from "@/services/notify";

const GlobalMessageBinder = () => {
  const { message } = AntdApp.useApp();

  useEffect(() => {
    setGlobalMessage(message);
    return () => setGlobalMessage(null);
  }, [message]);

  return null;
};

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={appTheme}>
      <AntdApp>
        <GlobalMessageBinder />
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
