/**
 * @description API 3d-inventory. Project is a simple solution that allows you to build a spatial and database representation of all types of warehouses and server rooms.
 * @public
 */

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import figlet from 'figlet';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import methodOverride from 'method-override';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import YAML from 'yaml';

import attributes from './routers/attributes';
import attributesDictionary from './routers/attributesDictionary';
import connections from './routers/connections';
import devices from './routers/devices';
import floors from './routers/floors';
import github from './routers/github';
import logs from './routers/logs';
import models from './routers/models';
import readme from './routers/readme';

import config from './utils/config';
import log from './utils/logger';

const logger = log('index');

const PORT = config.PORT;
const HOST = config.HOST;

const httpsOptions = {
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.crt'),
};

const yamlFilename = process.env.API_YAML_FILE ?? './api.yaml';

const app = express();

app.use(cookieParser());
app.use(helmet());

try {
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: {
        write: (message: string) => {
          logger.info(message.trim());
          return true;
        },
      },
    }),
  );
} catch (error) {
  logger.error(`Error login in morgan: ${String(error)}`);
}

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    `https://${HOST}:${PORT}`,
    'https://172.17.0.2:3001',
    'https://172.17.0.3:3001',
    'https://172.20.0.2:3001',
    'https://172.20.0.3:3001',
    'https://cluster0.htgjako.mongodb.net',
    'https://localhost:3000',
    'https://localhost:8080',
    'https://0.0.0.0:8080',
  ];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use((_req, res: Response, next: NextFunction) => {
  res.header(
    'Content-Security-Policy',
    "default-src 'self'; connect-src *; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  );
  next();
});

app.use(express.json());
app.use(bodyParser.json()); // must parse body before morganBody as body will be logged

morganBody(app, {
  noColors: false,
  logReqDateTime: false,
  //dateTimeFormat: 'clf',
  logReqUserAgent: false,
  logIP: false,
  theme: 'darkened',
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
      return true;
    },
  },
});

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride());

// Register API routers
app.use('/readme', readme);
app.use('/logs', logs);
app.use('/devices', devices);
app.use('/models', models);
app.use('/attributes', attributes);
app.use('/attributesDictionary', attributesDictionary);
app.use('/connections', connections);
app.use('/floors', floors);
app.use('/github', github);

fs.access(yamlFilename, fs.constants.R_OK, (err: NodeJS.ErrnoException | null) => {
  if (err) {
    if (err.code === 'ENOENT') {
      logger.warn(`File not found: ${yamlFilename}`);
    } else if (err.code === 'EACCES') {
      logger.error(`No permission to file ${yamlFilename}`);
    } else {
      logger.error('Unknown Error during access api.yaml: ' + err.message);
    }
  } else {
    logger.info(`File api.yaml opened successfully from ${yamlFilename}`);
  }
});

try {
  const file = fs.readFileSync(yamlFilename, 'utf8');
  const swaggerDocument = YAML.parse(file) as JsonObject;
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.info(`swaggerDocument api.yaml served successfully load ${JSON.stringify(swaggerDocument).length} bytes`);
} catch (e) {
  if (typeof e === 'string') {
    logger.warn(e.toUpperCase());
  } else if (e instanceof Error) {
    logger.error('Open swaggerUI exception: ' + e.message);
  } else {
    logger.error('Unknown error occurred.');
  }
}

// OpenApi validation
try {
  app.use(
    OpenApiValidator.middleware({
      apiSpec: yamlFilename,
      validateRequests: true,
      validateResponses: true,
    }),
  );
  logger.info(`OpenApiValidator api.yaml served successfully from ${yamlFilename}`);
} catch (error) {
  logger.error(`OpenApiValidator: ${String(error)}`);
}

// Error-related middleware (404 and error handlers) grouped together for clarity

app.use((req: Request, res: Response) => {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Endpoint not found',
    error: 'Not Found',
    status: 404,
  });
});

// XHR client error handler
function xhrClientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    logger.error(err);
    res.status(500).json({
      message: 'Something failed!',
    });
    next(err);
  } else {
    next(err);
  }
}
app.use(xhrClientErrorHandler);

// General error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}. Stack: ${err.stack}`);
  next(err);
});

//
// httpsServer
//
const nl = '\n';
const httpsServer = https.createServer(httpsOptions, app);
const server = httpsServer.listen(Number(PORT), HOST, () => {
  logger.info(
    `${nl}` +
      figlet.textSync('3d-inventory-mongo-api', {
        font: 'Mini',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 160,
        whitespaceBreak: true,
      }),
  );
  logger.info(`Server on https://${HOST}:${PORT}`);
  logger.info(`Atlas MongoDb: https://cloud.mongodb.com/v2/6488bf6ff7acab10310111b5#/overview db: ${process.env.DBNAME}`);
});

server.on('error', (err: Error) => {
  logger.error(`Error listen on address https://${HOST}:${PORT}: ${String(err)}`);
});

server.on('error', (e) => {
  if (typeof (e as any).code === 'string' && (e as any).code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 2000);
  }
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTPS server.');
  server.close(() => {
    logger.debug('HTTPS server closed');
    process.exit(0);
  });
});

export default server;
