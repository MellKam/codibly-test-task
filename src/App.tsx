import { Box } from "@mui/material"
import { ProductTable } from "./components/ProductTable"
import { ProductSearchInput } from "./components/ProductSearchInput"
import { ProductSearchFormProvider } from "./contexts/ProductSearchFormContext"

export const App = () => {
  return (
    <Box maxWidth='800px' display='flex' mx='auto' flexDirection='column'>
      <ProductSearchFormProvider>
        <ProductSearchInput />
        <Box mt='8px' component="main">
          <ProductTable />
        </Box>
      </ProductSearchFormProvider>
    </Box>
  )
}
