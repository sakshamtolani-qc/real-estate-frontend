import { toast as sonnerToast } from 'sonner';

// Enhanced toast utility with consistent styling
export const toast = {
  // Success toast
  success: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  },

  // Error toast
  error: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
    });
  },

  // Warning toast
  warning: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
    });
  },

  // Info toast
  info: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  },

  // Default toast
  message: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  },

  // Loading toast
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  // Promise toast - shows loading, then success/error
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  // Custom toast with action
  custom: (message: string, options?: { 
    description?: string; 
    duration?: number; 
    action?: {
      label: string;
      onClick: () => void;
    };
  }) => {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  // Dismiss specific toast
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    return sonnerToast.dismiss();
  },
};

// API-specific toast helpers
export const apiToast = {
  // Success response
  success: (message = 'Operation completed successfully') => {
    return toast.success(message);
  },

  // Error response
  error: (error: any, defaultMessage = 'Something went wrong') => {
    const message = error?.response?.data?.error?.message || 
                   error?.message || 
                   defaultMessage;
    
    return toast.error(message);
  },

  // Loading state
  loading: (message = 'Loading...') => {
    return toast.loading(message);
  },

  // Promise wrapper for API calls
  promise: <T>(
    apiCall: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Operation completed successfully',
      error = 'Something went wrong',
    }: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: any) => string);
    } = {}
  ) => {
    return toast.promise(apiCall, {
      loading,
      success,
      error: (err) => {
        if (typeof error === 'function') {
          return error(err);
        }
        return err?.response?.data?.error?.message || err?.message || error;
      },
    });
  },
};

// Form-specific toast helpers
export const formToast = {
  // Validation error
  validation: (message = 'Please check the form for errors') => {
    return toast.error(message, {
      description: 'Make sure all required fields are filled correctly.',
    });
  },

  // Save success
  saved: (itemName = 'Item') => {
    return toast.success(`${itemName} saved successfully`);
  },

  // Delete success
  deleted: (itemName = 'Item') => {
    return toast.success(`${itemName} deleted successfully`);
  },

  // Update success
  updated: (itemName = 'Item') => {
    return toast.success(`${itemName} updated successfully`);
  },

  // Create success
  created: (itemName = 'Item') => {
    return toast.success(`${itemName} created successfully`);
  },
};

// Real Estate specific toast messages
export const reToast = {
  // Lead management
  lead: {
    created: () => toast.success('Lead created successfully'),
    updated: () => toast.success('Lead updated successfully'),
    deleted: () => toast.success('Lead deleted successfully'),
    converted: () => toast.success('Lead converted to client successfully'),
    assigned: () => toast.success('Lead assigned successfully'),
  },

  // Property management  
  property: {
    created: () => toast.success('Property listing created successfully'),
    updated: () => toast.success('Property updated successfully'),
    deleted: () => toast.success('Property removed successfully'),
    photoUploaded: () => toast.success('Photo uploaded successfully'),
    statusChanged: (status: string) => toast.success(`Property status changed to ${status}`),
  },

  // Client management
  client: {
    created: () => toast.success('Client profile created successfully'),
    updated: () => toast.success('Client information updated successfully'),
    kycApproved: () => toast.success('KYC documents approved successfully'),
    kycRejected: () => toast.error('KYC documents rejected'),
  },

  // Deal management
  deal: {
    created: () => toast.success('Deal created successfully'),
    stageChanged: (stage: string) => toast.success(`Deal moved to ${stage} stage`),
    closed: () => toast.success('🎉 Deal closed successfully!'),
    cancelled: () => toast.warning('Deal cancelled'),
  },

  // Invoice management
  invoice: {
    generated: () => toast.success('Invoice generated successfully'),
    sent: () => toast.success('Invoice sent to client'),
    paid: () => toast.success('Payment recorded successfully'),
    overdue: () => toast.warning('Invoice is overdue'),
  },

  // Authentication
  auth: {
    loginSuccess: () => toast.success('Welcome back!'),
    logoutSuccess: () => toast.success('Logged out successfully'),
    registerSuccess: () => toast.success('Account created successfully'),
    passwordReset: () => toast.success('Password reset email sent'),
  },
};