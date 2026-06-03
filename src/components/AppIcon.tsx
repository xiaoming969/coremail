import { Icon } from '@iconify/react';
import type { ComponentProps } from 'react';

type AppIconProps = {
  name: string;
  size?: number | string;
  className?: string;
  ariaLabel?: string;
} & Omit<ComponentProps<typeof Icon>, 'icon' | 'width' | 'height' | 'className' | 'aria-label' | 'aria-hidden' | 'role'>;

export function AppIcon({ name, size = 20, className, ariaLabel, ...props }: AppIconProps) {
  return (
    <Icon
      icon={name}
      width={size}
      height={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      role={ariaLabel ? 'img' : undefined}
      {...props}
    />
  );
}

export default AppIcon;
