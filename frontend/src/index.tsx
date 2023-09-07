import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CookiesProvider } from 'react-cookie';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import WelcomePage from "./pages/WelcomePage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import LoginRoute from "./components/LoginRoute";
import RegisterPage from "./pages/RegisterPage";
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "",
				element: <WelcomePage />,
			},
			{
				path: "search/",
				element: <SearchPage />,
			},
			{
				path: "login/",
				element: <LoginRoute><LoginPage/></LoginRoute>,
			},
			{
				path: "register/",
				element: <LoginRoute><RegisterPage/></LoginRoute>,
			}
		],
	},
]);


const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<CookiesProvider defaultSetOptions={{ path: '/' }}>
			<RouterProvider router={router}></RouterProvider>
		</CookiesProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
