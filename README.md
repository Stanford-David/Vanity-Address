## Offline generation tool for TRON's vanity address

Completely offline address generation and vanity address detection scheme. mainly depends on `tronweb`  `createAccount` funnction。

> This tool is only for technical discussion and communication, please do not use it for illegal purposes!

---

<b>Advertisement: This version is a web version, and the speed depends on the performance of the laptop. In addition, there is a second-level generation of beautiful account deployment services. If you need it, contact @VanityAddress by telegram.</b>

---


### what about this?

`vanity-address trx vanity address generator` It is a completely offline address generation and vanity number detection scheme. It is recommended that you download the source code, perform a code audit first, and then run the tool offline.

about `tronweb`，Please refer to the official documentation of TRON：[https://cn.developers.tron.network/reference/tronweb-object](https://cn.developers.tron.network/reference/tronweb-object)

The front-end uses `webworker` for multi-threaded processing to improve the generation and matching speed of good numbers.

### How to run?

- First download the source code of this warehouse
- Computer installation `nodejs`, version `>=14.16.0`. Baidu will not be installed directly
- Then install dependencies: `npm install`
- Run the tool: `npm run dev`
- Open the browser: `http://localhost:3000/tool/address`

Then you can run

### safety instructions

#### 1. Dependent three-party packages

The operation of the front-end project will depend on the third-party package posted below. For details, please refer to: `package.json`.

> These dependent packages are all official packages. If you have security concerns, you can go directly to: `https://www.npmjs.com/` to check in turn.

```javascript
"dependencies": {
  "@ant-design/icons": "^4.7.0",
  "antd": "4.23.6",
  "boring-avatars": "^1.7.0",
  "dayjs": "^1.11.6",
  "lodash.map": "^4.6.0",
  "lodash.random": "^3.2.0",
  "next": "latest",
  "nice-color-palettes": "^3.0.0",
  "react": "^18.2.0",
  "react-copy-to-clipboard": "^5.1.0",
  "react-dom": "^18.2.0",
  "zustand": "^4.1.4"
},
"devDependencies": {
  "@trivago/prettier-plugin-sort-imports": "^3.4.0",
  "less": "^4.1.3",
  "less-loader": "^11.1.0",
  "next-with-less": "^2.0.5",
  "prettier": "^2.7.1"
}
```

#### 2. The dependent `tronweb.js`

The `tronweb.js` needed to generate an account is located in the project `public/js/tronweb.js`, and a small change has been made to be compatible with the server-side rendering of `next.js`.

If you have security concerns, you can directly use the official `tronweb.js` for comparison. The official `tronweb.js` address is: `https://www.npmjs.com/package/tronweb`.

#### 3. About network requests: http://15.207.144.3:8090

To initialize the `tronweb` service, you need to specify it: `fullNode` && `solidityNode`. `15.207.144.3:8090` is the official service, please refer to for details：[https://cn.developers.tron.network/docs/networks#%E5%85%AC%E5%85%B1%E8%8A%82%E7%82%B9](https://cn.developers.tron.network/docs/networks#%E5%85%AC%E5%85%B1%E8%8A%82%E7%82%B9)

The initialization code is:

```javascript
async function generateAccount() {
  if (tronWeb === null) {
    tronWeb = new TronWeb({
      fullNode: 'http://15.207.144.3:8090',
      solidityNode: 'http://15.207.144.3:8091',
    });
  }
  return tronWeb.createAccount();
}
```

> For details, please refer to: `/public/js/worker.js`

### Have a question?

- telegram: https://t.me/VanityAddress
