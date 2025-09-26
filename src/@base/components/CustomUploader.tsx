import { Env } from '.environments';
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
  sizeLimit?: number;
  acceptedTypes?: string[];
  maxCount?: number;
  initialValues?: string[];
  onChange?: (urls: string[]) => void;
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
  sizeLimit = 5,
  acceptedTypes = ['jpg', 'jpeg', 'png'],
  maxCount = 1,
  initialValues,
  listType = 'text',
  innerContent,
  onChange,
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
    return Toolbox.acceptFileTypes(file, ['jpg', 'jpeg', 'png']);
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

    if (!url) {
      message.error('No preview available');
      return;
    }

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
    const purifiedFileList = fileList.map((file) => {
      if (!file.response && file.status !== 'uploading' && file.status !== 'done') {
        return { ...file, status: 'error' };
      }

      return {
        ...file,
        url: file.url || file.response?.data?.[0],
      };
    });

    setFileList(purifiedFileList as any);

    const sanitizedFileList = purifiedFileList.every((file) => file.status === 'done');

    if (sanitizedFileList) {
      const urls = extractUrlsFn(purifiedFileList as any);

      if (JSON.stringify(urls) !== JSON.stringify(lastUrlsRef.current)) {
        lastUrlsRef.current = urls;
        onChange?.(urls);
      }
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

    setFileList(purifiedFileList as any);
    lastUrlsRef.current = initialValues;
  }, [initialValues]);

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
        beforeCrop={(file) => {
          if (!isCrop || maxCount > 1) return false;
          return imgCropBeforeUploadFn(file);
        }}
      >
        <Upload
          name="files"
          headers={{ Authorization: `Bearer ${getAuthToken()}` }}
          data={{ make_public: makePublic }}
          accept={acceptedTypes.map((acceptedType) => `.${acceptedType}`).join(',')}
          fileList={fileList}
          listType={listType === 'button' ? 'text' : listType}
          maxCount={maxCount}
          disabled={isDisable}
          multiple={maxCount > 1}
          showUploadList={{ showPreviewIcon: isPreview }}
          action={`${Env.apiUrl}/${actionPath ?? 'uploads'}`}
          beforeUpload={beforeUploadFn}
          onChange={handleChangeFn}
          onRemove={onRemoveFn}
          onPreview={onPreviewFn}
        >
          {fileList.length < maxCount &&
            (listType === 'button' ? (
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
            ))}
        </Upload>
      </ImgCrop>
    </React.Fragment>
  );
};

export default CustomUploader;
