import { TAnalyticEventName } from '@lib/constant/analyticEvents';
import { useAnalyticEvent } from '@lib/hooks/useAnalyticEvent';
import React, { MouseEvent, PropsWithChildren, ReactElement, useEffect } from 'react';

interface IProps extends PropsWithChildren {
  name: TAnalyticEventName;
  trigger?: 'CLICK' | 'MOUNT';
  data?: Record<string, any>;
}

const AnalyticEventTrigger: React.FC<IProps> = ({ name, trigger = 'CLICK', data = {}, children }) => {
  const { sendEventFn } = useAnalyticEvent();

  const handleClickFn = (e: MouseEvent<HTMLElement>) => {
    if (trigger === 'CLICK') sendEventFn({ name, data });

    if (React.isValidElement(children)) {
      const childOnClickFn = (children as ReactElement).props.onClick;
      if (typeof childOnClickFn === 'function') childOnClickFn(e);
    }
  };

  useEffect(() => {
    if (trigger === 'MOUNT') sendEventFn({ name, data });
  }, [name, trigger, data, sendEventFn]);

  if (!React.isValidElement(children)) {
    return children;
  }

  return React.cloneElement(children as ReactElement, {
    onClick: handleClickFn,
  });
};

export default AnalyticEventTrigger;
