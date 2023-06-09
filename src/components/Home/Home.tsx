import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { GoogleMap, useLoadScript, Marker, Circle } from "@react-google-maps/api";

import styles from '@/styles/Home.module.css';
import { useAuth } from '@/store/auth/useAuth';
import { useGetPosts, useLogin } from './service';
import { getAccessToken } from '@/store/auth';
import { ENV } from '@utils/env';

interface IMarkder {
  lat: number;
  lng: number;
}

const inter = Inter({ subsets: ['latin'] })

const Home = () => {
  const isLoggedIn = !!getAccessToken();
  const [loginStatus, setLoginStatus] = useState(isLoggedIn ? 'Logged in!' : 'Not log in!');
  const { onLogin, onLogout } = useAuth();
  const { dataPosts, run: runGetPosts } = useGetPosts();
  const [marker, setMarker] = useState<IMarkder>();

  const onMapClick = (e: any) => {
    setMarker(
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    );
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: ENV.GOOGLE_MAP_API_KEY,
  });

  const { t } = useTranslation('home');
  const router = useRouter();
  const currentLang = router.locale;

  const onChangeLang = (lang: string) => () => {
    if (lang !== currentLang) {
      router.push(router.pathname, router.asPath, {
        locale: lang,
      });
    }
  };

  const onSubmitLogin = () => {
    requestLogin.run();
  };


  const requestLogin = useLogin({
    onSuccess: (res: any) => {
      if (res?.accessToken) {
        onLogin({
          token: res?.accessToken,
          refreshToken: res?.refreshToken,
        });
        setLoginStatus('Logged in!');
      }
    },
    onError(e) {
      setLoginStatus(e?.errors?.[0] || e?.message);
    },
  });

  const onGetPosts = () => {
    runGetPosts()
  };

  const onSubmitLogout = () => {
    onLogout();
    setLoginStatus('Not log in!');
    runGetPosts();
  };


  if (!isLoaded) return null;
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <div className={styles.languageContainer}>
            <div onClick={onChangeLang('vi')} className={styles.languageText}>{t('lang_vi')}</div>
            <div onClick={onChangeLang('en')} className={styles.languageText}>{t('lang_en')}</div>
          </div>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}>
          <a
            className={styles.card}
            onClick={onSubmitLogin}
          >
            <h2>
              {t('login')} <span>-&gt;</span>
            </h2>
            <p>
              {t('login_container_content')}
            </p>
          </a>

          <a
            className={styles.card}
            onClick={onGetPosts}
          >
            <h2>
              {t('get_posts')} <span>-&gt;</span>
            </h2>
            <p>
              {t('get_posts_container_content')}
            </p>
          </a>

          <a
            className={styles.card}
            onClick={onSubmitLogout}
          >
            <h2>
              {t('log_out')} <span>-&gt;</span>
            </h2>
            <p>
              {t('log_out_container_content')}
            </p>
          </a>
        </div>

        <div className={styles.contentContainer}>
          <p>{loginStatus}</p>
          {isLoggedIn && dataPosts?.posts.map((item: any, index: number) => (
            <>
              Post {index}: {item.title}
              <br />
            </>
          ))}
        </div>

        <GoogleMap zoom={10} center={marker || { lat: 21.019031654681395, lng: 105.83697505428268 }} mapContainerClassName={styles.mapContainer} onClick={onMapClick}>
          {marker && (
            <>
              <Marker
                position={{
                  lat: marker.lat,
                  lng: marker.lng
                }} />
              <Circle
                center={marker}
                radius={5000}
                onLoad={() => console.log('Circle Load...')}
                options={{
                  fillColor: 'red',
                  strokeColor: 'red',
                  strokeOpacity: 0.8,
                }}
              />
            </>
          )}
        </GoogleMap>
      </main>
    </>
  );
};

export default Home;
