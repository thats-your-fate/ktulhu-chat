import React from "react";
import { Helmet } from "react-helmet-async";

export interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
}

const SITE_NAME = "Ktulhu";
const BASE_URL = "https://ktulhu.com";

export const Seo: React.FC<SeoProps> = ({
  title = "Ktulhu – AI Chat Assistant",
  description = "Ktulhu is your private-first AI chat assistant. Ask questions, explore ideas, and get instant insights with modern LLM models — running locally or in your cloud.",
  path = "/",
}) => {
  const url = `${BASE_URL}${path}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url,
    description,
    applicationCategory: "AI Assistant",
    browserRequirements: "Requires WebSocket connection for interactive responses",
    operatingSystem: "All",
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content="https://ktulhu.com/og-default.jpg"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content="https://ktulhu.com/og-default.jpg"
      />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};
