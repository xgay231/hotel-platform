import { Button, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ padding: 20 }}>
        <h1>Hello</h1>
        <Button type="primary">按钮</Button>
      </div>
    </ConfigProvider>
  );
}

export default App;
