import vine from "@vinejs/vine";

const schema = vine
  .object({
    email: vine.string().email().normalizeEmail({ all_lowercase: true }),
  })
  .allowUnknownProperties();
const validator = vine.create(schema);

class UserValidator {
  static validate(data) {
    return validator.validate(data);
  }
}

export default UserValidator;
