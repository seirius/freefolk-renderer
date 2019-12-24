export interface IToast {
    id?: string;
    title: string;
    img?: string;
    message: string;
    vault?: Record<string, any>;
}