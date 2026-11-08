# merttereci.github.io

My personal portfolio site, in Turkish and English: **https://merttereci.github.io**

It covers my projects in backend (Python, FastAPI), mobile (Flutter) and machine learning, along with my skills, contact details and CV.

## How it's built

- Plain HTML, CSS and JavaScript. No framework and no build step.
- Hosted on GitHub Pages straight from the `main` branch.
- The language is picked from the visitor's browser and can be switched with the TR / EN buttons. The choice is saved in `localStorage`.

## Structure

```
index.html   page content, both languages
css/         styles
js/          language switch, demo videos, image lightbox
assets/      screenshots, demo videos, CV (TR and EN)
.nojekyll    tells GitHub Pages to serve the files as they are
```

## Running locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server
```
