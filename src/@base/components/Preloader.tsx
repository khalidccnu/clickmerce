import { motion } from 'framer-motion';
import React from 'react';

const Preloader = () => {
  return (
    <React.Fragment>
      <motion.div
        className="preloader_inner"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -150 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      >
        <div className="preloader_spinner" />
      </motion.div>
      <motion.div
        className="preloader_first_bg"
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.5 }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="preloader_second_bg"
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.8 }}
        style={{ willChange: 'transform' }}
      />
    </React.Fragment>
  );
};

export default Preloader;
