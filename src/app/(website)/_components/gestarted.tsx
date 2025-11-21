import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, CheckCircle } from "lucide-react";

const Gestarted = () => {
  return (
    <div className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#0e78d9' }}>
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20"
          >
            <Shield className="w-4 h-4" />
            Trusted Healthcare Financing
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Simple Steps to Finance{" "}
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              and Grow
            </span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-blue-50 leading-relaxed">
            10MG Credit is your trusted partner for smarter healthcare
            financing, empowering lenders, vendors, and suppliers with tailored
            credit solutions.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative"
        >
          <motion.div 
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="md:w-[45%] relative min-h-[400px] md:min-h-[600px] overflow-hidden group"
              >
                <Image
                  src="/assets/images/lenders-new.webp"
                  alt="Lenders Platform"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  quality={100}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Floating Stats Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Active Lenders</p>
                          <p className="text-xs text-gray-600">Verified Platform</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: '#0e78d9' }}>500+</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Content Side */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="md:w-[55%] p-8 md:p-12 flex flex-col justify-center relative"
              >
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-2xl opacity-50" />
                
                <div className="relative z-10">
                  {/* Tag */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                    className="inline-block mb-6"
                  >
                    <span className="px-4 py-2 rounded-full text-sm font-bold text-white" style={{ backgroundColor: '#0e78d9' }}>
                      FOR LENDERS
                    </span>
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                  >
                    Grow Your Returns with{" "}
                    <span style={{ color: '#0e78d9' }}>Verified Borrowers</span>
                  </motion.h3>
                  
                  {/* Description */}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-gray-600 text-lg mb-8 leading-relaxed"
                  >
                    Access a pool of trustworthy vendors and suppliers, track
                    repayments effortlessly, and watch your investments grow with
                    competitive interest rates.
                  </motion.p>
                  
                  {/* Features List */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    viewport={{ once: true }}
                    className="space-y-3 mb-8"
                  >
                    {[
                      "Verified borrower network",
                      "Real-time repayment tracking",
                      "Competitive interest rates"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0e78d920' }}>
                          <CheckCircle className="w-4 h-4" style={{ color: '#0e78d9' }} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* CTA Button */}
                  <motion.a
                    href="/auth/signup/lender"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(14, 120, 217, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl font-semibold text-lg shadow-lg transition-all group"
                    style={{ backgroundColor: '#0e78d9' }}
                  >
                    <span>Sign Up As a Lender</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-blue-100 text-sm">
            Trusted by <span className="font-bold text-white">500+</span> healthcare providers across the country
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Gestarted;