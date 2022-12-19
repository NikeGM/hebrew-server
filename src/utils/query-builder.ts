import { Order, PostgresArrayOperators, SearchDefaultParams } from '../types/common';

export const jsToPostgresArray = (array: string[] | number[] | boolean[]) => {
  return `ARRAY${JSON.stringify(array).replace(/"/g, '\'')}`;
};

export const addOffsetFilter = (
  query,
  filters: { offset?: number; order?: Order }
) => {
  const { offset } = filters;
  if (offset) query.offset(offset);
  return query;
};

export const addLimitFilter = (query, filters: { limit?: number }) => {
  const { limit } = filters;
  if (limit) query.limit(limit);
  return query;
};

export const addOrderByFilter = (
  query,
  filters: { order?: Order; orderBy?: string },
  isString: boolean,
  idName: string,
  randomSort: boolean,
  join: boolean = false
) => {
  const { orderBy, order } = filters;
  if (randomSort) {
    query.orderByRaw('random()');
    return query;
  }
  if (orderBy && order) {
    if (isString) {
      if (!join) {
        query.orderByRaw(`"${orderBy}"::bigint ${order}`);
      } else {
        query.orderByRaw(`${orderBy}::bigint ${order}`);
      }
    } else {
      query.orderBy(orderBy, order);
    }
  }
  return query;
};

export const addLimitFilters = (
  query,
  filters: SearchDefaultParams,
  isString: boolean,
  idName: string,
  randomSort: boolean,
  join: boolean = false
) => {
  addOffsetFilter(query, filters);
  addOrderByFilter(query, filters, isString, idName, randomSort, join);
  addLimitFilter(query, filters);
  return query;
};

export const addWhereInFilter = (query, column: string, value: string[] | number[] | boolean[]) => {
  if (value && value.length) query.whereIn(column, value);
  return query;
};


export const addWhereInRange = (query, column: string, isString: boolean, minValue?: number | string, maxValue?: number | string) => {
  if (isString) {
    if (maxValue !== null && maxValue !== undefined) {
      query.andWhereRaw(`${column}::bigint < ${maxValue}`);
    }
    if (minValue !== null && minValue !== undefined) {
      query.andWhereRaw(`${column}::bigint > ${minValue}`);
    }
  } else {
    if (maxValue !== null && maxValue !== undefined) {
      query.andWhereRaw(`${column} < ${maxValue}`);
    }
    if (minValue !== null && minValue !== undefined) {
      query.andWhereRaw(`${column} > ${minValue}`);
    }
  }
  return query;
};

export const addWhereNotInFilter = (query, column: string, value: string[] | number[] | boolean[]) => {
  if (value && value.length) query.whereNotIn(column, value);
  return query;
};

export const addWhereFilter = (query, column: string, value: string | number | boolean) => {
  if (value || value === false || value === 0) query.where(column, value);
  return query;
};

export const addOnlyFilter = (query, column: string, value: boolean, flag: boolean) => {
  if (flag) query.where(column, value);
  return query;
};

export const addLikeFilter = (query, column: string, value: string) => {
  if (value) query.whereRaw(`LOWER("${column}") like ?`, `%${value.toLowerCase()}%`);
  return query;
};


export const addJsonFilter = (query, column: string, field: string, value: string) => {
  if (value) query.whereRaw(`${column}::json->>'${field}'=?`, value);
  return query;
};

export const addWhereInArrayFilter = (
  query,
  column: string,
  value: string[] | number[] | boolean[],
  operator: PostgresArrayOperators
) => {
  if (value && value.length) query.whereRaw(`${jsToPostgresArray(value)} ${operator} "${column}"`);
  return query;
};
