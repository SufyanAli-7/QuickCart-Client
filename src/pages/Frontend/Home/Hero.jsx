import React, { useState, useEffect } from "react";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import headphoneImg from "@/assets/header_headphone_image.png";
import playstationImg from "@/assets/header_playstation_image.png";
import macbookImg from "@/assets/header_macbook_image.png";

const Hero = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: headphoneImg,
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: playstationImg,
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: macbookImg,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-6 relative w-full">
      <div className="overflow-hidden rounded-xl w-full">
        <div
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {sliderData.map((slide) => (
            <div
              key={slide.id}
              className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:py-10 lg:py-12 md:px-14 px-6 min-w-full w-full shrink-0"
            >
              <div className="md:pl-8 mt-6 md:mt-0 text-center md:text-left">
                <p className="md:text-base text-orange-600 pb-1 text-sm font-medium">{slide.offer}</p>
                <h1 className="max-w-lg md:text-[40px] md:leading-12 text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">
                  {slide.title}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-4 md:mt-6">
                  <Link to="/products">
                    <button className="md:px-10 px-6 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium cursor-pointer text-sm md:text-base">
                      {slide.buttonText1}
                    </button>
                  </Link>
                  <Link to="/products">
                    <button className="group flex items-center gap-2 px-4 md:px-6 py-2.5 font-medium cursor-pointer text-sm md:text-base">
                      {slide.buttonText2}
                      <RightOutlined className="group-hover:translate-x-1 transition text-xs" />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center mt-6 md:mt-0">
                <img
                  className="md:w-72 lg:w-80 w-40 sm:w-48 max-h-60 md:max-h-72 lg:max-h-80 object-contain"
                  src={slide.imgSrc}
                  alt={slide.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;