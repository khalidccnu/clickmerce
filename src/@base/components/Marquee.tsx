import { cn } from '@lib/utils/cn';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface IProps extends PropsWithChildren {
  className?: string;
  pauseOnHover?: boolean;
  duplicateCount?: number;
  speed?: number;
}

const Marquee: React.FC<IProps> = ({ className, pauseOnHover = true, duplicateCount = 5, speed = 100, children }) => {
  const contentRef = useRef(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      const contentWidth = contentRef.current.getBoundingClientRect().width;
      setDuration(contentWidth / speed);
    }
  }, [speed, children]);

  return (
    <React.Fragment>
      <div className={cn('marquee', pauseOnHover && 'pause_on_hover', className)}>
        <div className="content" ref={contentRef} style={{ animationDuration: `${duration}s` }}>
          {[...Array(duplicateCount)].map((_, idx) => (
            <React.Fragment key={idx}>{children} •</React.Fragment>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .marquee {
          display: flex;
          align-items: center;
          mask-image: linear-gradient(90deg, transparent, var(--color-white) 20%, var(--color-white) 80%, transparent);
          white-space: nowrap;
          overflow: hidden;
          &.pause_on_hover {
            &:hover {
              .content {
                animation-play-state: paused;
              }
            }
          }
          .content {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-left: 8px;
            animation-name: marquee;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default Marquee;
