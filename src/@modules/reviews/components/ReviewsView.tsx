import { Dayjs } from '@lib/constant/dayjs';
import { Card, Descriptions, Image, Rate } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { IReview } from '../lib/interfaces';

interface IProps {
  review: IReview;
}

const ReviewsView: React.FC<IProps> = ({ review }) => {
  return (
    <div className="space-y-4">
      <Card title="Review Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Rate">
            <span className="text-[var(--color-primary)]">
              <Rate disabled allowHalf value={review?.rate} style={{ color: 'var(--color-primary' }} />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {dayjs(review?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
          </Descriptions.Item>
          <Descriptions.Item label="Comment" span={2}>
            {review?.comment}
          </Descriptions.Item>
          <Descriptions.Item label="Image" span={2}>
            {review?.image ? <Image src={review?.image} alt="" width={120} /> : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="User Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 4, xxl: 4 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Name" span={2}>
            {review?.user?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>
            {review?.user?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={4}>
            {review?.user?.email || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Product Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 4, xxl: 4 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Name" span={2}>
            {review?.product?.name || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ReviewsView;
