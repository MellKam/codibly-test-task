import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode as ReactStrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { SearchParamsProvider } from "./hooks/useSearchParams";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<ReactStrictMode>
		<QueryClientProvider client={queryClient}>
			<SearchParamsProvider>
				<App />
			</SearchParamsProvider>
		</QueryClientProvider>
	</ReactStrictMode>
);
