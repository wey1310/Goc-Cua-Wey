import { motion } from "framer-motion";

function PageTransition({ children }) {

    return (

        <motion.div

            initial={{
                opacity: 0,
                scale: 0.98,
                filter: "blur(10px)"
            }}

            animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)"
            }}

            exit={{
                opacity: 0,
                scale: 1.02,
                filter: "blur(10px)"
            }}

            transition={{
                duration: 0.45,
                ease: "easeInOut"
            }}

            style={{
                width: "100%",
                minHeight: "100vh"
            }}

        >

            {children}

        </motion.div>

    );

}

export default PageTransition;