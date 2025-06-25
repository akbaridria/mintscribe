"use client";

import { motion } from "motion/react";
import { Lock, Coins, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LockedContent() {
  const publicDate = "20 March 2025";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Lock Status Card */}
      <Card className="p-6 border-2 border-dashed border-muted-foreground/30 bg-muted/20">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="destructive" className="text-sm">
                <Lock className="h-3 w-3 mr-1" />
                Permium Content
              </Badge>
            </div>

            <h3 className="text-xl font-semibold">Content Locked</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This article is available for early access. Pay 13 tokens to read
              it now, or wait until ${publicDate} for free access.
            </p>
          </div>

          {/* Unlock Options */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className={`flex items-center gap-2 "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"`}
            >
              <Coins className="h-4 w-4" />
              Unlock for 14 tokens
            </Button>

            {publicDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Free on {publicDate}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
