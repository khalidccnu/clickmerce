import { TAnalyticEventName } from '@lib/constant/analyticEvents';
import { useAnalyticEvent } from '@lib/hooks/useAnalyticEvent';
import React, { PropsWithChildren, useEffect } from 'react';

interface IProps extends PropsWithChildren {
  name: TAnalyticEventName;
  trigger?: 'CLICK' | 'MOUNT';
  data?: Record<string, any>;
}

const AnalyticEventTrigger: React.FC<IProps> = ({ name, trigger = 'CLICK', data = {}, children }) => {
  const { sendEventFn } = useAnalyticEvent();

  useEffect(() => {
    if (trigger === 'MOUNT') sendEventFn({ name, data });
  }, [name, trigger, data, sendEventFn]);

  const handleClickFn = (e: React.MouseEvent<HTMLElement>) => {
    if (trigger === 'CLICK') sendEventFn({ name, data });
    if (React.isValidElement(children) && children.props.onClick) children.props.onClick(e);
  };

  return React.cloneElement(children as React.ReactElement, { onClick: handleClickFn });
};

export default AnalyticEventTrigger;
