import { Benefits } from "../Components/Benefits";
import Faq from "../Components/Faq";
import { Footer } from "../Components/Footer";
import { Hero } from "../Components/Hero";
import { Navbar } from "../Components/Navbar";
import { Testimonials } from "../Components/Testimonials";

function Landing() {
  return (
    <div className="bg-gray-900">
      <Navbar />

      <div className="mt-14">
        <Hero />
      </div>
      <hr className="border-t border-white mx-auto mt-24 w-11/12" />

      <div className="pt-14">
        <Benefits />
      </div>
      <hr className="border-t border-white mx-auto mt-24 w-11/12" />

      <div className="pt-14">
        <Testimonials />
      </div>
      <hr className="border-t border-white mx-auto mt-24 w-11/12" />

      <div className="pt-14">
        <Faq />
      </div>

      <div className="pt-4">
        <Footer />
      </div>
    </div>
  );
}
export default Landing;
