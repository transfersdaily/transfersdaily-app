// Minimal toast hook for build compatibility
// This is a simple implementation to prevent build errors

interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = (props: ToastProps) => {
    // Simple console logging for now
    // In a real implementation, this would show a toast notification
    if (props.variant === 'destructive') {
      console.error(`${props.title}: ${props.description}`);
    } else {
      console.log(`${props.title}: ${props.description}`);
    }
  };

  return { toast };
}
