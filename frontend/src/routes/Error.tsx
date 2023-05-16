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
      <h1 className="text-xl text-white font-bold">
        PAGE NOT FOUND<span className="text-xl">&#128549;</span>
      </h1>
    </div>
  );
}
