import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { DateTime } from "luxon"; // Import Luxon for date formatting
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection("blog");
  const published = blog.filter((post) => !post.data.draft);

  return rss({
    stylesheet: "/myblog/pretty-feed-v3.xsl", // Make sure this XSL is properly placed in your public folder
    title: "will's blog",
    description: "sharing my favourite things",
    site: `${context.site}myblog`, // Use context.site to ensure the full site URL is used for the feed
    items: published.map((post) => ({
      title: post.data.title,
      pubDate: DateTime.fromJSDate(post.data.pubDate).toRFC2822(), // Proper RFC 2822 format for dates
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      link: `${context.site}myblog/blog/${post.id}`, // Full URL for the post
    })),
    customData: `<language>en-uk</language>`, // Language tag for the RSS feed
  });
}
