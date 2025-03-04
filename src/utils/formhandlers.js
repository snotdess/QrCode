import { toast } from "react-toastify";

export const handleSubmit = async (values, onSubmit, setLoading) => {
    setLoading(true);
    try {
        await onSubmit(values);
    } catch (error) {
        toast.error(`Error: ${error.message || "Something went wrong!"}`);
    } finally {
        setLoading(false);
    }
};
