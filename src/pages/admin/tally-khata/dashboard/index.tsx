import BaseDateRangeFilter from '@base/components/BaseDateRangeFilter';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import PageWrapper from '@base/container/PageWrapper';
import { TId } from '@base/interfaces';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import AnalysesChart from '@modules/tallykhata-dashboard/components/AnalysesChart';
import StatisticsList from '@modules/tallykhata-dashboard/components/StatisticsList';
import { UsersHooks } from '@modules/users/lib/hooks';
import { IUser } from '@modules/users/lib/interfaces';
import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const TallykhataDashboardPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const [userSearchTerm, setUserSearchTerm] = useState(null);
  const [userId, setUserId] = useState<TId>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: null,
    endDate: null,
  });

  const userQuery = UsersHooks.useFindById({
    id: userId,
    config: {
      queryKey: [],
      enabled: !!userId,
    },
  });

  const usersQuery = UsersHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: userSearchTerm,
      search_fields: ['name', 'phone', 'email'],
    },
  });

  return (
    <PageWrapper
      title="Tally Khata Dashboard"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <BaseDateRangeFilter
          selectProps={{ allowClear: true, size: 'large' }}
          dateRangePickerProps={{ allowClear: true, size: 'large' }}
          initialValues={dateRange}
          onFinish={setDateRange}
        />
        <InfiniteScrollSelect<IUser>
          allowClear
          showSearch
          virtual={false}
          size="large"
          placeholder="User"
          initialOptions={userQuery.data?.data?.id ? [userQuery.data?.data] : []}
          option={({ item: user }) => ({
            key: user?.id,
            label: user?.name,
            value: user?.id,
          })}
          onChangeSearchTerm={setUserSearchTerm}
          query={usersQuery}
          value={userId}
          onChange={setUserId}
          className="w-full md:w-60"
        />
      </div>
      <StatisticsList startDate={dateRange.startDate} endDate={dateRange.endDate} userId={userId} className="mt-8" />
      <AnalysesChart className="mt-8" />
    </PageWrapper>
  );
};

export default WithAuthorization(TallykhataDashboardPage, { allowedPermissions: ['tally_khata_dashboard:read'] });

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
