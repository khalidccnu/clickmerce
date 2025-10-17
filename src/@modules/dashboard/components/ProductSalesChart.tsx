import useTheme from '@lib/hooks/useTheme';
import { Spin } from 'antd';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { IDashboardAnalysis } from '../lib/interfaces';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface IProps {
  isLoading: boolean;
  data: IDashboardAnalysis[];
}

const ProductSalesChart: React.FC<IProps> = ({ isLoading, data }) => {
  const { isDark } = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    xaxis: {
      categories: data?.map((data) => data?.month),
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: 100 / 12 + '%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: isDark
      ? [
          '#3399FF',
          '#00C38E',
          '#FFC043',
          '#FF5C77',
          '#9986D1',
          '#E04158',
          '#FF7043',
          '#4B3C72',
          '#34C5A1',
          '#FF6678',
          '#FFD93B',
          '#8E56B7',
        ]
      : [
          '#008FFB',
          '#00E396',
          '#FEB019',
          '#FF4560',
          '#775DD0',
          '#D7263D',
          '#F46036',
          '#2E294E',
          '#1B998B',
          '#E84855',
          '#F9C80E',
          '#662E9B',
        ],
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? '#1f2937' : '#D1D5DB',
      strokeDashArray: 2,
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: { height: 300 },
        },
      },
      {
        breakpoint: 600,
        options: {
          chart: { height: 250 },
        },
      },
    ],
  };

  const chartSeries = [
    {
      name: 'Sold',
      data: data?.map((elem) => elem?.orders),
    },
  ];

  return isLoading ? (
    <div className="flex justify-center py-8">
      <Spin size="large" />
    </div>
  ) : (
    <div className="bg-gray-200/40 dark:bg-[var(--color-rich-black)] rounded-lg p-4">
      <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  );
};

export default ProductSalesChart;
