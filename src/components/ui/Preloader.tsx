import React from "react";
import { motion } from "framer-motion";
import "./Preloader.css"; // Arquivo CSS separado

const variants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
    transition: {
      scale: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
      rotate: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

const Preloader = () => {
  return (
    <div className="preloader-wrapper">
      <motion.div className="loader" variants={variants} animate="animate">
        {"< >"}
      </motion.div>
    </div>
  );
};

export default Preloader;
