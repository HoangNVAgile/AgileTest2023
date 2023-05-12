
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Home = dynamic(() => import('@components/Home/Home'))

const HomePage = () => {
  return (
    <>
      <Home />
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common','home'])),
      // Will be passed to the page component as props
    },
  };
}


export default HomePage;
