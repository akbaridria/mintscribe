"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import CarouselSlide from "./carousel/carousel-slide";
import CarouselDots from "./carousel/carousel-dots";
import type { BlogPost } from "@/types/carousel";

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Winter Sports Adventures",
    excerpt:
      "Embrace the thrill of winter sports and discover the perfect blend of adrenaline and serenity in snow-covered mountains and pristine slopes.",
    author: "Sarah Johnson",
    date: "Dec 15, 2024",
    readTime: "5 min read",
    category: "Sports & Adventure",
    image:
      "https://images.unsplash.com/photo-1746717410283-f4017128c38f",
  },
  {
    id: 2,
    title: "Outdoor Adventure Gear Guide",
    excerpt:
      "Essential equipment and gear recommendations for your next outdoor adventure, from mountain climbing to winter expeditions.",
    author: "Mike Chen",
    date: "Dec 12, 2024",
    readTime: "8 min read",
    category: "Gear & Equipment",
    image:
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Urban Motorcycle Culture",
    excerpt:
      "Explore the underground motorcycle scene in urban environments, where style meets performance in the concrete jungle.",
    author: "Emma Davis",
    date: "Dec 10, 2024",
    readTime: "6 min read",
    category: "Lifestyle & Culture",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Vietnamese Street Food Culture",
    excerpt:
      "Discover the vibrant world of Vietnamese street food markets, where traditional flavors and cooking methods create culinary magic.",
    author: "Alex Rodriguez",
    date: "Dec 8, 2024",
    readTime: "7 min read",
    category: "Food & Culture",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Product Design Workflow",
    excerpt:
      "Master the art of product design with structured workflows, user research, and iterative design processes that deliver results.",
    author: "Lisa Wang",
    date: "Dec 5, 2024",
    readTime: "4 min read",
    category: "Design & UX",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop",
  },
];

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
    <div className="min-h-screen bg-white px-2 py-4 lg:px-4 lg:py-8">
      <div className="w-full max-w-7xl mx-auto">
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
    </div>
  );
};

export default AnimatedCarousel;
