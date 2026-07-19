import vine from "@vinejs/vine";
import { users } from "../db/schema.js";
import uniqueRule from "../rules/unique.js";

const schema = vine
  .object({
    email: vine
      .string()
      .email()
      .normalizeEmail({ all_lowercase: true })
      .use(uniqueRule({ schema: users })),
  })
  .allowUnknownProperties();
const validator = vine.create(schema);

class UserValidator {
  static validate(data) {
    return validator.validate(data, { meta: { db } });
  }
}

export default UserValidator;
