import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ApolloProvider } from '@apollo/client'
import { client } from './apolloClient.ts'
import { MantineProvider } from '@mantine/core'
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </ApolloProvider>
  </StrictMode>
)
