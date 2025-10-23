import { IBaseResponse } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { Empty, Spin } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface IProps<D = any> {
  style?: React.CSSProperties;
  className?: string;
  emptyItemsPlaceholder?: string;
  isReverse?: boolean;
  shouldScrollToEnd?: boolean;
  query: UseInfiniteQueryResult<InfiniteData<IBaseResponse<D[]>>, Error>;
  children: (props: { idx: number; item: D }) => React.ReactElement;
  onChangeItems?: (items: D[]) => void;
  onChangeScrollToEnd?: (shouldScrollToEnd: boolean) => void;
}

const InfiniteScroll = <D = any,>({
  style,
  className,
  emptyItemsPlaceholder,
  isReverse = false,
  shouldScrollToEnd = false,
  query,
  children,
  onChangeItems,
  onChangeScrollToEnd,
}: IProps<D>) => {
  const { ref, inView } = useInView();
  const lastItemRef = useRef(null);

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

  useEffect(() => {
    if (inView && !query.isFetchingNextPage) query.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const lastItem = lastItemRef.current;

    if (lastItem && shouldScrollToEnd) {
      lastItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      onChangeScrollToEnd?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldScrollToEnd]);

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spin />
      </div>
    );
  }

  return (
    <div
      style={{ maxHeight: '100%', overflowY: 'auto', ...style }}
      className={cn(
        'designed_scrollbar flex flex-col overscroll-contain',
        { 'flex-col-reverse': isReverse },
        className,
      )}
    >
      {items?.length ? (
        items.map((item, idx) => {
          const isFirstItem = idx === 0;
          const isLastItem = idx === items.length - 1;

          const childElement = children({ idx, item });

          if (isFirstItem) {
            return (
              <div key={idx} ref={lastItemRef}>
                {childElement}
              </div>
            );
          } else if (isLastItem) {
            return (
              <div key={idx} ref={ref}>
                {childElement}
              </div>
            );
          }

          return React.cloneElement(childElement, { key: idx });
        })
      ) : (
        <Empty description={emptyItemsPlaceholder || 'Not available'} />
      )}
      {query.hasNextPage && (
        <div className="flex items-center justify-center py-4">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
