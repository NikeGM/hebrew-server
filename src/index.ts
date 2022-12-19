require('dotenv').config();
import { ApiContainer } from './Container';

export const runClientApiServer = async (port) => {
  const container = new ApiContainer();
  const { api } = container;
  api.expressApp.listen(port, () => {
    console.log(`Started on port ${port}`);
  });
};


runClientApiServer(process.env.API_PORT).then();