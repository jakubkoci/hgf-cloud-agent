import { createTheme, NextUIProvider } from '@nextui-org/react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    type: 'light', // it could be "light" or "dark"
    theme: {
      colors: {
        // brand colors
        primaryLight: '$green200',
        primaryLightHover: '$green300',
        primaryLightActive: '$green400',
        primaryLightContrast: '$green600',
        primary: '#48b86d',
        primaryBorder: '$green500',
        primaryBorderHover: '$green600',
        primarySolidHover: '$green700',
        primarySolidContrast: '$white',
        primaryShadow: '$green500',

        gradient: 'linear-gradient(112deg, $green700, $blue500)',
        link: '#5E1DAD',

        // you can also create your own color
        myColor: '#ff4ecd',

        // ...  more colors
      },
      space: {},
      fonts: {},
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NextUIProvider>
    </QueryClientProvider>
  )
}

export default MyApp
