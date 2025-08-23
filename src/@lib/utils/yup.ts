import { IBaseResponse } from '@base/interfaces';
import * as yup from 'yup';

export const PartialType = <T extends yup.AnyObjectSchema>(schema: T) => {
  const fields = schema.fields;
  const newFields: Record<string, yup.AnySchema> = {};

  for (const key in fields) {
    const field = fields[key];

    if (yup.isSchema(field)) {
      newFields[key] = (field as yup.AnySchema).notRequired();
    }
  }

  return yup.object(newFields) as yup.ObjectSchema<Partial<yup.InferType<T>>>;
};

export const PickType = <T extends yup.AnyObjectSchema, K extends keyof yup.InferType<T>>(schema: T, keys: K[]) => {
  const fields = schema.fields;
  const newFields: Record<string, yup.AnySchema> = {};

  keys.forEach((key) => {
    const field = fields[key as string];

    if (yup.isSchema(field)) {
      newFields[key as string] = field as yup.AnySchema;
    }
  });

  return yup.object(newFields) as yup.ObjectSchema<Pick<yup.InferType<T>, K>>;
};

export const OmitType = <T extends yup.AnyObjectSchema, K extends keyof yup.InferType<T>>(schema: T, keys: K[]) => {
  const fields = schema.fields;
  const newFields: Record<string, yup.AnySchema> = {};

  Object.keys(fields).forEach((key) => {
    if (!keys.includes(key as K)) {
      const field = fields[key];

      if (yup.isSchema(field)) {
        newFields[key] = field as yup.AnySchema;
      }
    }
  });

  return yup.object(newFields) as yup.ObjectSchema<Omit<yup.InferType<T>, K>>;
};

export const validate = async <T>(
  schema: yup.AnyObjectSchema,
  data: any,
  options?: Partial<yup.ValidateOptions>,
): Promise<IBaseResponse<T>> => {
  try {
    const defaultOptions: yup.ValidateOptions = {
      abortEarly: false,
      stripUnknown: false,
      ...(options || {}),
    };

    const sanitizedOptions = { ...defaultOptions, strict: !defaultOptions.stripUnknown };

    const strictSchema = deepNoUnknown(schema, sanitizedOptions.stripUnknown);
    const result = await strictSchema.validate(data, sanitizedOptions);

    return {
      success: true,
      statusCode: 200,
      message: 'Validation successful',
      data: result,
      meta: null,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
        data: null,
        meta: null,
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: 'Unexpected error during validation',
      data: null,
      meta: null,
    };
  }
};

export const deepNoUnknown = (schema: yup.AnyObjectSchema, stripUnknown: boolean): yup.AnyObjectSchema => {
  const fields = schema.fields;
  const newFields: Record<string, yup.AnySchema> = {};

  for (const key in fields) {
    if (fields[key] instanceof yup.ObjectSchema) {
      newFields[key] = deepNoUnknown(fields[key] as yup.AnyObjectSchema, stripUnknown);
    } else {
      newFields[key] = fields[key] as yup.AnySchema;
    }
  }

  return yup.object(newFields).noUnknown(!stripUnknown);
};
