const fs = require('fs');

const interviews = require('./data/interviews.json');

const imageMap = {
  "ellen-huet": "/images/ellen-huet.jpg",
  "leigh-honeywell": "/images/leigh-honeywell.jpg",
  "bianca-st-louis": "/images/bianca-st-louis.jpg",
  "hunter-walk": "/images/hunter-walk.jpg",
  "tracy-chou": "/images/tracy-chou.jpg",
  "christina-wallace": "/images/christina-wallace.jpg",
  "jacob-thornton": "/images/jacob-thornton.jpg",
  "jenn-schiffer": "/images/jenn-schiffer.jpg",
  "noah-kulwin": "/images/noah-kulwin.jpg",
  "omayeli-arenyeka": "/images/omayeli-arenyeka.jpg",
  "paul-ford": "/images/paul-ford.jpg",
};

const outDir = './dist';

// Clean and create dist
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true });
}
fs.mkdirSync(outDir);
fs.mkdirSync(`${outDir}/css`);
fs.mkdirSync(`${outDir}/js`);
fs.mkdirSync(`${outDir}/images`);
fs.mkdirSync(`${outDir}/about`);

// Copy images
const imagesDir = './public/images';
fs.readdirSync(imagesDir).forEach(file => {
  fs.copyFileSync(`${imagesDir}/${file}`, `${outDir}/images/${file}`);
});

const header = `
<header>
  <div class="header-inner">
    <div class="header-spacer"></div>
    <a href="/" class="logo">
      <h1>The Framework Project</h1>
      <div class="logo-underline"></div>
    </a>
    <a href="/about/" class="about-link">About</a>
  </div>
</header>
<div class="header-offset"></div>
`;

const footer = `<footer></footer>`;

const htmlHead = (title, description = "Conversations with people thinking about tech and its impact on society.") => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;').substring(0, 160)}">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
`;

const htmlEnd = `
</body>
</html>`;

// Homepage
const homepageGrid = interviews.map(i => `
  <a href="/${i.slug}/" class="interview-card">
    <div class="interview-image">
      <img src="${imageMap[i.slug]}" alt="${i.name}">
    </div>
    <h2>${i.name}</h2>
  </a>
`).join('');

const homepage = `${htmlHead('The Framework Project')}
${header}
<main>
  <div class="homepage-grid">
    ${homepageGrid}
  </div>
</main>
${footer}
${htmlEnd}`;

fs.writeFileSync(`${outDir}/index.html`, homepage);

// About page
const aboutPage = `${htmlHead('About | The Framework Project')}
${header}
<main>
  <div class="about-content">
    <p>
      The Framework Project is an interview series with individuals in tech
      who spend a lot of time thinking about tech and its impact on society.
      It builds toward creating a framework for thinking about problems like
      the ethical obligations of the tech industry, the outsize impact of
      current decisions on the future, and the effect of technology on human
      behavior and interpersonal relationships.
    </p>
    <p>
      The project is run by Jackie Luo, a philosophy major and now software
      engineer in San Francisco with a lot of questions and some free time.
    </p>
  </div>
</main>
${footer}
${htmlEnd}`;

fs.writeFileSync(`${outDir}/about/index.html`, aboutPage);

// Helper to extract intro from content if not in excerpt
function getIntro(interview) {
  if (interview.intro && interview.intro.trim()) {
    return interview.intro;
  }
  // Extract from h3 tags at start of content
  const h3Match = interview.content.match(/<h3[^>]*>([\s\S]*?)<\/h3>/g);
  if (h3Match) {
    return h3Match.map(h => h.replace(/<[^>]+>/g, '').trim()).join('\n\n');
  }
  return '';
}

// Helper to get main content (after the intro h3s and hr)
function getMainContent(content) {
  // Remove the intro div with h3s
  let main = content.replace(/<div class="sqs-html-content"[^>]*>\s*<h3[\s\S]*?<\/div>\s*<hr\s*\/?>/i, '');
  // Clean up Squarespace wrapper divs
  main = main.replace(/<div class="sqs-html-content"[^>]*>/g, '');
  main = main.replace(/<\/div>\s*<div class="sqs-html-content"[^>]*>/g, '');
  main = main.replace(/<\/div>\s*$/g, '');
  return main.trim();
}

// Interview pages
interviews.forEach((interview, index) => {
  const prev = index > 0 ? interviews[index - 1] : null;
  const next = index < interviews.length - 1 ? interviews[index + 1] : null;

  const intro = getIntro(interview);
  const introHtml = intro.split('\n\n').map(p => `<p>${p}</p>`).join('');
  const mainContent = getMainContent(interview.content);

  const navHtml = `
    <nav class="interview-nav">
      ${prev ? `
        <a href="/${prev.slug}/" class="nav-prev">
          <div class="nav-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
          <div class="nav-preview">
            <img src="${imageMap[prev.slug]}" alt="${prev.name}">
            <span>${prev.name}</span>
          </div>
        </a>
      ` : ''}
      ${next ? `
        <a href="/${next.slug}/" class="nav-next">
          <div class="nav-preview">
            <span>${next.name}</span>
            <img src="${imageMap[next.slug]}" alt="${next.name}">
          </div>
          <div class="nav-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </a>
      ` : ''}
    </nav>
  `;

  const page = `${htmlHead(`${interview.name} | The Framework Project`, intro.substring(0, 160))}
