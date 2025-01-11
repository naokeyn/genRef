import { useState } from 'react'
import { HStack, Spacer } from '@chakra-ui/react'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HStack>
        <Button onClick={() => setCount(count + 1)}>Increment</Button>
        <Spacer />
        <Button onClick={() => setCount(count - 1)}>Decrement</Button>
      </HStack>
      <HStack>
        <p>
          Count: {count}
        </p>
      </HStack>
    </>
  )
}

export default App
