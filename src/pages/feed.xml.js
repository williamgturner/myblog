import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { DateTime } from "luxon";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection("blog");
  const published = blog.filter((post) => !post.data.draft);

  return rss({
    stylesheet: "/myblog/pretty-feed-v3.xsl",
    title: "will's blog",
    description: "sharing my favourite things",
    site: `${context.site}myblog`,
    items: published.map((post) => ({
      title: post.data.title,
      pubDate: DateTime.fromJSDate(post.data.pubDate).toRFC2822(),
      image: `${context.site}${post.data.image.url}`,
      description: post.data.description,
      content: sanitizeHtml(
        `<img src="${context.site}${post.data.image.url}" alt="${post.data.image.alt}" style="max-width:100%;height:auto;"><br/>` +
          parser.render(post.body),
        {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt", "style"],
          },
        }
      ),
      link: `${context.site}myblog/blog/${post.id}`,
    })),
    customData: `<language>en-uk</language>`,
  });
}
