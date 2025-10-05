import { ConfigProvider, theme } from "antd";
import App from "./app";

export default function Home() {
  return(
    <ConfigProvider
    theme={{algorithm: theme.darkAlgorithm}}>
      <App />
    </ConfigProvider>
)}
