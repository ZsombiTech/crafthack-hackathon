import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return (
    <div className="w-full flex justify-center mt-4">
      <h1>Error</h1>
    </div>
  );
}
