import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function LinkResetPageWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    // console.log("Route changed:", location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
}

export default React.memo(LinkResetPageWrapper);