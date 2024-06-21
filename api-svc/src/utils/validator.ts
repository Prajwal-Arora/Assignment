import Joi, { ValidationResult, Schema } from 'joi';
import { UserI } from '../interfaces/users.interface';

function validateUserParams(object: UserI): ValidationResult {
  const schema: Schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string(),
  });

  const result: ValidationResult = schema.validate(object);
  return result;
}

export { validateUserParams };
