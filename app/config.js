import winston from "winston";
import convict from "convict";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  )
});

const SCHEMA = {
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8888,
    env: "A_PORT",
    arg: "port"
  },
  shutdownTimeout: {
    doc: "Grace period after SIGINT/SIGTERM.",
    format: "duration",
    default: 1000,
    env: "A_SHUTDOWN_TIMEOUT"
  },
  user: {
    doc: "basic username",
    format: "String",
    default: null,
    env: "A_USER",
    arg: "user"
  },
  password: {
    doc: "basic password",
    format: "String",
    default: null,
    env: "A_PASSWORD",
    arg: "password"
  }
};

function load(configFile) {
  const CONFIG = convict(SCHEMA);
  try {
    if (configFile) {
      CONFIG.loadFile(configFile);
    }
    CONFIG.validate({ allowed: "strict" });
    return CONFIG.getProperties();
  } catch (e) {
    throw new Error(`error reading config: ${e}`);
  }
}

export { load, logger, SCHEMA };
