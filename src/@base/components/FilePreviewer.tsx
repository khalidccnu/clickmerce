import { ImagePaths } from '@lib/constant/imagePaths';
import { Image, ImageProps } from 'antd';
import React from 'react';
import { FaEye } from 'react-icons/fa';

interface IProps extends ImageProps {
  src: string;
  alt?: string;
  isPdfMust?: boolean;
  isPdfPreviewer?: boolean;
  isPdfToolbar?: boolean;
  isPdfNavPanes?: boolean;
}

const FilePreviewer: React.FC<IProps> = ({
  src,
  alt = '',
  isPdfMust = false,
  isPdfPreviewer = false,
  isPdfToolbar = false,
  isPdfNavPanes = false,
  ...props
}) => {
  return src?.endsWith('.pdf') || isPdfMust ? (
    <div style={{ height: props.height || 100, width: props.width || 100 }} className="relative">
      {src?.endsWith('.pdf') ? (
        isPdfPreviewer ? (
          <React.Fragment>
            <iframe src={`${src}#toolbar=0&navpanes=0`} width={props.width || 100} height={props.height || 100} />
            <div
              className="flex items-center justify-center absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-50 hover:bg-gray-700 transition-opacity duration-500 cursor-pointer"
              onClick={() => window.open(src)}
            >
              <FaEye className="text-white" />
            </div>
          </React.Fragment>
        ) : (
          <iframe
            src={`${src}#toolbar=${isPdfToolbar ? 1 : 0}&navpanes=${isPdfNavPanes ? 1 : 0}`}
            width={props.width || 100}
            height={props.height || 100}
          />
        )
      ) : (
        <Image
          {...props}
          src={ImagePaths.fileNotFound}
          alt={alt}
          width={props.width || 100}
          height={props.height || 100}
        />
      )}
    </div>
  ) : (
    <Image
      {...props}
      src={src || ImagePaths.placeHolder}
      alt={alt}
      width={props.width || 100}
      height={props.height || 100}
    />
  );
};

export default FilePreviewer;
