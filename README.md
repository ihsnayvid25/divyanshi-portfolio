# Divyanshi — Architecture & Construction Portfolio

A responsive one-page portfolio built with HTML, CSS, and vanilla JavaScript. The hero pairs Divyanshi's supplied portrait with balanced editorial typography, a deep-charcoal and muted-bronze palette, subtle warm-gray technical drawings, gentle portrait parallax, and an architectural cursor. About appears before Selected Work so the project context follows the personal story. No installation, framework, or build step is required.

## Preview

Open `dist/index.html` in a browser, or serve the `dist` folder with any local web server. With Python installed, run `python -m http.server 8765 --directory dist` from this project folder, then visit `http://localhost:8765`.

## Key files

- `dist/index.html`: résumé-based content, four Selected Work tiles, experience, education, research, and contact links.
- `dist/railway-station.html`: dedicated Chandigarh Railway Station thesis page with the complete image and drawing gallery.
- `dist/styles.css`: responsive layout, animated ambient background, glass surfaces, and reduced-motion support.
- `dist/script.js`: current year, active navigation state, mobile navigation, and pointer/scroll-responsive effects with reduced-motion support.
- `dist/assets/logo.svg`: custom architectural D monogram, used in navigation and as the favicon.
- `dist/assets/`: local project images, illustrative images, and the supplied résumé PDF. The `railway/` folder contains the supplied thesis visualizations and drawings; the `site/` folder contains supplied field-experience photographs in web-friendly format.
- `.github/workflows/deploy-pages.yml`: publishes the `dist` folder to GitHub Pages whenever `main` is updated.
- `.openai/hosting.json`: static output configuration retained for optional Sites hosting.

## Updating your work

Replace the illustrative residential, commercial, and construction images in `dist/assets/` with your own project photographs, update their alternative text, and remove the corresponding illustrative-image labels only when real project images are supplied. The Chandigarh Railway Station gallery uses the supplied thesis visualizations and boards. The railway station is an academic redevelopment proposal, not a built project. Current descriptions are based on the supplied résumé and do not invent project names, clients, outcomes, or completed AI coursework.

To add future AI course work, copy a research article in the AI section and replace the heading, description, and tags with the completed project's details.

## Deployment

The portfolio is published with GitHub Pages at https://ihsnayvid25.github.io/divyanshi-portfolio/. Pushing changes to `main` automatically republishes the contents of `dist`. There is no server, database, contact-form service, or secret configuration. Contact uses email and LinkedIn links. The downloadable résumé contains the contact information from the supplied original PDF.

## Image credits

All three images are illustrative stock photography and are not represented as Divyanshi's projects. The images were sourced from Unsplash and downloaded locally under the Unsplash License: https://unsplash.com/license

- Residential: Fotografías inmobiliarias — https://unsplash.com/photos/a-white-house-with-a-green-lawn-in-front-of-it-LJhgmYcAVqU
- Commercial: T (@tanyabarrow) — https://unsplash.com/photos/modern-glass-building-reflecting-the-cloudy-sky-9dCMJL25DzI
- Construction: Gerrit Schwerzel — https://unsplash.com/photos/gray-and-black-metal-posts-at-daytime-itgxCM17U5A

Typography: DM Sans and Manrope via Google Fonts, with system fallbacks. Fonts require internet access; all other display assets are included locally.

## Validation performed

JavaScript syntax, local asset references, section anchor targets, HTML parsing, image readability, and local HTTP response were checked. Responsive CSS includes mobile breakpoints and reduced-motion behavior. Browser interaction testing and assignment screenshots have not yet been performed.
