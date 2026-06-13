'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
}

const ScrollReveal = ({
    children,
    className = '',
    delay = 0,
    duration = 0.6,
    yOffset = 50,
}: ScrollRevealProps) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
                duration: duration,
                delay: delay,
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
