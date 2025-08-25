import { useCallback, useState } from "react";

import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    isAxiosError,
} from "axios";

import { ValidationErrors } from "../types/errors";

export interface UseSubmitProps<T, D = any> {
    path: string;
    config?: AxiosRequestConfig<D>;
    onSuccess?: (data: T) => Promise<void> | void;
    onError?: (error: AxiosError) => void;
    redirectIfUnauthenticated?: boolean;
}

export interface UseSubmitResponse<D = any> {
    submit: () => Promise<void>;
    errors: ValidationErrors<D>;
    inProgress: boolean;
    succeeded?: boolean;
}

export const useSubmit = <T, D = any>({
    path,
    config = {
        method: "POST",
    },
    onSuccess,
    onError,
    redirectIfUnauthenticated = true,
}: UseSubmitProps<T, D>): UseSubmitResponse<D> => {
    const [errors, setErrors] = useState<ValidationErrors<D>>({});
    const [inProgress, setInProgress] = useState<boolean>(false);
    const [succeeded, setSucceeded] = useState<boolean>();

    const submit = useCallback(
        async (event?: Event): Promise<void> => {
            event?.preventDefault();

            setErrors({});
            setInProgress(true);
            setSucceeded(undefined);

            try {
                const response = await axios<T, AxiosResponse<T, any>, D>(
                    path,
                    config,
                );
                await onSuccess?.(response.data);
                setSucceeded(true);
            } catch (e) {
                setSucceeded(false);
                if (!isAxiosError(e)) {
                    throw e;
                }

                if (e.response?.status === 422) {
                    const data = e.response?.data.errors as ValidationErrors<D>;
                    setErrors(data);
                    return;
                }

                if (redirectIfUnauthenticated && e.response?.status === 401) {
                    window.location.href = "/login";
                    return;
                }

                if (onError) {
                    onError(e);
                    return;
                }

                throw e;
            } finally {
                setInProgress(false);
            }
        },
        [
            setInProgress,
            setErrors,
            setSucceeded,
            onSuccess,
            config,
            path,
            onError,
        ],
    );

    return {
        errors,
        inProgress,
        succeeded,
        submit,
    };
};
