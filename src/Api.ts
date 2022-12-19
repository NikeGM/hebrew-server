import express from 'express';
import bodyParser from 'body-parser';
import { RouteOptionsType } from './types/common';
const fileUpload = require('express-fileupload');

export class Api {
  private app;
  private readonly api;
  private readonly options;

  constructor(
    private readonly routes: RouteOptionsType[]
  ) {
    this.api = express.Router();
    this.routes.forEach(({ route, path }) => {
      this.api.use(path, route.router);
    });
    this.options = {
      swaggerDefinition: {
        info: {
          title: 'Client-api',
          version: '0.0.1'
        }
      },
      apis: ['src//routes/*/*.yml', 'src/routes/*/*/*.yml']
    };
  }

  get expressApp() {
    if (!this.app) {
      this.app = express();

      this.app.use(function (req, res, next) {
        if (process.env.NODE_ENV === 'LOCAL') {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
          res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        }
        //intercepts OPTIONS method
        if ('OPTIONS' === req.method) {
          //respond with 200
          res.sendStatus(200);
        } else {
          //move on
          next();
        }
      });

      this.app.use(fileUpload({}));
      this.app.use(express.static('public'));
      this.app.use(bodyParser.urlencoded({ extended: true }));
      this.app.use(bodyParser.json({ limit: '3mb' }));

      // api router
      this.app.use('/api', this.api);
    }
    return this.app;
  }
}