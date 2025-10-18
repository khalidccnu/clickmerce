import { Toolbox } from '@lib/utils/toolbox';
import { Form, FormInstance, Input, InputProps } from 'antd';
import React, { useImperativeHandle, useState } from 'react';

interface IProps extends InputProps {
  formProps?: Partial<React.ComponentProps<typeof Form>>;
  onSearch: (value: string) => void;
}

interface IRefProps {
  formInstance: FormInstance;
  clearSearch: () => void;
}

const BaseStateSearch = React.forwardRef<IRefProps, IProps>(({ placeholder, onSearch, formProps, ...rest }, ref) => {
  const [formInstance] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState(null);

  const handleChangeFn = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const debounceSearchFn = Toolbox.debounce(handleChangeFn, 1000);

  useImperativeHandle(ref, () => ({
    formInstance,
    clearSearch: () => {
      formInstance.resetFields();
      setSearchTerm(null);
    },
  }));

  return (
    <Form form={formInstance} layout="vertical" {...formProps}>
      <Form.Item name="search_term" className="!mb-0">
        <Input
          {...rest}
          placeholder={placeholder || 'Search'}
          value={searchTerm}
          onChange={(e) => debounceSearchFn(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
});

BaseStateSearch.displayName = 'BaseStateSearch';

export default BaseStateSearch;
