import BaseDateRangeFilter from '@base/components/BaseDateRangeFilter';
import PageWrapper from '@base/container/PageWrapper';
import Authorization from '@modules/auth/components/Authorization';
import AnalysesChart from '@modules/dashboard/components/AnalysesChart';
import StatisticsList from '@modules/dashboard/components/StatisticsList';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const DashboardPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: null,
    endDate: null,
  });

  return (
    <PageWrapper
      title="Dashboard"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
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

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success, data: settings } = await SettingsServices.find();

    if (!success) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
