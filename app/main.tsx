import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App, { ErrorBoundary } from "./root";

import HomePage from "./pages/Home/HomePage";

import "~/styles/globals.scss";
import FlatPage from "./pages/Flats/FlatPage/FlatPage";
import FlatsPage from "./pages/Flats/FlatsPage/FlatsPage";

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} errorElement={<ErrorBoundary />}>
            <Route index element={<HomePage />} />

            <Route path="flats" element={<FlatsPage />} />
            <Route path="flats/:id" element={<FlatPage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
