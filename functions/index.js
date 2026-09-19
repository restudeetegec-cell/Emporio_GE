import path from "node:path";

import nunjucks from "nunjucks";

const templatesDirectory = path.join(process.cwd(), "templates");
const templates = nunjucks.configure(templatesDirectory, {
  autoescape: true,
  noCache: process.env.NODE_ENV !== "production",
});

export default function handler(_request, response) {
  const html = templates.render("index.html");

  response.setHeader("Content-Type", "text/html; charset=utf-8");
  return response.status(200).send(html);
}
