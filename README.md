# Divyanshi — Architecture & Construction Portfolio

A responsive portfolio built with HTML, CSS, and vanilla JavaScript. The opening pairs Divyanshi's supplied portrait and editorial typography with a wide Chandigarh Railway Station thesis visualization and an inset of her field-experience photography. Deep charcoal, muted bronze, and warm off-white keep the presentation restrained. About appears before Selected Work. No installation, framework, or build step is required.

## Preview

Open `dist/index.html` in a browser, or serve the `dist` folder with any local web server. With Python installed, run `python -m http.server 8765 --directory dist` from this project folder, then visit `http://localhost:8765`.

## Key files

- `dist/index.html`: résumé-based content, four Selected Work tiles, experience, education, research, and contact links.
- `dist/railway-station.html`: dedicated thesis page with the complete gallery and an accessible drawing/visualization comparison slider. The comparison explicitly identifies different project views rather than suggesting an exact before-and-after match.
- `dist/styles.css`: responsive editorial layout, flat charcoal/bronze styling, touch-friendly controls, and reduced-motion support.
- `dist/script.js`: current year, active navigation, mobile menu, gentle cursor movement within the featured image, site-gallery deep link, and a slider supporting pointer drag, touch, and keyboard.
- `dist/assets/logo.svg`: custom architectural D monogram, used in navigation and as the favicon.
- `dist/assets/`: local project images, illustrative images, and the supplied résumé PDF. The `railway/` folder contains the supplied thesis visualizations and drawings; the `site/` folder contains supplied field-experience photographs in web-friendly format.
- `.github/workflows/deploy-pages.yml`: publishes the `dist` folder to GitHub Pages whenever `main` is updated.
- `.openai/hosting.json`: static output configuration retained for optional Sites hosting.

## Updating your work

Replace the illustrative residential, commercial, and construction images in `dist/assets/` with your own project photographs, update their alternative text, and remove the corresponding illustrative-image labels only when real project images are supplied. The Chandigarh Railway Station gallery uses the supplied thesis visualizations and boards. The railway station is an academic redevelopment proposal, not a built project. Current descriptions are based on the supplied résumé and do not invent project names, clients, outcomes, or completed AI coursework.

To add future AI course work, copy a research article in the AI section and replace the heading, description, and tags with the completed project's details.

The AI section includes an original SVG workflow: drawings/BIM, site observations, AI-assisted review, and human decisions. It is labeled as a conceptual research lens, not a completed implementation. The cursor indicator is limited to the featured railway image, and the normal pointer remains available throughout the website. Image motion is disabled when reduced motion is requested.

## Deployment

The portfolio is published with GitHub Pages at https://ihsnayvid25.github.io/divyanshi-portfolio/. Pushing changes to `main` automatically republishes the contents of `dist`. There is no server, database, contact-form service, or secret configuration. Contact uses email and LinkedIn links. The downloadable résumé contains the contact information from the supplied original PDF.

## Image credits

All three images are illustrative stock photography and are not represented as Divyanshi's projects. The images were sourced from Unsplash and downloaded locally under the Unsplash License: https://unsplash.com/license

- Residential: Fotografías inmobiliarias — https://unsplash.com/photos/a-white-house-with-a-green-lawn-in-front-of-it-LJhgmYcAVqU
- Commercial: T (@tanyabarrow) — https://unsplash.com/photos/modern-glass-building-reflecting-the-cloudy-sky-9dCMJL25DzI
- Construction: Gerrit Schwerzel — https://unsplash.com/photos/gray-and-black-metal-posts-at-daytime-itgxCM17U5A

Typography: DM Sans and Manrope via Google Fonts, with system fallbacks. Fonts require internet access; all other display assets are included locally.

## Validation performed

JavaScript syntax, local asset references, section anchor targets, HTML parsing, and local HTTP responses were checked. Browser review covers desktop and phone layouts, mobile navigation, field-gallery linking, and the comparison slider. Assignment screenshots and the build report should be refreshed after the final edits are published.
