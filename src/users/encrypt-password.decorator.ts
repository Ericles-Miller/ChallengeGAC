import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { hash } from 'bcryptjs';

export function EncryptPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'encryptPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          if (!value) return false;

          const hashedPassword = await hash(value, 8);
          (args.object as any)[propertyName] = hashedPassword;
          return true;
        },
      },
    });
  };
}
