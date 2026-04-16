import { GripVertical } from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import * as React from 'react';

import { cn } from '@/lib/utils';

type ResizablePanelGroupProps = Omit<React.ComponentProps<typeof Group>, 'orientation'> & {
    /** @deprecated Use `orientation` from react-resizable-panels; kept for shadcn-style blocks */
    direction?: 'horizontal' | 'vertical';
    orientation?: 'horizontal' | 'vertical';
};

function ResizablePanelGroup({
    className,
    direction,
    orientation: orientationProp,
    ...props
}: ResizablePanelGroupProps) {
    const orientation =
        orientationProp ?? (direction === 'vertical' ? 'vertical' : 'horizontal');

    return (
        <Group
            data-slot="resizable-panel-group"
            className={cn(
                'flex h-full w-full',
                orientation === 'vertical' ? 'flex-col' : 'flex-row',
                className,
            )}
            orientation={orientation}
            {...props}
        />
    );
}

const ResizablePanel = Panel;

function ResizableHandle({
    withHandle,
    className,
    ...props
}: React.ComponentProps<typeof Separator> & {
    withHandle?: boolean;
}) {
    return (
        <Separator
            data-slot="resizable-handle"
            className={cn(
                'bg-sidebar-border/50 focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden',
                className,
            )}
            {...props}
        >
            {withHandle ? (
                <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
                    <GripVertical className="size-2.5" />
                </div>
            ) : null}
        </Separator>
    );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
