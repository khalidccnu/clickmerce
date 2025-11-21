import * as yup from 'yup';

export const galleryQuickCreateSchema = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        file_name: yup.string().required(),
        file_path: yup.string().required(),
        file_url: yup.string().url().required(),
        bucket: yup.string().required(),
        etag: yup.string().required(),
        version_id: yup.string().required(),
      }),
    )
    .required(),
});

export type TGalleryQuickCreateDto = yup.InferType<typeof galleryQuickCreateSchema>;
