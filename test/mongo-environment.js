import NodeEnvironment from "jest-environment-node";
import fileSystem from "fs";
import pathSystem from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const globalConfigPathData = pathSystem.join(__dirname, "globalConfig.json");

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    const globalConfig = JSON.parse(
      fileSystem.readFileSync(globalConfigPathData, "utf-8")
    );
    this.global.__MONGO_URI__ = globalConfig.mongoUri;
    this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName;
    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

export default MongoEnvironment;
