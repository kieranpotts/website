# Friendly URLs

"Pretty URLs" are enabled in Netlify for this website.

This means that any internal links, embedded within the HTML, get changed like this:

- `/about.html` -> `/about`
- `/about/index.html` -> `/about/`

We prefer the URL format _without_ a trailing slash, so we use the following directory structure for sub-sections:

```
./blog.md
./blog/post-slug-01.md
./blog/post-slug-02.md
./blog/post-slug-03.md
```

We do NOT use `index.md` files within sub-directories:

```
./blog/index.md
./blog/post-slug-01.md
./blog/post-slug-02.md
./blog/post-slug-03.md
```
