import { CoreConfigModel, load as coreLoad } from 'be-core';
import { merge } from 'lodash';
import * as config from '../config/config.json';

export class OnepayConfig {
    uri: string;
    vpc_Locale: string;
    vpc_Version: string;
    vpc_Command: string;
    vpc_Merchant: string;
    vpc_AccessCode: string;
    vpc_MerchTxnRef: string;
    vpc_OrderInfo: string;
    vpc_Amount: string;
    vpc_Currency: string;
    vpc_ReturnURL: string;
    vpc_SHIP_Street01: string;
    vpc_SHIP_Provice: string;
    vpc_SHIP_City: string;
    vpc_SHIP_Country: string;
    vpc_Customer_Phone: string;
    vpc_Customer_Email: string;
    vpc_Customer_Id: string;
    vpc_TicketNo: string;

    AgainLink: string;
    Title: string;
    vpc_SecureHash: string;
}
export class AuthenConfig {
    authBrandUri: string
    authPlatformUri: string
}
export class ConfigModel extends CoreConfigModel {
    // add more config properties here
    mongodbUrl: string;
    onepay: OnepayConfig
    config: AuthenConfig
}

const defaultConfig = () => {
    const defaultConfig = new ConfigModel();
    return defaultConfig;
};

export const load = (): ConfigModel => {
    return merge(coreLoad(), defaultConfig(), config) as ConfigModel;
};

export const get = (key: string) => {
    const config = load();
    return config[key] as Record<string, any>;
};
