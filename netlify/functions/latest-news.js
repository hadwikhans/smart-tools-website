const FEEDS = [
  { url: "https://www.gadgets360.com/rss/news", category: "News" },
  { url: "https://www.gadgets360.com/rss/mobiles/feeds", category: "Mobiles" },
  { url: "https://www.gadgets360.com/rss/ai/feeds", category: "AI" },
  { url: "https://www.gadgets360.com/rss/apps/feeds", category: "Apps" },
  { url: "https://www.gadgets360.com/rss/science/feeds", category: "Science" },
  { url: "https://www.gadgets360.com/rss/gaming/feeds", category: "Gaming" }
];

function decodeXml(text) {
  return String(text || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#038;/g, "&");
}

function stripHtml(text) {
  return decodeXml(text).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function summarize(text) {
  const clean = stripHtml(text);
  if (!clean) return "Open the full story for more details.";
  return clean.length > 170 ? `${clean.slice(0, 167).trim()}...` : clean;
}

function parseFeed(xml, fallbackCategory) {
  const items = [];
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

  for (const block of blocks) {
    const title = stripHtml(extractTag(block, "title"));
    const link = stripHtml(extractTag(block, "link"));
    const pubDate = stripHtml(extractTag(block, "pubDate"));
    const category = stripHtml(extractTag(block, "category")) || fallbackCategory;
    const description = summarize(extractTag(block, "description"));

    if (!title || !link) continue;

    const parsedDate = pubDate ? new Date(pubDate) : null;
    items.push({
      title,
      link,
      category,
      date: parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null,
      summary: description
    });
  }

  return items;
}

exports.handler = async function() {
  try {
    const responses = await Promise.all(
      FEEDS.map(async function(feed) {
        try {
          const response = await fetch(feed.url, {
            headers: {
              "user-agent": "SmartToolsHub-News/1.0"
            }
          });
          if (!response.ok) {
            return [];
          }
          const xml = await response.text();
          return parseFeed(xml, feed.category);
        } catch (error) {
          return [];
        }
      })
    );

    const deduped = [];
    const seen = new Set();

    responses.flat().forEach(function(item) {
      if (seen.has(item.link)) return;
      seen.add(item.link);
      deduped.push(item);
    });

    deduped.sort(function(a, b) {
      const left = a.date ? new Date(a.date).getTime() : 0;
      const right = b.date ? new Date(b.date).getTime() : 0;
      return right - left;
    });

    if (!deduped.length) {
      throw new Error("No feed items available");
    }

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=900, s-maxage=3600, stale-while-revalidate=43200"
      },
      body: JSON.stringify({
        sourceAttribution: "Gadgets 360",
        updatedAt: new Date().toISOString(),
        items: deduped.slice(0, 12)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60"
      },
      body: JSON.stringify({
        error: "Unable to load live news right now."
      })
    };
  }
};
