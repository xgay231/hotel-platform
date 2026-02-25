import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { RouterProvider } from "react-router-dom";
import router from "@/router";
import appTheme from "@/styles/theme";

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={appTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
