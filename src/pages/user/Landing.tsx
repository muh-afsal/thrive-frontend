import React, { useState } from "react";
import Footer from "@/components/Footer";
import LandingNavbar from "@/components/navbars/LandingNavbar";
import landingbg from "@/assets/images/landing/landingbg.png";
import potratesImage from "@/assets/images/landing/potrait.png";
import lnading1Image from "@/assets/images/landing/landing2.png";
import serviceOffertingImage from "@/assets/images/landing/cartoon-ai-robot-scene.jpg";
import collaborationImage from "@/assets/images/landing/people-collaborate-cozy-outdoor-cafe-with-plants-warm-lighting-all-working-laptops.jpg";
import productivityImage from "@/assets/images/landing/sided-view-hand-typing-keyboard.jpg";
import dashboardImage from "@/assets/images/landing/1 1.png";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  const [planMonthly, setPlan] = useState<boolean>(false);

  return (
    <>
      <div>
        <section
          className="h-[800px]  md:h-[700px] relative bg-cover bg-center"
          style={{ backgroundImage: `url(${landingbg})` }}
        >
          <LandingNavbar />
          <div className=" h-5/6  flex flex-col md:flex-row ">
            <div className="  h-[70%] flex flex-col md:w-[60%] md:h-full justify-center items-center md:mt-9 gap-2 p-3">
              <div className="md:w-[80%]  h-[70%] flex flex-col justify-center xl:p-10 p-4 gap-4">
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold">
                  Boost productivity and collaborate effortlessly with your
                  team.
                </h1>
                <p className="font-medium text-sm text-gray-500 md:w-[60%] mb-5 mt-4">
                  Empower your team to achieve peak productivity through
                  seamless collaboration, leveraging our multimedia
                  communication and comprehensive service offerings to foster a
                  dynamic environment where ideas flourish and goals are
                  exceeded.
                </p>
                <Link to="/signup">
                  <button className="bg-blue-600 text-slate-50 rounded-md  px-3 py-2 font-semibold">
                    Sign up for Free...
                  </button>
                </Link>
              </div>
            </div>
            <div className=" h-[50%] flex  justify-center md:w-[40%] md:h-full items-center">
              <img
                className="w-[300px] md:w-[500px] lg:mr-7 "
                src={potratesImage}
                alt=""
              />
            </div>
          </div>
        </section>
        <section className="h-[800px]  md:h-[700px] flex items-center">
          <div className=" h-5/6  flex flex-col md:flex-row items-center">
            <div className="  h-[70%] flex flex-col md:w-[60%] md:h-full justify-center items-center md:mt-9 gap-2 p-3">
              <div className=" md:w-[80%]  h-[70%] flex flex-col justify-center xl:p-10 p-4 gap-4">
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold">
                  Organize remote team fast & easily.
                </h1>
                <div className="">
                  <p className="font-medium text-sm text-gray-500 md:w-[60%] mb-5 mt-4">
                    We share common trends and strategies for creating &
                    improving your rental income.
                  </p>
                  <h1 className="font-bold text-lg mb-2 ">
                    Create Unlimited Teams
                  </h1>
                  <p className="font-semibold mb-6 text-sm text-gray-500 ">
                    With lots of unique blocks, you can easily build a page
                    without coding.
                  </p>
                  <h1 className="font-bold text-lg mb-2">
                    Hasslefree Chat with Everyone
                  </h1>
                  <p className=" font-semibold text-sm text-gray-500 ">
                    With lots of unique blocks, you can easily build a page
                    without coding.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className=" h-[50%] flex justify-center md:w-[40%] md:h-full items-center">
              <img
                className="w-[300px] md:w-[450px] lg:mr-7"
                src={lnading1Image}
                alt=""
              />
            </div>
          </div>
        </section>
        <section className=" h-[1600px]  md:h-[700px] flex items-center bg-blue-50">
          <div className="h-[90%] w-screen flex flex-col md:flex-row items-center justify-center">
            <div className=" w h-[90%] xl:w-[95%] flex flex-col justify-center items-center ">
              <div className="w-full  ">
                <div className="flex flex-col justify-center items-center p-3 ">
                  <h1 className="font-bold text-2xl lg:text-4xl lg:mt-5 mb-2">
                    Services we offer for you
                  </h1>
                  <p className="font-semibold mb-6 text-sm text-gray-500 text-center">
                    With a wide range of unique features, you can collaborate
                    effortlessly and enhance productivity.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-[95%] lg:w-[70%] h-5/6  md:flex md:justify-center md:items-center ">
                <div className="w-full h-2/6  md:h-5/6  p-3 ">
                  <h1 className="font-semibold text-lg mb-3">
                    Comprehensive Service Offerings
                  </h1>
                  <div
                    className="w-[90%] h-[200px] shadow-2xl bg-cover rounded-lg"
                    style={{ backgroundImage: `url(${serviceOffertingImage})` }}
                  ></div>
                  <p className="font-semibold mb text-sm text-gray-500 p-3">
                    By using the various services provided by Thrive, you can
                    collaborate more effectively and increase the productivity
                    of your work.
                  </p>
                  <p className="text-blue-600 text-sm pl-3 font-semibold">
                    Learn more -
                  </p>
                </div>
                <div className="w-full h-2/6  md:h-5/6  p-3">
                  <h1 className="font-semibold text-lg mb-3">
                    Effortless Collaboration
                  </h1>
                  <div
                    className="w-[90%] h-[200px] shadow-2xl bg-cover rounded-lg"
                    style={{ backgroundImage: `url(${collaborationImage})` }}
                  ></div>
                  <p className="font-semibold  text-sm text-gray-500 p-3">
                    Innovative solutions drive progress, offering new and
                    effective ways to solve problems and enhance efficiency.
                  </p>
                  <p className="text-blue-600 text-sm pl-3 font-semibold">
                    Learn more -
                  </p>
                </div>
                <div className="w-full h-2/6  md:h-5/6  p-3">
                  <h1 className="font-semibold text-lg mb-3">
                    Innovative Solutions
                  </h1>
                  <div
                    className="w-[90%] h-[200px] shadow-2xl bg-cover rounded-lg"
                    style={{ backgroundImage: `url(${productivityImage})` }}
                  ></div>
                  <p className="font-semibold  text-sm text-gray-500 p-3">
                    Effortless collaboration is achieved through streamlined
                    communication and integrated tools, allowing teams to work
                    together seamlessly and efficiently.
                  </p>
                  <p className="text-blue-600 text-sm pl-3 font-semibold">
                    Learn more -
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="h-[800px]  md:h-[700px] flex items-center">
          <div className=" h-5/6  flex flex-col md:flex-row items-center">
            <div className=" h-[50%] flex justify-center md:w-[50%] md:h-full items-center p-9">
              <img
                className="w-[300px] md:w-[450px] md:ml-36 lg:ml-56"
                src={dashboardImage}
                alt=""
              />
            </div>
            <div className="  h-[70%] flex flex-col md:w-[60%] md:h-full justify-center items-center md:mt-9 gap-2 p-3">
              <div className=" md:w-[80%]  h-[70%] flex flex-col justify-center xl:p-10 p-4 gap-4">
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold">
                  Track your progress with our advanced site.
                </h1>
                <div className="">
                  <p className="font-medium text-sm text-gray-500 md:w-[50%] mb-5 mt-4">
                    Track your progress with our advanced site, ensuring you
                    stay on top of your goals and milestones. Our intuitive
                    dashboard provides real-time updates and insights, making it
                    easier than ever to monitor your achievements.
                  </p>
                  <p className="text-blue-600 text-md md:text-lg pl-3 font-semibold">
                    Start free trial -
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className=" h-[700px]  md:h-[300px] flex items-center  bg-blue-50 justify-center">
          <div className="w-[90%] md:w-[95%] lg:w-[70%] h-5/6 flex flex-col  md:flex md:flex-row md:justify-center md:items-center gap-8">
            <div className="w-full  h-2/6  md:h-5/6  p-3  flex flex-col justify-center items-center ">
              <h1 className="text-4xl md:text-5xl xl:text-5xl font-bold text-center  ">
                1M+
              </h1>
              <p className="font-medium text-sm text-gray-500 md:w-[50%] mb-5 mt-4 text-center">
                Customers visit Omega every month to get their service done.
              </p>
            </div>
            <div className="w-full  h-2/6  md:h-5/6  p-3 flex flex-col justify-center items-center ">
              <h1 className="text-4xl md:text-5xl xl:text-5xl font-bold text-center ">
                92%
              </h1>
              <p className="font-medium text-sm text-gray-500 md:w-[50%] mb-5 mt-4 text-center">
                Satisfaction rate comes from our awesome customers.
              </p>
            </div>
            <div className="w-full  h-2/6  md:h-5/6  p-3 flex flex-col justify-center items-center ">
              <h1 className="text-4xl md:text-5xl xl:text-5xl font-bold text-center ">
                4.9/5.0
              </h1>
              <p className="font-medium text-sm text-gray-500 md:w-[50%] mb-5 mt-4 text-center">
                Average customer ratings we have got all over internet.
              </p>
            </div>
          </div>
        </section>
        <section className="h-full md:h-[900px] flex flex-col justify-center items-center">
          <div className="h-[300px]  w-full flex flex-col justify-center items-center">
            <h1 className="text-3xl md:text-3xl xl:text-4xl font-bold text-center">
              Choose Plan That's Right For You
            </h1>
            <p className="font-medium text-sm text-gray-500 md:w-[50%] mb-5 mt-4 text-center">
              Choose plan that works best for you, feel free to contact us
            </p>
            <div className=" rounded-lg w-60 h-14 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] flex flex-row justify-around items-center">
              <button
                className={`w-[45%] h-[80%] rounded-md ${
                  planMonthly ? "bg-thirve-blue" : "bg-white"
                }`}
                onClick={() => setPlan(true)}
              >
                <p className={`${planMonthly ? "text-white" : "text-black"}`} >Monthly</p>
              </button>
              <button
                className={`w-[45%] h-[80%] rounded-md ${
                  planMonthly ? "bg-white" : "bg-thirve-blue"
                }`}
                onClick={() => setPlan(false)}
              >
                 <p className={`${planMonthly ? "text-black" : "text-white"}`} >Yearly</p>
              </button>
            </div>
          </div>
          <div className="w-[90%] md:w-[95%] md:h-[600px] lg:w-[70%] h-[1200px] lg:px-24 flex flex-col  md:flex md:flex-row md:justify-center md:items-center gap-8">
            <div className="  w-full rounded-lg  md:w-2/6 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] h-1/3  md:h-5/6  p-3  flex flex-col justify-center items-center ">
               <div className="h-">

               </div>
               <div>

               </div>
            </div>
            <div className="  w-full rounded-lg  md:w-2/6 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] h-1/3  md:h-5/6  p-3 flex flex-col justify-center items-center ">
             
            </div>
            <div className=" w-full rounded-lg   md:w-2/6 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] h-1/3  md:h-5/6  p-3 flex flex-col justify-center items-center ">
              
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Landing;
