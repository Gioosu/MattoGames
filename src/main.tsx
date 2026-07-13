import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Home.tsx";
import StartingImpostor from "./games/Impostor/StartingImpostor.tsx";
import PlayingImpostor from "./games/Impostor/PlayingImpostor.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/impostor" element={<StartingImpostor />} />
        <Route path="/impostor/play" element={<PlayingImpostor />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);