import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { RecoilRoot } from "recoil";
import { lightTheme } from "./theme";
import { QueryClient, QueryClientProvider } from "react-query";
import firebase from "./fbase";
import '@fortawesome/fontawesome-free/css/all.min.css';
// console.log(firebase);
const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={lightTheme}>
					<App />
				</ThemeProvider>
			</QueryClientProvider>
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById("root")
);
