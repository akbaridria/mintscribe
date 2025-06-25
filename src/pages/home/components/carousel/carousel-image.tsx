import { useState } from "react"
import { motion } from "motion/react"

interface CarouselImageProps {
  image?: string
  title: string
}

const CarouselImage: React.FC<CarouselImageProps> = ({ image, title }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return null
  }

  if (!image) {
    return (
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
      >
        <div className="w-full max-w-xs lg:max-w-lg h-32 lg:h-72 bg-gray-100 border border-gray-200 shadow-lg flex items-center justify-center mx-auto">
          <div className="text-center">
            <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gray-200 flex items-center justify-center mx-auto mb-2 lg:mb-4">
              <span className="text-lg lg:text-2xl">📝</span>
            </div>
            <p className="text-xs lg:text-sm text-gray-500">No cover image</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
    >
      <div className="w-full max-w-xs lg:max-w-lg h-32 lg:h-72 bg-gray-50 border border-gray-200 shadow-lg overflow-hidden relative mx-auto">
        {/* Skeleton Loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse">
            <div className="w-full h-full bg-gray-200">
              <div className="flex items-center justify-center h-full">
                <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gray-300 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Actual Image */}
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          crossOrigin="anonymous"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true)
            setImageLoaded(false)
          }}
        />

        {/* Error State */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gray-200 flex items-center justify-center mx-auto mb-2 lg:mb-4">
                <span className="text-lg lg:text-2xl">❌</span>
              </div>
              <p className="text-xs lg:text-sm text-gray-500">Failed to load</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
};

export default CarouselImage;