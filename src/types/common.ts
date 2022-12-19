import { IRoute as EIRoute, Router } from 'express';

export interface IRoute {
  router: Router;
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SearchDefaultParams {
  order?: Order;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

export interface RouteOptionsType {
  path: string;
  route: EIRoute;
}

export interface RouteType {
  path: string;
  route: EIRoute;
}

export enum PostgresArrayOperators {
  InOr = '<@',
  InAnd = '&&',
  Include = '@>'
}
