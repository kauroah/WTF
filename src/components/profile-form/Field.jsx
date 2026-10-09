import React from "react";

export default function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-mono text-muted-foreground">{label}</label>
      {children}
      {hint && !error && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
      {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}