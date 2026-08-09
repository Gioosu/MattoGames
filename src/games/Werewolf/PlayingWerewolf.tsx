import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ImpostorSettings } from "./StartingWerewolf";

const PlayingImpostor = () => {
  const location = useLocation();
  const navigate = useNavigate();


  return (
    <div
      className="min-h-screen bg-ink flex flex-col items-center px-5 pb-10"
      style={{
        paddingTop: "max(2.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
      }}
    >
      <header className="relative flex flex-col items-center text-center gap-2 mb-8 w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-0 top-1 font-body text-sm text-muted hover:text-cream transition"
        >
          ← Home
        </button>
        
      </header>
      </div>
  );
};

export default PlayingImpostor;