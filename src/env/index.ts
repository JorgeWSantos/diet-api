import { config } from "dotenv";
import { z } from "zod";

config({});

const envSchema = z.object({
    DATABASE_CLIENT: z.string(),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(["development", "production", "test"]),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.log("😵‍💫 invalid enviroment variables");
    console.log("======== ========= ======== ========");
    console.log(_env.error.format());
    console.log("");
    throw new Error("Invalid enviroment variables");
}

export default _env.data;
