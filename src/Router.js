import { Routes, Route } from "react-router-dom";
import App from "./App";
import Auth from "./components/Auth";
import NotFound from "./components/NotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="calendar" element={<App />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
