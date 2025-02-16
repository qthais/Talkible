import { useState } from 'react'
import './App.css'
import { Card, MantineProvider, Text } from '@mantine/core'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <MantineProvider>
    <Card>
      <Text italic>hallo</Text>
    </Card>
    </MantineProvider>
    </>
  )
}

export default App
