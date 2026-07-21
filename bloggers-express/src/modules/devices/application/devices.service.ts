import { WithId } from "mongodb/mongodb";
import { TDevice } from "../types/device";
import { DevicesQueryRepository } from "../repositories/devices.query-repository";
import { Statuses } from "../../../core/types/resultStasuses";
import { Result } from "../../../core/types/resultTypes";
import { DevicesRepository } from "../repositories/devices.repository";
import { inject, injectable } from "inversify";

@injectable()
export class DevicesService {
    constructor(
        @inject(DevicesRepository) protected devicesRepository: DevicesRepository,
        @inject(DevicesQueryRepository) protected devicesQueryRepository: DevicesQueryRepository,
    ) {}

    async getDevicesByUserId (userId: string): Promise<{ devices: WithId<TDevice>[]; totalCount: number }> {
        return await this.devicesQueryRepository.getAllDevicesByUserId(userId);
    }

    async deleteDeviceByDeviceId (userId: string, deviceId: string): Promise<Result<{} | null>> {
        const foundDevice = await this.devicesQueryRepository.getDeviceByParams({deviceId});

        if(!foundDevice) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'deviceId', message: 'Device not found' }],
            };
        }

        if(foundDevice.userId !== userId) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'Forbidden',
                extensions: [{ field: 'userId', message: 'You are trying to delete the deviceId of other user' }],
            };
        }

        const deletedDevice = await this.devicesRepository.deleteDeviceByParams({userId, deviceId});

        if (deletedDevice.deletedCount < 1) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'deviceId', message: 'Couldnt remove device' }],
            };
        };

        return {
            status: Statuses.NoContent,
            data: {},
            extensions: [],
        };
    }

    async deleteAllDevices (userId: string, deviceId: string): Promise<Result<{} | null>> {
        await this.devicesRepository.deleteAllDevices(userId, deviceId);

        return {
            status: Statuses.NoContent,
            data: {},
            extensions: [],
        };
    }
}