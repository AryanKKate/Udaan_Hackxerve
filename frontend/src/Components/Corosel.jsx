import React from "react";
import Slider from "react-slick";
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/Footer";

const CarouselComponent = () => {
  const settings = {
    dots: true, // Enable dot navigation
    infinite: true, // Infinite looping
    speed: 500, // Transition speed in ms
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Speed for autoplay in ms
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <Slider {...settings}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="https://nextly.web3templates.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero.4e76c802.png&w=640&q=75"
              alt="Hero Illustration"
              loading="eager"
              width="450px"
              style={{
                width: "100%", // Makes the image responsive
                height: "auto", // Keeps the aspect ratio
                objectFit: "cover", // Ensures the image covers the area
              }}
            />
          </div>
          {/* Add more slides if needed */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="https://nextly.web3templates.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero.4e76c802.png&w=640&q=75"
              alt="Hero Illustration"
              loading="eager"
              width="450px"
              style={{
                width: "100%", // Makes the image responsive
                height: "auto", // Keeps the aspect ratio
                objectFit: "cover", // Ensures the image covers the area
              }}
            />
          </div>
          {/* More images can be added here */}
        </Slider>
      </div>
      <Footer />
    </div>
  );
};

export default CarouselComponent;
