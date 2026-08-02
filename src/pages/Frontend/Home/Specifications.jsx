import React from 'react';
import { SendOutlined, HistoryOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const Specifications = () => {
  const specs = [
    {
      id: 1,
      title: "Free Shipping",
      description: "Enjoy fast, free delivery on every order no conditions, just reliable doorstep.",
      icon: <SendOutlined style={{ color: '#ffffff', fontSize: '18px' }} />,
      badgeBg: "bg-[#10B981]",
      cardBg: "bg-[#F0FDF4]",
      borderColor: "border-[#DCFCE7]",
    },
    {
      id: 2,
      title: "7 Days easy Return",
      description: "Change your mind? No worries. Return any item within 7 days.",
      icon: <HistoryOutlined style={{ color: '#ffffff', fontSize: '18px' }} />,
      badgeBg: "bg-[#F59E0B]",
      cardBg: "bg-[#FFFBEB]",
      borderColor: "border-[#FEF3C7]",
    },
    {
      id: 3,
      title: "24/7 Customer Support",
      description: "We're here for you. Get expert help with our customer support.",
      icon: <CustomerServiceOutlined style={{ color: '#ffffff', fontSize: '18px' }} />,
      badgeBg: "bg-[#A855F7]",
      cardBg: "bg-[#F5F3FF]",
      borderColor: "border-[#DDD6FE]",
    },
  ];

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 my-16 md:my-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Our Specifications
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-3 leading-relaxed">
          We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 pt-4">
        {specs.map((spec) => (
          <div
            key={spec.id}
            className={`relative ${spec.cardBg} border ${spec.borderColor} rounded-2xl p-8 pt-10 text-center flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xs`}
          >
            {/* Top Icon Badge */}
            <div
              className={`absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl ${spec.badgeBg} flex items-center justify-center shadow-md`}
            >
              {spec.icon}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2 mt-1">
              {spec.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs leading-relaxed">
              {spec.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Specifications;