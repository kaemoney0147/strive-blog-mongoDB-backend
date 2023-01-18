import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import blogPostRouter from "./api/index.js";

const server = express();
const port = process.env.PORT;

//$$$$$$$$$$$$$$$$ MIDDLEWARES $$$$$$$$$$
server.use(cors());
server.use(express.json());

//$$$$$$$$$$$$$$$$ ENDPOINTS $$$$$$$$$$
server.use("/blogposts", blogPostRouter);

//$$$$$$$$$$$$$$$$ ERRORHANDLER $$$$$$$$$$
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
