﻿# 3d-inventory-mongo-api

1. [3d-inventory-mongo-api](#3d-inventory-mongo-api)
   1. [Purposes](#purposes)
   2. [Architecture](#architecture)
   3. [Data Model](#data-model)
   4. [API documentation](#api-documentation)
   5. [Install](#install)

[![wakatime](https://wakatime.com/badge/user/3bbeedbe-0c6a-4a01-b3cd-a85d319a03bf/project/018c29b5-69aa-44a9-823a-51170ee4eafb.svg)](https://wakatime.com/badge/user/3bbeedbe-0c6a-4a01-b3cd-a85d319a03bf/project/018c29b5-69aa-44a9-823a-51170ee4eafb)[![GitHub latest commit](https://badgen.net/github/last-commit/karol-preiskorn/3d-inventory-mongo-api)](https://GitHub.com/karol-preiskorn/3d-inventory-mongo-api/commit/)[![GitHub issues](https://img.shields.io/github/issues/karol-preiskorn/3d-inventory-mongo-api.svg)](https://GitHub.com/karol-preiskorn/3d-inventory-mongo-api/issues/)[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)[![Npm package version](https://badgen.net/npm/v/express)](https://npmjs.com/package/express)[![GitHub license](https://badgen.net/github/license/karol-preiskorn/3d-inventory-mongo-api)](https://github.com/karol-preiskorn/3d-inventory-mongo-api/blob/master/LICENSE)[![GitHub stars](https://img.shields.io/github/stars/karol-preiskorn/3d-inventory-mongo-api.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/karol-preiskorn/3d-inventory-mongo-api/stargazers/)

## Purposes

Create REST API for [✨3d-inventory✨](https://github.com/users/karol-preiskorn/3d-inventory-angular-ui) application connected to Mongo Atlas — solution that allows you to build a spatial and database representation of yours datacenters.

## Architecture

![Architecture ✨3d-inventory✨ Mongo API](https://github.com/karol-preiskorn/3d-inventory-mongo-api/blob/main/src/assets/architecture.drawio.png)

    MEAN stack

- `MongoDB` is a `NoSQL` database that stores data in a flexible, `JSON`-like format.
- `Express.js` is a web application framework for Node.js that simplifies the process of building web servers and APIs.
- `RxJs` [Reactive Extensions Library for JavaScript](https://rxjs.dev/).
- `Node.js` is a `JavaScript` runtime that allows you to run 1JavaScript1 code on the server-side.

## Data Model

![Data Model](/assets/3d-inventory-data-model.png)

## API documentation

[Swagger](https://app.swaggerhub.com/apis/karol-preiskorn/3d-inventory-rest-api/0.0.6#/) API definition.

## Install

```bash
npm install
npm start
```
