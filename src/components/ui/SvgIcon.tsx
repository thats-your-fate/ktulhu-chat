import React, { useEffect, useState } from "react";

interface SvgIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Inline SVG loader that preserves outline/fill logic.
 * Converts all color values (#000, etc.) to currentColor
 * but doesn’t fill empty shapes.
 */
export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  size = 24,
  color,
  className = "",
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    const sanitizedName = name
      .toLowerCase()
      .replace(/\s+/g, "%20")
      .replace(/[()]/g, (m) => encodeURIComponent(m));

    fetch(`/svg/${sanitizedName}.svg`)
      .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
      .then((text) => {
        let cleaned = text;

        // Replace any color values with currentColor but leave "none" untouched
        cleaned = cleaned
          .replace(/stroke="#?[0-9A-Fa-f]{3,6}"/g, `stroke="currentColor"`)
          .replace(/fill="#?[0-9A-Fa-f]{3,6}"/g, `fill="currentColor"`)
          // preserve fill="none"
          .replace(/fill="none"/g, `fill="none"`);

        // For <style> blocks, only swap color values, don't force fills
        cleaned = cleaned.replace(
          /<style[^>]*>([\s\S]*?)<\/style>/g,
          (_, css) => {
            return `<style>${css
              .replace(/stroke:\s*#[0-9A-Fa-f]{3,6}/g, "stroke: currentColor")
              .replace(/fill:\s*#[0-9A-Fa-f]{3,6}/g, "fill: currentColor")}</style>`;
          }
        );

        setSvgContent(cleaned);
      })
      .catch((err) => {
        console.warn(`⚠️ Could not load SVG: ${name}`, err);
        setSvgContent(null);
      });
  }, [name]);

  if (!svgContent) return null;

  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-block",
        lineHeight: 0,
        color: color ?? "currentColor",
      }}
      dangerouslySetInnerHTML={{
        __html: svgContent.replace(
          /<svg /,
          `<svg width="${size}" height="${size}" `
        ),
      }}
    />
  );
};
