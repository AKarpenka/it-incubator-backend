export type TDevice = {
    userId: string;
    deviceId: string;
    lastActiveDate: string; //дата выдачи 
    title: string;
    ip: string;
    expRTDate: string;
}

export type TDeviceViewModel = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
}
