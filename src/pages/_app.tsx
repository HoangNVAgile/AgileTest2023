import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next';
import nextI18nConfig from '../../next-i18next.config';
import ErrorBoundary from '@components/ErrorBoundary';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  );
}

export default appWithTranslation(MyApp, nextI18nConfig);
