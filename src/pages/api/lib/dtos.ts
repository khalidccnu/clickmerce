import { File } from 'formidable';
import * as yup from 'yup';

export const uploadSchema = yup.object({
  files: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .test('fileRequired', 'File is required', (value) => !!value)
        .test('fileSize', 'File is too large', (value) => {
          if (!value) return true;
          return value.size <= 50 * 1024 * 1024;
        }),
    )
    .min(1, 'At least one file is required')
    .required('Files are required'),
});

export type TUploadDto = yup.InferType<typeof uploadSchema>;
