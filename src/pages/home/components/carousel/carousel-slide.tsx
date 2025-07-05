import { motion } from "motion/react";
import CarouselImage from "./carousel-image";
import type { IArticle } from "@/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatAddress } from "@/lib/utils";

interface CarouselSlideProps {
  post: IArticle;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({ post }) => {
  return (
    <div className="flex flex-col lg:flex-row h-full bg-white">
      {/* Content Side */}
      <div className="flex-1 flex items-center justify-start p-4 lg:p-12 order-2 lg:order-1 min-h-0">
        <div className="text-gray-900 w-full max-w-none lg:max-w-lg">
          <motion.div
            className="inline-block px-3 py-1 bg-gray-100 text-xs lg:text-sm font-medium mb-2 lg:mb-4 text-gray-700"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {post.category}
          </motion.div>

          <motion.h2
            className="text-xl lg:text-4xl font-bold mb-2 lg:mb-4 leading-tight line-clamp-3 lg:line-clamp-2 text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {post.title}
          </motion.h2>

          <motion.p
            className="text-sm lg:text-lg leading-relaxed mb-3 lg:mb-6 line-clamp-4 lg:line-clamp-3 text-gray-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-1 lg:gap-4 text-xs lg:text-sm mb-3 lg:mb-0 text-gray-500"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <span>By {formatAddress(post.author)}</span>
            <span className="hidden lg:inline">•</span>
            <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
            <span className="hidden lg:inline">•</span>
            <span>{post.read_time}</span>
          </motion.div>

          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button className="mt-8">Read Article</Button>
          </motion.div>
        </div>
      </div>

      {/* Image Side */}
      <div className="flex-1 flex items-center justify-center p-3 lg:p-8 order-1 lg:order-2 min-h-0">
        <CarouselImage image={post.image} title={post.title} />
      </div>
    </div>
  );
};

export default CarouselSlide;
