import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode as ReactStrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import { SearchParamsProvider } from "./contexts/SearchParamsContext"
import "./index.css"

const queryClient = new QueryClient()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <ReactStrictMode>
    <QueryClientProvider client={queryClient}>
      <SearchParamsProvider>
        <App />
      </SearchParamsProvider>
    </QueryClientProvider>
  </ReactStrictMode>
)
