import { Outlet } from "react-router-dom";

export const MainLayout: React.FC = () => (
  <div>
    {/* MainTopbar */}
    <div></div>

    {/* Content */}
    <Outlet />
  </div>
);
