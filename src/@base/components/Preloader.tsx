import { motion } from 'framer-motion';
import React from 'react';

const Preloader = () => {
  return (
    <React.Fragment>
      <motion.div
        className="preloader_inner"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -150 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      >
        <div className="preloader_spinner" />
      </motion.div>
      <motion.div
        className="preloader_first_bg"
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 1 }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="preloader_second_bg"
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 1.2 }}
        style={{ willChange: 'transform' }}
      />
    </React.Fragment>
  );
};

export default Preloader;
