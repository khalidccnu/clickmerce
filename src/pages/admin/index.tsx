import BaseDateRangeFilter from '@base/components/BaseDateRangeFilter';
import PageWrapper from '@base/container/PageWrapper';
import Authorization from '@modules/auth/components/Authorization';
import AnalysesChart from '@modules/dashboard/components/AnalysesChart';
import StatisticsList from '@modules/dashboard/components/StatisticsList';
import { useState } from 'react';

const DashboardPage = () => {
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: null,
    endDate: null,
  });

  return (
    <PageWrapper>
      <Authorization allowedPermissions={['dashboard-advance:read']}>
        <BaseDateRangeFilter
          selectProps={{ allowClear: true, size: 'large' }}
          dateRangePickerProps={{ allowClear: true, size: 'large' }}
          initialValues={dateRange}
          onFinish={setDateRange}
        />
      </Authorization>
      <StatisticsList startDate={dateRange.startDate} endDate={dateRange.endDate} className="mt-8" />
      <Authorization allowedPermissions={['dashboard-advance:read']}>
        <AnalysesChart className="mt-8" />
      </Authorization>
    </PageWrapper>
  );
};

export default DashboardPage;
