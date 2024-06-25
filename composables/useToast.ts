import { toast } from "vue-sonner";

export const useToast = () => {
    const notify = (message: string, options = {}) => {
        toast(message, options);
    };

    const addSuccess = (message: string, options = {}) => {
        toast.success(message, options);
    };

    const addError = (message: string, options = {}) => {
        toast.error(message, options);
    };

    return {
        notify,
        addSuccess,
        addError
    };
};
