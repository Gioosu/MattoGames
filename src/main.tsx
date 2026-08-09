import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Home.tsx";
import StartingImpostor from "./games/Impostor/StartingImpostor.tsx";
import PlayingImpostor from "./games/Impostor/PlayingImpostor.tsx";
import Wavelength from "./games/Wavelength/Wavelength.tsx";
import Psychologist from "./games/Psychologist/Psychologist.tsx";
import StartingWerewolf from "./games/Werewolf/StartingWerewolf.tsx";
import PlayingWerewolf from "./games/Werewolf/PlayingWerewolf.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/impostor" element={<StartingImpostor />} />
                <Route path="/impostor/play" element={<PlayingImpostor />} />
                <Route path="/wavelength" element={<Wavelength />} />
                <Route path="/psychologist" element={<Psychologist />} />
                <Route path="/werewolf" element={<StartingWerewolf />} />
                <Route path="/werewolf/play" element={<PlayingWerewolf />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);