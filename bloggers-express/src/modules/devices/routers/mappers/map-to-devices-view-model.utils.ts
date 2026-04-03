import { WithId } from "mongodb/mongodb";
import { TDevice, TDeviceViewModel } from "../../types/device";

export function mapToDevicesViewModel(devices: WithId<TDevice>[]): TDeviceViewModel[] {
    return devices.map(
        (device): TDeviceViewModel => ({
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate,
        deviceId: device.deviceId,
    }));
}