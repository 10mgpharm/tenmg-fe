'use client'
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { 
  Store, 
  TrendingUp, 
  Package, 
  ArrowRight,
  Zap
} from "lucide-react";

const Financepage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cards = [
    {
      tag: "FOR VENDORS",
      title: "Secure Credit To Expand Your Business",
      description: "Unlock access to capital for operational growth and inventory financing. Simplified loan applications, transparent repayment plans.",
      cta: "Sign Up As a Vendor",
      href: "/auth/signup/vendor",
      icon: Store,
      image: "/assets/images/finance-new-image-3.webp",
      reverse: true,
    },
    {
      tag: "FOR STOREFRONT",
      title: "Affordable Medicines at Your Fingertips",
      description: "Shop for trusted, high-quality medications from verified vendors. Browse, compare, and purchase with ease—all in one place.",
      cta: "Go To Storefront",
      href: "/auth/signin/pharmacy",
      icon: TrendingUp,
      image: "/assets/images/finance-new-image.webp",
      reverse: false
    },
    {
      tag: "FOR SUPPLIERS",
      title: "Reliable Financing for Seamless Operations",
      description: "10MG Credit ensures you never run out of resources. Instant access to funds to meet your operational demands.",
      cta: "Sign Up As a Supplier",
      href: "/auth/signup/supplier",
      icon: Package,
      image: "/assets/images/supplier-new-image.webp",
      reverse: true
    }
  ];

  return (
    <div className="bg-white py-20 px-2">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-10 space-y-12"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="relative"
          >
            <motion.div
              transition={{ duration: 0.3 }}
              className={`flex flex-col ${
                card.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
              } items-stretch rounded-md overflow-hidden shadow-xl transition-shadow bg-white border border-gray-100`}
            >
              {/* Content Side */}
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-white">
                {/* Decorative Elements */}
                <motion.div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
                  style={{ backgroundColor: 'rgba(14, 120, 217, 0.1)' }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="relative z-10">
                  {/* Icon Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                    style={{ backgroundColor: 'rgba(14, 120, 217, 0.1)' }}
                  >
                    <card.icon className="w-8 h-8" style={{ color: '#0e78d9' }} />
                  </motion.div>

                  {/* Tag */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <span 
                      className="inline-block text-sm font-bold mb-4 px-4 py-1.5 rounded-full"
                      style={{ 
                        color: '#0e78d9',
                        backgroundColor: 'rgba(14, 120, 217, 0.1)'
                      }}
                    >
                      {card.tag}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                  >
                    {card.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-gray-700 text-lg mb-8 leading-relaxed"
                  >
                    {card.description}
                  </motion.p>

                  {/* CTA Button */}
                  <motion.a
                    href={card.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all group"
                    style={{ 
                      backgroundColor: '#0e78d9',
                      boxShadow: '0 10px 25px -5px rgba(14, 120, 217, 0.3)'
                    }}
                  >
                    <span>{card.cta}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.a>
                </div>
              </div>

              {/* Image Side */}
              <motion.div
                variants={imageVariants}
                className="md:w-1/2 relative overflow-hidden min-h-[400px] md:min-h-[600px]"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  quality={100}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-20 text-center"
      >
        <div className="rounded-3xl p-12 relative overflow-hidden" style={{ backgroundColor: '#0e78d9' }}>
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative z-10">
            <Zap className="w-12 h-12 text-white/90 mx-auto mb-4" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Healthcare Business?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare providers already growing with 10MG Credit
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              style={{ color: '#0e78d9' }}
            >
              Get Started Today
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Financepage;