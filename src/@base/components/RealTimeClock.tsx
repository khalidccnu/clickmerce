import useRealTimeClock from '@lib/hooks/useRealTimeClock';
import { Tag, TagProps } from 'antd';
import React from 'react';
import { FaClock } from 'react-icons/fa';

interface IProps extends TagProps {}

const RealTimeClock: React.FC<IProps> = ({ ...rest }) => {
  const { time } = useRealTimeClock({ format: '12h', includeSeconds: true });

  return (
    <Tag {...rest}>
      <FaClock className="inline-block -mt-0.5" /> {time}
    </Tag>
  );
};

export default RealTimeClock;
