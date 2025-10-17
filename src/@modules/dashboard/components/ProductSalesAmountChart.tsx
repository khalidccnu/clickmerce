import useTheme from '@lib/hooks/useTheme';
import { Spin } from 'antd';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React from 'react';
import { IDashboardAnalysis } from '../lib/interfaces';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface IProps {
  isLoading: boolean;
  data: IDashboardAnalysis[];
}

const ProductSalesAmountChart: React.FC<IProps> = ({ isLoading, data }) => {
  const { isDark } = useTheme();

  const lineChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    xaxis: {
      categories: data?.map((elem) => elem?.month),
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    markers: {
      size: 4,
      colors: ['#008FFB', '#FF4560', '#00E396'],
      strokeColors: isDark ? '#1f2937' : '#fff',
      strokeWidth: 2,
      hover: {
        size: 6,
      },
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

  const lineChartSeries = [
    {
      name: 'Costs Amount',
      data: data?.map((elem) => elem?.costs_amount),
    },
    {
      name: 'Sales Amount',
      data: data?.map((elem) => elem?.sales_amount),
    },
    {
      name: 'Profit Amount',
      data: data?.map((elem) => elem?.profit_amount),
    },
  ];

  return isLoading ? (
    <div className="flex justify-center py-8">
      <Spin size="large" />
    </div>
  ) : (
    <div className="bg-gray-200/40 dark:bg-[var(--color-rich-black)] rounded-lg p-4">
      <ReactApexChart options={lineChartOptions} series={lineChartSeries} type="line" height={350} />
    </div>
  );
};

export default ProductSalesAmountChart;
