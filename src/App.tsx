import './App.css'
import RootPages from './pages/_RootPages'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './themes'

function App() {
  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        <RootPages />
      </ChakraProvider>
    </div>
  )
}

export default App
