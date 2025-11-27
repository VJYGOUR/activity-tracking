import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RouteProgressBar = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    const startProgress = () => {
      setIsVisible(true);
      setProgress(0);

      // Smooth fake loading effect
      let width = 0;
      timer = setInterval(() => {
        width += Math.random() * 15;
        setProgress((prev) => (prev < 95 ? width : 95));
      }, 200);
    };

    const finishProgress = () => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
        clearInterval(timer);
      }, 400);
    };

    startProgress();
    finishProgress();

    return () => clearInterval(timer);
  }, [location]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 h-[3px] bg-indigo-600 z-[9999]"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
};

export default RouteProgressBar;
