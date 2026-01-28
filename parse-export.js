const fs = require('fs');

const xml = fs.readFileSync('/Users/jackieluo/Downloads/Squarespace-Wordpress-Export-01-27-2026.xml', 'utf-8');

const interviews = [];

// Match each item that's an interview
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;

while ((match = itemRegex.exec(xml)) !== null) {
  const item = match[1];

  // Check if it's an interview (in interviews category or post type)
  if (!item.includes('/interviews/')) continue;

  // Extract fields
  const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
  const slug = item.match(/<wp:post_name>(.*?)<\/wp:post_name>/)?.[1] || '';
  const content = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || '';
  const excerpt = item.match(/<excerpt:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/excerpt:encoded>/)?.[1] || '';
  const date = item.match(/<wp:post_date>(.*?)<\/wp:post_date>/)?.[1] || '';

  if (slug && content) {
    interviews.push({
      slug,
      name: title,
      date,
      intro: excerpt.trim(),
      content: content.trim(),
    });
  }
}

console.log(`Found ${interviews.length} interviews`);

// Write to data folder
fs.mkdirSync('./data', { recursive: true });
fs.writeFileSync('./data/interviews.json', JSON.stringify(interviews, null, 2));
console.log('Saved to ./data/interviews.json');
