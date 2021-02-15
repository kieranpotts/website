# Build steps

```
nvm use (14.15.0)
yarn install
yarn run dev
```

Note, if you are using [NVM for Windows](https://github.com/coreybutler/nvm-windows), rather than the original [NVM for Mac/Linux](https://github.com/nvm-sh/nvm), then the `.nvmrc` file is [not supported](https://github.com/coreybutler/nvm-windows/issues/388) so you will need to specify the Node.js version number to use: `nvm use 14.15.0`.

Go to http://localhost:8000/

The SrcFlow.com website is a static site compiled using the [Eleventy](https://www.11ty.dev/) static site generator and deployed to [Netlify]().


