import { useState, useEffect } from "react";
// @ts-expect-error: No types for colorthief
import ColorThief from "colorthief";
import type { BlogPost, ExtractedColors, ColorData } from "../types/carousel";

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

// Helper function to calculate luminance
const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Helper function to determine if color is light or dark
const isLightColor = (r: number, g: number, b: number): boolean => {
  const luminance = getLuminance(r, g, b);
  return luminance > 0.5;
};

// Helper function to convert Tailwind gradient to CSS gradient
const convertTailwindGradient = (tailwindGradient: string): string => {
  const colorMap: { [key: string]: string } = {
    "blue-400": "#60a5fa",
    "blue-300": "#93c5fd",
    white: "#ffffff",
    "slate-500": "#64748b",
    "gray-800": "#1f2937",
    "orange-600": "#ea580c",
    "green-700": "#15803d",
    "amber-200": "#fde68a",
    "orange-300": "#fdba74",
  };

  // Extract colors from Tailwind gradient string
  const fromMatch = tailwindGradient.match(/from-([a-z]+-?\d*)/);
  const toMatch = tailwindGradient.match(/to-([a-z]+-?\d*)/);
  const viaMatch = tailwindGradient.match(/via-([a-z]+-?\d*)/);

  const fromColor = fromMatch ? colorMap[fromMatch[1]] || "#3b82f6" : "#3b82f6";
  const toColor = toMatch ? colorMap[toMatch[1]] || "#1e40af" : "#1e40af";
  const viaColor = viaMatch ? colorMap[viaMatch[1]] : null;

  if (viaColor) {
    return `linear-gradient(135deg, ${fromColor} 0%, ${viaColor} 50%, ${toColor} 100%)`;
  } else {
    return `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`;
  }
};

// Helper function to create gradient and determine text color
const createGradientFromColors = (colors: number[][]): ColorData => {
  if (colors.length === 0) {
    return {
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      textColor: "text-white",
      isDark: true,
    };
  }

  const hexColors = colors.slice(0, 3).map(([r, g, b]) => rgbToHex(r, g, b));

  // Check if the dominant color is light
  const [r, g, b] = colors[0];
  const isLight = isLightColor(r, g, b);

  // Create CSS gradient
  let gradient: string;
  if (hexColors.length === 1) {
    if (isLight) {
      // Create a darker version for light colors
      const darkerR = Math.max(0, r - 100);
      const darkerG = Math.max(0, g - 100);
      const darkerB = Math.max(0, b - 100);
      const darkerHex = rgbToHex(darkerR, darkerG, darkerB);
      gradient = `linear-gradient(135deg, ${hexColors[0]} 0%, ${darkerHex} 100%)`;
    } else {
      gradient = `linear-gradient(135deg, ${hexColors[0]} 0%, ${hexColors[0]} 100%)`;
    }
  } else if (hexColors.length === 2) {
    gradient = `linear-gradient(135deg, ${hexColors[0]} 0%, ${hexColors[1]} 100%)`;
  } else {
    gradient = `linear-gradient(135deg, ${hexColors[0]} 0%, ${hexColors[1]} 50%, ${hexColors[2]} 100%)`;
  }

  // Determine text color based on the dominant color
  const textColor = isLight ? "text-gray-900" : "text-white";

  return {
    gradient,
    textColor,
    isDark: !isLight,
  };
};

export const useColorExtraction = (blogPosts: BlogPost[]) => {
  const [extractedColors, setExtractedColors] = useState<ExtractedColors>({});
  const [isLoadingColors, setIsLoadingColors] = useState(true);

  useEffect(() => {
    const extractColors = async () => {
      const colorThief = new ColorThief();
      const colorPromises = blogPosts.map(async (post, index) => {
        if (!post.image) {
          // Better fallback for posts without images
          const fallbackGradient = convertTailwindGradient(post.fallbackColor);
          return {
            index,
            gradient: fallbackGradient,
            textColor: "text-white",
            isDark: true,
          };
        }

        try {
          return new Promise<{
            index: number;
            gradient: string;
            textColor: string;
            isDark: boolean;
          }>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";

            img.onload = () => {
              try {
                // Get the dominant color and palette
                const dominantColor = colorThief.getColor(img);
                const palette = colorThief.getPalette(img, 5);

                // Create gradient from the extracted colors
                const allColors = [dominantColor, ...palette.slice(0, 2)];
                const colorData = createGradientFromColors(allColors);

                resolve({
                  index,
                  gradient: colorData.gradient,
                  textColor: colorData.textColor,
                  isDark: colorData.isDark,
                });
              } catch (error) {
                console.warn(
                  `Failed to extract colors for post ${index}:`,
                  error
                );
                const fallbackGradient = convertTailwindGradient(
                  post.fallbackColor
                );
                resolve({
                  index,
                  gradient: fallbackGradient,
                  textColor: "text-white",
                  isDark: true,
                });
              }
            };

            img.onerror = () => {
              console.warn(`Failed to load image for post ${index}`);
              const fallbackGradient = convertTailwindGradient(
                post.fallbackColor
              );
              resolve({
                index,
                gradient: fallbackGradient,
                textColor: "text-white",
                isDark: true,
              });
            };

            img.src = post.image!;
          });
        } catch (error) {
          console.warn(`Failed to process image for post ${index}:`, error);
          const fallbackGradient = convertTailwindGradient(post.fallbackColor);
          return {
            index,
            gradient: fallbackGradient,
            textColor: "text-white",
            isDark: true,
          };
        }
      });

      try {
        const results = await Promise.all(colorPromises);
        const colorsMap: ExtractedColors = {};

        results.forEach(({ index, gradient, textColor, isDark }) => {
          colorsMap[index] = { gradient, textColor, isDark };
        });

        setExtractedColors(colorsMap);
      } catch (error) {
        console.warn("Failed to extract colors:", error);
        // Use fallback colors
        const fallbackColors: ExtractedColors = {};
        blogPosts.forEach((post, index) => {
          const fallbackGradient = convertTailwindGradient(post.fallbackColor);
          fallbackColors[index] = {
            gradient: fallbackGradient,
            textColor: "text-white",
            isDark: true,
          };
        });
        setExtractedColors(fallbackColors);
      } finally {
        setIsLoadingColors(false);
      }
    };

    extractColors();
  }, [blogPosts]);

  return { extractedColors, isLoadingColors };
};
