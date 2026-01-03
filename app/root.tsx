import { type JSX } from "react";
import { isRouteErrorResponse, Outlet, useRouteError } from "react-router-dom";
import { Header } from "./components/Header/Header";
import "./styles/globals.scss";

export default function App(): JSX.Element {
    return (
        <>
        <Header />
        <main>
            <Outlet />
        </main>
        </>
    );
}

export function ErrorBoundary(): JSX.Element {
    const error = useRouteError();
    let title = "Oops!";
    let details = "Unexpected error.";
    if (isRouteErrorResponse(error)) {
        title = error.status === 404 ? "404" : "Error";
        details = error.status === 404 ? "Page not found." : error.statusText || details;
    } else if (import.meta.env.DEV && error instanceof Error) {
        details = error.message;
    }
    return (
        <>
        <Header />
        <main className="error-page">
            <h1 className="error-page__title">{title}</h1>
            <p className="error-page__details">{details}</p>
        </main>
        </>
    );
}
