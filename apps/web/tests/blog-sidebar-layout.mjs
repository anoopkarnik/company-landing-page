const baseUrl = process.env.BLOG_TEST_URL || "http://127.0.0.1:3000";
const response = await fetch(`${baseUrl}/blog`);

if (!response.ok) {
  throw new Error(`Blog page returned ${response.status}`);
}

const html = await response.text();
const title =
  "How to Upgrade a Customized SaaS Boilerplate Without Losing Your Changes";
const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const containedTitle = new RegExp(
  `<span[^>]*class="[^"]*min-w-0[^"]*truncate[^"]*"[^>]*>${escapedTitle}</span>`,
);

if (!containedTitle.test(html)) {
  throw new Error(
    "Long blog sidebar titles must render inside a single-line truncating span.",
  );
}

console.log("Blog sidebar contains long titles without overlap.");
