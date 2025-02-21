
import './App.css'
import { Card, MantineProvider, Text } from '@mantine/core'

function App() {

  return (
    <>
    <MantineProvider>
    <Card>
      <Text className='text-red-600 text-3xl !important' italic>hallo</Text>
    </Card>
    </MantineProvider>
    </>
  )
}

export default App
