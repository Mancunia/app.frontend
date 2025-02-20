
export type PAYSTACK_SUBSCRIPTION = {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
};