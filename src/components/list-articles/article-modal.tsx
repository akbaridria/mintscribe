import { motion, AnimatePresence } from "motion/react"
import { X, Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Avatar from "boring-avatars"
import type { IArticle } from "@/types"

interface ArticleModalProps {
  article: IArticle | null
  isOpen: boolean
  onClose: () => void
}

export function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  if (!article) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Header Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Article Meta Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge variant="secondary" className="mb-3">
                    {article.category}
                  </Badge>
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-8">
                {/* Author and Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12" name={article.author} />
                    <div>
                      <div className="font-semibold flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {article.author}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {article.date}
                    </div>
                    <div>•</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                </div>

                {/* Article Excerpt */}
                <div className="text-lg text-muted-foreground mb-8 leading-relaxed">{article.excerpt}</div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
