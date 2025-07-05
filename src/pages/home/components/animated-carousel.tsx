import type React from "react";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import CarouselSlide from "./carousel/carousel-slide";
import CarouselDots from "./carousel/carousel-dots";
import { useGetTopLikes } from "@/api/query";
import { Skeleton } from "@/components/ui/skeleton";

const AnimatedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { data: articles, isLoading } = useGetTopLikes();

  const blogPosts = useMemo(
    () => articles?.map(({ article }) => article) || [],
    [articles]
  );

  useEffect(() => {
    // Don't start auto-rotation if still loading or no posts
    if (isLoading || blogPosts.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % blogPosts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [blogPosts.length, currentIndex, isLoading]);

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
      if (index === currentIndex || isLoading) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, isLoading]
  );

  const handleDragEnd = useCallback(
    (_: unknown, { offset, velocity }: PanInfo) => {
      if (isLoading || blogPosts.length === 0) return;

      const swipe = swipePower(offset.x, velocity.x);
      if (swipe < -swipeConfidenceThreshold) {
        goToSlide(currentIndex + 1 >= blogPosts.length ? 0 : currentIndex + 1);
      } else if (swipe > swipeConfidenceThreshold) {
        goToSlide(
          currentIndex - 1 < 0 ? blogPosts.length - 1 : currentIndex - 1
        );
      }
    },
    [swipePower, goToSlide, currentIndex, blogPosts.length, isLoading]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative">
          <div className="relative h-[350px] lg:h-[500px] overflow-hidden border border-gray-200 bg-white">
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              {/* Title skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              {/* Content skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Image skeleton */}
              <div className="flex justify-center">
                <Skeleton className="h-32 w-48 rounded-lg" />
              </div>

              {/* Button skeleton */}
              <div className="flex justify-start">
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>
          </div>

          {/* Dots skeleton */}
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-2 w-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!isLoading && blogPosts.length === 0) {
    return (
      <div className="w-full">
        <div className="relative h-[350px] lg:h-[500px] overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">No articles available</p>
            <p className="text-sm">Check back later for new content</p>
          </div>
        </div>
      </div>
    );
  }

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
