import React from "react";
import { Outlet } from "react-router-dom";

export const SearchLayout: React.FC = () => (
  <>
    {/* SubTopbar */}
    <div></div>

    {/*Content */}
    <div>
      {/* Filter Sidebar */}
      <div></div>
      {/* Main Content */}
      <div>
        <Outlet />
      </div>
    </div>
  </>
);
