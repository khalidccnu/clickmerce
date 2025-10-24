import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import BaseSearch from '@base/components/BaseSearch';
import CustomUploader from '@base/components/CustomUploader';
import PageHeader from '@base/components/PageHeader';
import { IBaseFilter } from '@base/interfaces';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import GalleriesList from '@modules/galleries/components/GalleriesList';
import { GalleriesHooks } from '@modules/galleries/lib/hooks';
import { Button, Image, Tag, message } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FcAddImage } from 'react-icons/fc';

const GalleriesPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [isUploadLoading, setUploadLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);
  const { page = '1', limit = '12', ...rest } = Toolbox.parseQueryParams<IBaseFilter>(router.asPath);

  const handleImageChangeFn = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => setPreviewImage(e.target.result);
    } else {
      setPreviewImage(null);
    }

    setImage(file);
  };

  const handleImageUploadFn = () => {
    setUploadLoading(true);

    const formData: any = Toolbox.withFormData({ files: image, type: 'FILE', make_public: 'true' });
    galleriesCreateFn.mutate(formData);
  };

  const galleriesQuery = GalleriesHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const galleriesCreateFn = GalleriesHooks.useCreate({
    config: {
      onSuccess: (res) => {
        setUploadLoading(false);

        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setImage(null);
        setPreviewImage(null);
        setModalOpen(false);
        messageApi.success(res.message);
      },
    },
  });

  return (
    <React.Fragment>
      {messageHolder}
      <PageHeader
        title="Galleries"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {galleriesQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['galleries:write']}>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              Add new asset
            </Button>
          </Authorization>
        }
      />
      <GalleriesList
        isLoading={galleriesQuery.isLoading}
        data={galleriesQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: galleriesQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <BaseModalWithoutClicker
        centered
        destroyOnHidden
        width={420}
        title="Add new asset"
        footer={null}
        open={isModalOpen}
        onCancel={() => {
          setModalOpen(false);
          setPreviewImage(null);
          setImage(null);
        }}
      >
        {previewImage ? (
          <React.Fragment>
            <Image src={previewImage} alt="" rootClassName="flex justify-center" />
            <div className="text-center space-x-1.5 mt-4">
              <Button
                onClick={() => {
                  setPreviewImage(null);
                  setImage(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" loading={isUploadLoading} onClick={handleImageUploadFn}>
                Upload
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <CustomUploader
            isCrop
            isPreviewImage={false}
            type="DRAGGER"
            listType="picture-card"
            innerContent={
              <div className="flex flex-col items-center gap-4">
                <FcAddImage size={32} />
                <p className="text-gray-500">
                  Drag and Drop here <br /> or
                </p>
                <Button type="primary">Browse</Button>
              </div>
            }
            onFinish={([_, file]) => handleImageChangeFn(file)}
          />
        )}
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default GalleriesPage;
