import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function Seo({ title, description, image, type = "website" }) {
  const { t } = useTranslation();
  const fullTitle = title ? `${title} · devlog` : `devlog · ${t("seo.tagline")}`;
  const desc = description || t("seo.description");

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
    </Helmet>
  );
}
