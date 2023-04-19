## 波场靓号离线生成工具

完全离线的地址生成和靓号检测方案。主要依赖于 `tronweb` 的 `createAccount` 方法。

> 本工具仅做技术讨论及交流，请勿将其用于非法用途！

---

<b>广告：此版本为网页版本，速度依赖于笔记本电脑的性能,另外有秒级生成的靓号部署服务,有需要电脑联系 @VanityAddress 。</b>

---


### 这个呢？

`vanity-address trx靓号生成器` 是完全离线的地址生成和靓号检测方案。建议你下载源码，先进行代码审计，然后离线运行该工具。

关于 `tronweb`，请参阅波场官方文档：[https://cn.developers.tron.network/reference/tronweb-object](https://cn.developers.tron.network/reference/tronweb-object)

前端使用了 `webworker` 进行多线程处理，提升靓号生成及匹配速度。

### 如何运行?

- 先下载本仓库源代码
- 电脑安装 `nodejs`，版本 `>=14.16.0`。不会安装的直接百度
- 然后安装依赖：`npm install`
- 运行工具：`npm run dev`
- 浏览器打开：`http://localhost:3000/tool/address`

然后就可以跑起来了

### 安全说明

#### 1. 依赖的三方包

前端项目运行会依赖于下方贴出的第三方包，详情可参考：`package.json`.

> 这些依赖包均为官方包，有安全顾虑的可直接前往：`https://www.npmjs.com/` 依次查询。

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

#### 2. 依赖的 `tronweb.js`

生成账号需要的 `tronweb.js` 位于项目 `public/js/tronweb.js`，做了一个小改动，兼容 `next.js` 的服务端渲染。

如有安全顾虑，可直接使用官方的 `tronweb.js` 与其进行比对。官方 `tronweb.js` 地址为：`https://www.npmjs.com/package/tronweb`.

#### 3. 关于网络请求：http://15.207.144.3:8090

初始化 `tronweb` 服务，需要指定其：`fullNode` && `solidityNode`。`15.207.144.3:8090` 为官方提供的服务，详情可参考：[https://cn.developers.tron.network/docs/networks#%E5%85%AC%E5%85%B1%E8%8A%82%E7%82%B9](https://cn.developers.tron.network/docs/networks#%E5%85%AC%E5%85%B1%E8%8A%82%E7%82%B9)

其中初始化代码为：

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

> 详情可参考：`/public/js/worker.js`

### 有问题咨询？

- telegram: https://t.me/VanityAddress
