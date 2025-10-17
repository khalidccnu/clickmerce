import { Dayjs } from '@lib/constant/dayjs';
import { DatePicker, Form, Select, SelectProps, Space } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { SpaceCompactProps } from 'antd/es/space/Compact';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const selectOptions = [
  {
    value: JSON.stringify({
      startDate: dayjs().startOf('day').toISOString(),
      endDate: dayjs().endOf('day').toISOString(),
    }),
    label: 'Today',
  },
  {
    value: JSON.stringify({
      startDate: dayjs().subtract(1, 'day').startOf('day').toISOString(),
      endDate: dayjs().subtract(1, 'day').endOf('day').toISOString(),
    }),
    label: 'Yesterday',
  },
  {
    value: JSON.stringify({
      startDate: dayjs().subtract(6, 'days').startOf('day').toISOString(),
      endDate: dayjs().endOf('day').toISOString(),
    }),
    label: 'Last 7 days',
  },
  {
    value: JSON.stringify({
      startDate: dayjs().subtract(14, 'days').startOf('day').toISOString(),
      endDate: dayjs().endOf('day').toISOString(),
    }),
    label: 'Last 15 days',
  },
  {
    value: JSON.stringify({
      startDate: dayjs().subtract(29, 'days').startOf('day').toISOString(),
      endDate: dayjs().endOf('day').toISOString(),
    }),
    label: 'Last 30 days',
  },
  {
    value: JSON.stringify({
      startDate: dayjs().startOf('month').toISOString(),
      endDate: dayjs().endOf('month').toISOString(),
    }),
    label: 'This Month',
  },
  {
    value: JSON.stringify({
      startDate: dayjs().subtract(1, 'month').startOf('month').toISOString(),
      endDate: dayjs().subtract(1, 'month').endOf('month').toISOString(),
    }),
    label: 'Prev Month',
  },
];

interface IProps {
  formProps?: Partial<React.ComponentProps<typeof Form>>;
  spaceProps?: SpaceCompactProps;
  selectProps?: SelectProps;
  dateRangePickerProps?: RangePickerProps;
  initialValues?: {
    startDate: string;
    endDate: string;
  };
  onFinish: (values: { startDate: string; endDate: string }) => void;
}

const BaseDateRangeFilter: React.FC<IProps> = ({
  formProps,
  spaceProps,
  selectProps,
  dateRangePickerProps,
  initialValues,
  onFinish,
}) => {
  const [formInstance] = Form.useForm();

  useEffect(() => {
    const formValues: { [key: string]: any } = {};
    const { startDate, endDate } = initialValues || {};
    formValues.customDate = startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : [];
    const dateFilter = JSON.stringify({ startDate, endDate });

    if (selectOptions.some((item) => item.value === dateFilter)) {
      formValues.dateFilter = dateFilter;
    } else {
      formValues.dateFilter = 'Custom';
    }

    formInstance.setFieldsValue(formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formInstance, initialValues]);

  return (
    <Form
      form={formInstance}
      size="middle"
      layout="vertical"
      onValuesChange={(values) => {
        const changedValues: { startDate: string; endDate: string } = {
          startDate: null,
          endDate: null,
        };

        if (values.customDate?.length === 2) {
          changedValues.startDate = dayjs(values.customDate[0]).format(Dayjs.date);
          changedValues.endDate = dayjs(values.customDate[1]).format(Dayjs.date);
        } else if (values.dateFilter && values.dateFilter !== 'Custom') {
          try {
            const dateFilter = JSON.parse(values.dateFilter);

            changedValues.startDate = dateFilter.startDate;
            changedValues.endDate = dateFilter.endDate;
          } catch {}
        }

        onFinish(changedValues);
      }}
      {...formProps}
    >
      <Space.Compact {...spaceProps}>
        <Form.Item name="dateFilter" className="mb-0">
          <Select placeholder="Date" style={{ width: 150 }} {...selectProps}>
            {selectOptions.map((item) => (
              <Select.Option key={item.label} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="customDate" style={{ width: '100%' }} className="mb-0">
          <DatePicker.RangePicker {...dateRangePickerProps} />
        </Form.Item>
      </Space.Compact>
    </Form>
  );
};

export default BaseDateRangeFilter;
