import DOMPurify from "dompurify";
import slugify from "./slugify";

export function prepareContent(html) {
  const clean = DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
  const doc = new DOMParser().parseFromString(clean, "text/html");
  const headings = [];
  const used = new Set();

  doc.querySelectorAll("h1, h2, h3").forEach((el) => {
    let id = slugify(el.textContent) || "section";
    while (used.has(id)) id = `${id}-1`;
    used.add(id);
    el.id = id;
    headings.push({ id, text: el.textContent, level: el.tagName === "H3" ? 3 : 2 });
  });

  doc.querySelectorAll("a[href^='http']").forEach((a) => {
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noreferrer");
  });

  return { html: doc.body.innerHTML, headings };
}
