import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Login } from "./views/login/Login.tsx";
import { ModeSelection } from "./views/mode/ModeSelection.tsx";
import { ViewerApp } from "./views/viewer/ViewerApp.tsx";
import { StreamerApp } from "./views/streamer/StreamerApp.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/mode",
        element: <ModeSelection />,
    },
    {
        path: "/viewer",
        element: <ViewerApp />,
    },
    {
        path: "/streamer",
        element: <StreamerApp />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
