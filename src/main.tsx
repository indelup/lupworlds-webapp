import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Login } from "./views/login/Login.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <Login />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
