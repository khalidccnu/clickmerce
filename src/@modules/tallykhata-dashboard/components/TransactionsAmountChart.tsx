import useTheme from '@lib/hooks/useTheme';
import { Spin } from 'antd';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React from 'react';
import { ITallykhataDashboardAnalysis } from '../lib/interfaces';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface IProps {
  isLoading: boolean;
  data: ITallykhataDashboardAnalysis[];
}

const TransactionsAmountChart: React.FC<IProps> = ({ isLoading, data }) => {
  const { isDark } = useTheme();

  const areaChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
    },
    xaxis: {
      categories: data?.map((elem) => elem?.month),
      labels: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 4,
      colors: ['#008FFB', '#FF4560', '#00E396'],
      strokeColors: isDark ? '#1f2937' : '#fff',
      strokeWidth: 2,
      hover: { size: 6 },
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    colors: ['#008FFB', '#FF4560', '#00E396'],
    grid: {
      show: true,
      borderColor: isDark ? '#1f2937' : '#D1D5DB',
      strokeDashArray: 2,
    },
    responsive: [
      {
        breakpoint: 1024,
        options: { chart: { height: 300 } },
      },
      {
        breakpoint: 600,
        options: { chart: { height: 250 } },
      },
    ],
  };

  const areaChartSeries = [
    {
      name: 'Credit Amount',
      data: data?.map((elem) => elem?.credit_amount),
    },
    {
      name: 'Debit Amount',
      data: data?.map((elem) => elem?.debit_amount),
    },
  ];

  return isLoading ? (
    <div className="flex justify-center py-8">
      <Spin />
    </div>
  ) : (
    <div className="bg-gray-200/40 dark:bg-[var(--color-rich-black)] rounded-lg p-4">
      <ReactApexChart options={areaChartOptions} series={areaChartSeries} type="area" height={350} />
    </div>
  );
};

export default TransactionsAmountChart;
