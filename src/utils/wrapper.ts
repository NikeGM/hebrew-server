
export const tryCatchWrapperAsync = async <T>(
  query: Promise<any>,
  message: string,
  emptyValue: T = null,
): Promise<T> => {
  const logger = console
  let result: T;
  try {
    result = await query;
    if (query['toSQL']) logger.debug(`query: ${JSON.stringify(query['toSQL']())}`);
    logger.debug(`${message}. Result: ${JSON.stringify(result)}`);
    logger.info(message);
  } catch (e) {
    logger.error(`${message} Error: ${e}, stack: ${JSON.stringify(e.stack)}`);
    result = emptyValue;
  }
  return result;
};
