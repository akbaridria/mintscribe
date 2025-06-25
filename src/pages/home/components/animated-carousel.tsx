"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import CarouselSlide from "./carousel/carousel-slide";
import CarouselDots from "./carousel/carousel-dots";
import { blogPosts } from "@/data";

const AnimatedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % blogPosts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const preventBrowserNavigation = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", preventBrowserNavigation, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchstart", preventBrowserNavigation);
    };
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = useCallback((offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const handleDragEnd = useCallback(
    (_: unknown, { offset, velocity }: PanInfo) => {
      const swipe = swipePower(offset.x, velocity.x);

      if (swipe < -swipeConfidenceThreshold) {
        goToSlide(currentIndex + 1 >= blogPosts.length ? 0 : currentIndex + 1);
      } else if (swipe > swipeConfidenceThreshold) {
        goToSlide(
          currentIndex - 1 < 0 ? blogPosts.length - 1 : currentIndex - 1
        );
      }
    },
    [currentIndex, goToSlide, swipePower, swipeConfidenceThreshold]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, []);

  return (
    <div className="w-full">
      <div className="relative">
        <div
          className="relative h-[350px] lg:h-[500px] overflow-hidden border border-gray-200 bg-white"
          onTouchStart={handleTouchStart}
          style={{ overscrollBehavior: "none", touchAction: "pan-y" }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.4 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <CarouselSlide post={blogPosts[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>
        <CarouselDots
          totalSlides={blogPosts.length}
          currentIndex={currentIndex}
          onDotClick={goToSlide}
        />
      </div>
    </div>
  );
};

export default AnimatedCarousel;
