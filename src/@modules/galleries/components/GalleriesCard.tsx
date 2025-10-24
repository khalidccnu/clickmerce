import FilePreviewer from '@base/components/FilePreviewer';
import { TId } from '@base/interfaces';
import useCopyClipboard from '@lib/hooks/useCopyClipboard';
import { Button, Checkbox, Popconfirm, Tag, Tooltip } from 'antd';
import React from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FiCopy } from 'react-icons/fi';
import { IGallery } from '../lib/interfaces';

interface IProps {
  selectOption?: {
    show: boolean;
    id: TId;
    onSelect: (gallery: IGallery) => void;
  };
  gallery: IGallery;
  onEdit?: (gallery: IGallery) => void;
  onDelete?: (id: TId) => void;
}

const GalleriesCard: React.FC<IProps> = ({ gallery, onEdit, onDelete, selectOption = { show: false } }) => {
  const { isCopied, copyToClipboard } = useCopyClipboard();

  const parseFileInfoFn = (filename: string) => {
    if (!filename) return { name: '', ext: '' };

    const parts = filename.split('.');
    const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
    const name = parts.join('.');

    return { name, ext };
  };

  const { name, ext } = parseFileInfoFn(gallery?.file_name);

  return (
    <div className="border border-gray-300/70 dark:border-gray-700/30 rounded-lg overflow-hidden galleries_card">
      <div className="relative flex justify-center items-center h-56 bg-[repeating-conic-gradient(rgba(24,_24,_38,_0.164)_0%,_rgba(24,_24,_38,_0.144)_25%,_transparent_0%,_transparent_50%)] bg-[50%_center] bg-[length:1.5rem_1.5rem] card_top">
        <div className="absolute top-2 left-2 flex w-[calc(100%_-_16px)] justify-between gap-2 z-10 btn_container">
          <Tooltip title={isCopied ? 'Copied!' : 'Copy URL'}>
            <Button
              icon={<FiCopy />}
              size="small"
              type={isCopied ? 'primary' : 'dashed'}
              onClick={() => copyToClipboard(gallery?.file_url)}
            />
          </Tooltip>
          {(selectOption.show || onEdit || onDelete) && (
            <div className="inline-flex gap-2">
              {selectOption.show && (
                <Checkbox checked={selectOption.id === gallery?.id} onClick={() => selectOption.onSelect(gallery)} />
              )}
              {onEdit && (
                <Button size="small" onClick={() => onEdit(gallery)}>
                  <AiFillEdit />
                </Button>
              )}
              {onDelete && (
                <Popconfirm
                  title="Are you sure to delete it?"
                  onConfirm={() => onDelete(gallery?.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="primary" size="small" danger>
                    <AiFillDelete />
                  </Button>
                </Popconfirm>
              )}
            </div>
          )}
        </div>
        <div className="w-full h-full image_container">
          <FilePreviewer
            src={gallery?.file_url}
            alt={gallery?.file_name}
            width="100%"
            height="100%"
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 p-2 min-h-16 bg-gray-300/70 dark:bg-gray-700/30 border-t border-gray-300/70 dark:border-gray-700/30 card_footer">
        <p className="break-words title">{name}</p>
        <Tag style={{ marginRight: 0 }}>{ext}</Tag>
      </div>
    </div>
  );
};

export default GalleriesCard;
