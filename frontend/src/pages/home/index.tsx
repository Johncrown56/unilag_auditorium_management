import Hero from "../../components/hero";
import Features from "../../components/features";
import Stats from "../../components/stats";
import Intro from "../../components/intro";
import Features2 from "../../components/features2";
import Banner from "../../components/banner";
import Features3 from "../../components/features3";

const Home = () => {
  return (
    <>
      {/* <Hero /> */}
      <Banner />
      <Stats />
      {/* <Features />       */}
      <Intro />
      <Features2 />
      <Features3 />
    </>
  );
};

export default Home;
