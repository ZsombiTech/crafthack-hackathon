import React from "react";

export default function LoadingFullPage() {
  return (
    <div className="w-full h-screen top-0 left-0 opacity-50 fixed bg-dark-light flex justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