${header}
<main>
  ${navHtml}
  <article class="interview">
    <div class="hero-image">
      <img src="${imageMap[interview.slug]}" alt="${interview.name}">
    </div>
    <div class="interview-body">
      <h1>${interview.name}</h1>
      <div class="interview-intro">
        ${introHtml}
      </div>
      <hr>
      <div class="interview-content">
        ${mainContent}
      </div>
    </div>
  </article>
</main>
${footer}
${htmlEnd}`;

  fs.mkdirSync(`${outDir}/${interview.slug}`);
  fs.writeFileSync(`${outDir}/${interview.slug}/index.html`, page);
});

// CSS
const css = `
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --purple: #7c3aed;
}

body {
  font-family: "Roboto Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.01em;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Header */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: white;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
}

.header-spacer {
  width: 3rem;
}

.logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  text-align: center;
}

.logo-underline {
  height: 3px;
  background: black;
  margin-top: 0.25rem;
}

.about-link {
  font-size: 0.875rem;
  color: #6b7280;
  transition: color 0.2s;
}

.about-link:hover {
  color: black;
}

.header-offset {
  height: 8rem;
}

/* Footer */
footer {
  padding: 4rem 0;
}

/* Homepage */
.homepage-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem 2rem;
  padding: 4rem 6rem;
}

@media (max-width: 1024px) {
  .homepage-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 3rem 4rem;
  }
}

.interview-card {
  display: block;
}

.interview-card .interview-image {
  aspect-ratio: 2/3;
  overflow: hidden;
  background: #f3f4f6;
}

.interview-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.interview-card h2 {
  margin-top: 1.5rem;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
}

@media (min-width: 1024px) {
  .interview-card h2 {
    font-size: 1.125rem;
  }
}

/* About page */
.about-content {
  max-width: 36rem;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.about-content p {
  margin-bottom: 1.25rem;
  line-height: 1.7;
}

/* Interview page */
.interview {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-image {
  aspect-ratio: 2/3;
  overflow: hidden;
  background: #f3f4f6;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.interview-body {
  padding-bottom: 3rem;
}

.interview h1 {
  font-size: 2.25rem;
  font-weight: 450;
  letter-spacing: -0.025em;
  text-align: center;
  margin: 4rem 0 3.5rem;
}

@media (min-width: 1024px) {
  .interview h1 {
    font-size: 3rem;
  }
}

.interview-intro {
  font-size: 23px;
  line-height: 1.3;
  font-weight: 450;
  margin-bottom: 4rem;
}

.interview-intro p {
  margin-bottom: 23px;
}

.interview hr {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 3.5rem 0;
}

/* Interview content */
.interview-content {
  font-size: 1rem;
  line-height: 1.75;
}

.interview-content p {
  margin-bottom: 1.25rem;
}

.interview-content a {
  color: var(--purple);
}

.interview-content a:hover {
  text-decoration: underline;
}

.interview-content strong {
  display: block;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  text-transform: uppercase;
}

/* Pull quotes */
.interview-content figure {
  margin: 3.5rem 0;
}

.interview-content blockquote {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.interview-content blockquote span {
  display: none;
}

.interview-content figure:nth-of-type(3n+1) {
  width: 65%;
  float: right;
  margin-left: 2rem;
  margin-right: -30%;
  clear: both;
}

.interview-content figure:nth-of-type(3n+2) {
  width: 65%;
  float: left;
  margin-right: 2rem;
  margin-left: -30%;
  clear: both;
}

.interview-content figure:nth-of-type(3n) {
  width: 100%;
  text-align: center;
  margin: 4rem 0;
  clear: both;
}

@media (max-width: 1200px) {
  .interview-content figure:nth-of-type(3n+1),
  .interview-content figure:nth-of-type(3n+2) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    text-align: center;
  }
}

.interview-content::after {
  content: "";
  display: table;
  clear: both;
}

/* Navigation arrows */
.interview-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 40;
}

.nav-prev, .nav-next {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: auto;
}

.nav-prev {
  left: 0;
}

.nav-next {
  right: 0;
}

.nav-arrow {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: color 0.2s;
}

.nav-prev:hover .nav-arrow,
.nav-next:hover .nav-arrow {
  color: black;
}

.nav-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  transition: max-width 0.3s ease-out, opacity 0.3s ease-out;
}

.nav-prev .nav-preview {
  padding-right: 1rem;
}

.nav-next .nav-preview {
  padding-left: 1rem;
}

.nav-prev:hover .nav-preview,
.nav-next:hover .nav-preview {
  max-width: 20rem;
  opacity: 1;
}

.nav-preview img {
  width: 4rem;
  height: 5rem;
  object-fit: cover;
  flex-shrink: 0;
}

.nav-preview span {
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
}
`;

fs.writeFileSync(`${outDir}/css/styles.css`, css);

console.log('Build complete! Output in ./dist');
console.log(`Generated ${interviews.length} interview pages`);
