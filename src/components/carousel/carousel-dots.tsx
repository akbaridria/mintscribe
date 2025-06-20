import { motion } from "motion/react";

interface CarouselDotsProps {
  totalSlides: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

const CarouselDots: React.FC<CarouselDotsProps> = ({
  totalSlides,
  currentIndex,
  onDotClick,
}) => {
  return (
    <div className="flex justify-center mt-4 space-x-3">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <motion.button
          key={index}
          className={`w-3 h-3 transition-colors ${
            index === currentIndex ? "bg-zinc-800" : "bg-zinc-800/30"
          }`}
          onClick={() => onDotClick(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        />
      ))}
    </div>
  );
};

export default CarouselDots;
