import React from "react";

export default function ErrorNote({ children }) {
  return (
    <p role="alert" className="mt-6 border-l-2 border-danger pl-4 text-sm text-danger">
      {children}
    </p>
  );
}