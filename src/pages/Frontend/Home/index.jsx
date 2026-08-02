import React from "react";
import Hero from "./Hero";
import PopularProducts from "./PopularProducts";
import Specifications from "./Specifications";

const Home = () => {
  return (
    <main>
      <Hero />
      <PopularProducts />
      <Specifications />
    </main>
  );
};

export default Home;