export interface IAjaxResponse {
    success: boolean;
    result?: any;
    targetUrl?: string;
    error?: any;
    unAuthorizedRequest: boolean;
    __abp: boolean;
}
