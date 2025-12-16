import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import { cn } from '@lib/utils/cn';
import { Session } from '@lib/utils/session';
import { ENUM_POPUP_TYPES } from '@modules/popups/lib/enums';
import { IPopup } from '@modules/popups/lib/interfaces';
import { Image } from '@unpic/react';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface IProps {
  className?: string;
  forceOpen?: boolean;
  popup: IPopup;
}

const Popup: React.FC<IProps> = ({ className, forceOpen = false, popup }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const sessionKey = `popup_seen_${popup?.id}`;

    if (forceOpen) {
      setPopupOpen(true);
      return;
    }

    const alreadySeen = Session.getData(sessionKey);
    if (alreadySeen) return;

    const openTimer = setTimeout(() => {
      setPopupOpen(true);
      Session.setData(sessionKey, 'true');
    }, 1000);

    const closeTimer = setTimeout(() => {
      setPopupOpen(false);
    }, 8000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [forceOpen, popup]);

  return (
    <div className={cn('popup', className)}>
      <BaseModalWithoutClicker
        centered
        destroyOnHidden
        footer={null}
        width={480}
        open={isPopupOpen}
        closeIcon={<AiOutlineClose size={24} />}
        onCancel={() => setPopupOpen(false)}
        classNames={{
          content: cn('!shadow-none', {
            '!bg-transparent': [ENUM_POPUP_TYPES.IMAGE].includes(popup?.type as ENUM_POPUP_TYPES),
          }),
        }}
      >
        {[ENUM_POPUP_TYPES.IMAGE, ENUM_POPUP_TYPES.TEXT_AND_IMAGE].includes(popup?.type as ENUM_POPUP_TYPES) && (
          <Image
            priority
            layout="fullWidth"
            src={popup?.image}
            alt={popup?.name}
            className="w-full h-auto object-contain rounded-2xl"
          />
        )}
        {[ENUM_POPUP_TYPES.TEXT, ENUM_POPUP_TYPES.TEXT_AND_IMAGE].includes(popup?.type as ENUM_POPUP_TYPES) && (
          <p
            className={cn('prose', {
              'mt-4': [ENUM_POPUP_TYPES.TEXT_AND_IMAGE].includes(popup?.type as ENUM_POPUP_TYPES),
            })}
            dangerouslySetInnerHTML={{ __html: popup?.content }}
          />
        )}
      </BaseModalWithoutClicker>
    </div>
  );
};

export default Popup;
