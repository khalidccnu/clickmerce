import { Env } from '.environments';
import { IMAGE_ALLOW_LIST } from '@lib/constant/common';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { getAuthToken } from '@modules/auth/lib/utils/client';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Button, Image, message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlinePlus, AiOutlineUpload } from 'react-icons/ai';

type TFile = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IBaseProps {
  isCrop?: boolean;
  isDisable?: boolean;
  isPreview?: boolean;
  isPreviewImage?: boolean;
  sizeLimit?: number;
  acceptedTypes?: string[];
  maxCount?: number;
  initialValues?: string[];
  type?: 'BASIC' | 'DRAGGER';
  onChange?: (urls: string[]) => void;
  onFinish?: (files: File[]) => void;
  actionPath?: string;
  makePublic?: boolean;
}

interface IBasePropsWithIC extends IBaseProps {
  listType?: 'text' | 'picture';
  innerContent: React.ReactNode;
}

interface IBasePropsWithoutIC extends IBaseProps {
  listType: 'button' | 'picture-card' | 'picture-circle';
  innerContent?: React.ReactNode;
}

type TProps = IBasePropsWithIC | IBasePropsWithoutIC;

const CustomUploader: React.FC<TProps> = ({
  isCrop = false,
  isDisable = false,
  isPreview = true,
  isPreviewImage = true,
  sizeLimit = 5,
  acceptedTypes = IMAGE_ALLOW_LIST,
  maxCount = 1,
  initialValues,
  type = 'BASIC',
  listType = 'text',
  innerContent,
  onChange,
  onFinish,
  actionPath,
  makePublic = false,
}) => {
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const lastUrlsRef = useRef<string[]>([]);

  const extractUrlsFn = (files: UploadFile[]) => {
    return files.map((file) => file.url || file.response?.data?.[0]).filter(Boolean);
  };

  const imgCropBeforeUploadFn = (file: TFile) => {
    return Toolbox.acceptFileTypes(file, ['jpg', 'jpeg', 'png', 'webp']);
  };

  const beforeUploadFn = (file: TFile) => {
    const isAccept = Toolbox.acceptFileTypes(file, acceptedTypes);
    const isLimit = file.size / 1024 / 1024 < sizeLimit;

    if (!isAccept) message.error(`You can only upload ${acceptedTypes.join('/')} file!`);
    if (!isLimit) message.error(`Image must be smaller than ${sizeLimit}MB!`);

    return isAccept && isLimit;
  };

  const onPreviewFn = async (file: UploadFile) => {
    const url = file.url || file.response?.data?.[0];

    if (!url) return message.error('No preview available');

    setPreviewImage(url);
    setPreviewOpen(true);
  };

  const onRemoveFn = (file: UploadFile) => {
    const remainingFileList = fileList.filter((f) => f.uid !== file.uid);

    setFileList(remainingFileList);
    const urls = extractUrlsFn(remainingFileList);

    if (JSON.stringify(urls) !== JSON.stringify(lastUrlsRef.current)) {
      lastUrlsRef.current = urls;
      onChange?.(urls);
    }
  };

  const handleChangeFn: UploadProps['onChange'] = ({ fileList }) => {
    const purifiedFileList = fileList.map((file) => ({
      ...file,
      url:
        file.url ||
        file.response?.data?.[0] ||
        (file.originFileObj ? URL.createObjectURL(file.originFileObj) : undefined),
    }));

    const fileListWithStatus = purifiedFileList.filter((file) => file.status);

    setFileList(fileListWithStatus);

    const sanitizedFileList = purifiedFileList.every((file) => file.status === 'done');

    if (sanitizedFileList) {
      const urls = extractUrlsFn(purifiedFileList);

      if (JSON.stringify(urls) !== JSON.stringify(lastUrlsRef.current)) {
        lastUrlsRef.current = urls;
        onChange?.(urls);
      }
    }
  };

  const handleCustomRequestFn: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      if (onFinish) {
        const purifiedFileList = [...fileList.map((file) => file.originFileObj as File).filter(Boolean), file as File];

        onFinish(purifiedFileList);
        const url = URL.createObjectURL(file as File);

        onSuccess?.({ data: [url] }, new XMLHttpRequest());
      } else {
        const formData = Toolbox.withFormData({ files: file, make_public: makePublic });

        const res = await fetch(`${Env.apiUrl}/${actionPath ?? 'uploads'}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          onSuccess?.(data, new XMLHttpRequest());
        } else {
          throw new Error(data?.message || 'Upload failed');
        }
      }
    } catch (error) {
      onError?.(error);
    }
  };

  useEffect(() => {
    if (Toolbox.isEmpty(initialValues?.filter(Boolean))) {
      setFileList([]);
      return;
    }

    const purifiedFileList = initialValues.map((url, idx) => ({
      uid: `-${idx}`,
      name: `file-${idx}`,
      status: 'done',
      url,
    }));

    setFileList(purifiedFileList as UploadFile[]);
    lastUrlsRef.current = initialValues;
  }, [initialValues]);

  const uploadCommonProps = {
    accept: acceptedTypes.map((type) => `.${type}`).join(','),
    fileList,
    listType: listType === 'button' ? 'text' : listType,
    maxCount,
    disabled: isDisable,
    multiple: maxCount > 1,
    showUploadList: isPreviewImage && { showPreviewIcon: isPreview },
    beforeUpload: beforeUploadFn,
    onChange: handleChangeFn,
    onRemove: onRemoveFn,
    onPreview: onPreviewFn,
    customRequest: handleCustomRequestFn,
    className: cn({ '[&_.ant-upload]:hidden': fileList.length >= maxCount }),
  };

  return (
    <React.Fragment>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: isPreviewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(null),
          }}
          src={previewImage}
          alt="Preview"
        />
      )}
      <ImgCrop
        showReset
        rotationSlider
        aspectSlider
        quality={1}
        maxZoom={5}
        modalOk="Upload"
        modalCancel="Upload Original"
        beforeCrop={(file) => {
          if (!isCrop || maxCount > 1) return false;
          return imgCropBeforeUploadFn(file);
        }}
        onModalCancel={(resolve) => resolve(true)}
        modalProps={{ centered: true }}
        modalWidth={680}
      >
        {type === 'DRAGGER' ? (
          <Upload.Dragger {...uploadCommonProps}>
            {listType === 'button' ? (
              <Button type="primary" icon={<AiOutlineUpload />} disabled={isDisable}>
                {innerContent || 'Click to Upload'}
              </Button>
            ) : (
              innerContent || (
                <div className="flex flex-col items-center gap-2">
                  <AiOutlinePlus />
                  <p>Upload</p>
                </div>
              )
            )}
          </Upload.Dragger>
        ) : (
          <Upload {...uploadCommonProps}>
            {listType === 'button' ? (
              <Button type="primary" icon={<AiOutlineUpload />} disabled={isDisable}>
                {innerContent || 'Click to Upload'}
              </Button>
            ) : (
              innerContent || (
                <div className="flex flex-col items-center gap-2">
                  <AiOutlinePlus />
                  <p>Upload</p>
                </div>
              )
            )}
          </Upload>
        )}
      </ImgCrop>
    </React.Fragment>
  );
};

export default CustomUploader;
