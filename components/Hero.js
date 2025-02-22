import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Hero() {
  const steps = [
    {
      key: 1,
      icon: '📝',
      title: "Step 1",
      description: "Create your profile and get verified to start using Noshly.",
    },
    {
      key: 2,
      icon: '🛒',
      title: "Step 2",
      description: "Consumers can browse available food items and contact suppliers.",
    },
    {
      key: 3,
      icon: '🍎',
      title: "Step 3",
      description: "Suppliers can add food items by entering necessary details.",
    },
    {
      key: 4,
      icon: '📦',
      title: "Step 4",
      description: "When the consume orders food, both the parties will get each other detials and get the food delivered to needy.",
    },
  ];

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center py-16">
        <Image 
          src="/logo-actual.png" 
          alt="Noshly Logo" 
          width={100} 
          height={100} 
          className="object-contain mb-4"
        />
        <h1 className="text-5xl font-bold text-gray-800 mb-2">Noshly</h1>
        <p className="text-lg text-gray-600 mb-6">Your partner in reducing food waste and feeding the needy.</p>
        <Link href="/login">
          <button className="bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition-all">
            Get Started
          </button>
        </Link>
      </section>

      {/* About Us Section */}
      <section className="bg-white py-12 px-4 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">About Us</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Noshly connects sellers with surplus food, consumers looking for affordable options, and NGOs striving to feed the needy. Together, we aim to minimize food waste and make meals accessible for everyone.
        </p>
      </section>

      {/* Motivation Section with Tree Structure */}
      <section className="bg-gray-100 py-12 px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Motivation</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-400 h-full"></div>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="w-1/2 flex justify-end pr-4">
                <div className="bg-red-200 p-4 rounded-lg shadow-md w-64 text-center">
                  <h4 className="font-bold mb-2">Why?</h4>
                  <p className="text-gray-700">Globally, around 1.3 billion tons of food is wasted every year—roughly 3.5 million tons daily—which could feed over 2 billion people every day. 🌍🍽️ 
                  </p>
                </div>
              </div>
              <div className="w-1/2"></div>
            </div>

            <div className="flex items-center">
              <div className="w-1/2"></div>
              <div className="w-1/2 flex justify-start pl-4">
                <div className="bg-orange-200 p-4 rounded-lg shadow-md w-64 text-center">
                  <h4 className="font-bold mb-2">What you can do</h4>
                  <p className="text-gray-700">You can make an impact by reducing food waste.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-1/2 flex justify-end pr-4">
                <div className="bg-yellow-200 p-4 rounded-lg shadow-md w-64 text-center">
                  <h4 className="font-bold mb-2">How</h4>
                  <p className="text-gray-700">Post your food details, and we'll instantly notify nearby consumers and NGOs to ensure it reaches those in need.</p>
                </div>
              </div>
              <div className="w-1/2"></div>
            </div>
          </div>
        </div>
      </section>

{/* How to Use Section */}
<section className="bg-gray-100 py-12 px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">How It Works</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.key}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* {Below is another version to swipe the carousel} */}
      {/* <section className="bg-gray-100 py-12 px-4">
  <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">How It Works</h2>
  <div className="max-w-6xl mx-auto">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop
      className="w-full"
    >
      {steps.map((step) => (
        <SwiperSlide key={step.key}>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-full">
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section> */}
    </div>
  );
}