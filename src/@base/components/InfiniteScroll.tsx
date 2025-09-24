import { IBaseResponse } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { Empty, Spin } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

interface IProps<D = any> {
  style?: React.CSSProperties;
  className?: string;
  emptyItemsPlaceholder?: string;
  query: UseInfiniteQueryResult<InfiniteData<IBaseResponse<D[]>>, Error>;
  children: (props: { idx: number; item: D }) => React.ReactElement;
  onChangeItems?: (items: D[]) => void;
}

const InfiniteScroll = <D = any,>({
  style,
  className,
  emptyItemsPlaceholder,
  query,
  children,
  onChangeItems,
}: IProps<D>) => {
  const wrapperRef = useRef(null);

  const handleScrollFn = useCallback(() => {
    if (!wrapperRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = wrapperRef.current;

    const threshold = 150;
    const shouldFetchMore = scrollTop + clientHeight >= scrollHeight - threshold;

    if (shouldFetchMore && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  const mergeItems = useCallback(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flatMap((page) => page?.data ?? []);
  }, [query.data]);

  const items = useMemo(() => {
    return mergeItems();
  }, [mergeItems]);

  useEffect(() => {
    if (onChangeItems) onChangeItems(items);
  }, [items, onChangeItems]);

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spin />
      </div>
    );
  }

  return items?.length ? (
    <div
      ref={wrapperRef}
      onScroll={handleScrollFn}
      style={{ maxHeight: '100%', overflowY: 'auto', ...style }}
      className={cn('designed_scrollbar overscroll-contain', className)}
    >
      {items.map((item, idx) => (
        <div key={idx}>{children({ idx, item })}</div>
      ))}
      {query.isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <Spin />
        </div>
      )}
    </div>
  ) : (
    <Empty description={emptyItemsPlaceholder || 'Not available'} />
  );
};

export default InfiniteScroll;
