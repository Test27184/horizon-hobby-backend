import { App } from "./app";
import { MongooseClient } from "./clients/Mongoose.client";
import routes from "./routes";
(async () => {

  const app = new App(routes);
  //@ts-ignore
  await MongooseClient.connect(process.env.isDebugMode);

  const server = app.listen();
  server.setTimeout(18000000); // 30 minutes
})();
