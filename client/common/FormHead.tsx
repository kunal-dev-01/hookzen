import { motion } from "framer-motion";

function FormHead({ title = "WEBHOOK GATEWAY" }) {
  const letters = Array.from(title);

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    visible: {
      opacity: 1,
      visibility: "visible",
      transition: {
        duration: 0,
      },
    },
    hidden: {
      opacity: 0,
      visibility: "hidden",
    },
  };

  return (
    <div className="flex flex-col items-start mb-6">
      <motion.h1
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-2xl font-bold tracking-wider uppercase flex flex-wrap"
      >
        {letters.map((char, index) => (
          <motion.span variants={letterVariants} key={index}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}

export default FormHead;
