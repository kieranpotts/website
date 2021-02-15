# Develop

There are two available commands to start a hot-reloading development server:

- `yarn run dev:start`: Rebuilds the website and serves it from **[http://localhost:8080/](http://localhost:8080/)**. Eleventy uses BrowserSync behind-the-scenes, so subsequent changes you make to the site's templates or content will be hot-reloaded in your browser. To do a fully clean build initially, first do `yarn run clean`.

- `yarn run dev:serve`: Does the same as `yarn run dev:start` but puts [Netlify Dev](https://www.netlify.com/products/dev/) in front of Eleventy's development server, and serves the website from a different port: **[http://localhost:8000/](http://localhost:8000/)**. This allows testing of custom headers, URL redirects and proxies, and serverless functions, without needing to deploy to Netlify itself. Note, this does not fully replicate the production infrastructure; production configuration such as friendly URLs are not available.
