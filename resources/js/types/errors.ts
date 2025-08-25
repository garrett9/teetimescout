export type ValidationErrors<T = any> = {
    [K in keyof T]?: T[K] extends string | number | boolean | null | undefined
        ? string[]
        : T[K] extends Array<any>
          ? string[] // or consider recursion if needed
          : T[K] extends object
            ? ValidationErrors<T[K]>
            : string[];
};

export interface ErrorResponseData {
    errors?: ValidationErrors;
}
