'use client';

import { useToast } from '@/hooks/use-toast';
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProps,
    ToastProvider,
    ToastTitle,
    ToastViewport
} from '@/components/ui/toast';

export function Toaster({ ...props }: ToastProps) {
    const { toasts } = useToast();

    return (
        <ToastProvider {...props} swipeDirection="left">
            {toasts.map(function ({ id, title, description, action, ...props }) {
                return (
                    <Toast key={id} {...props}>
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
