import {SETTINGS} from "../../src/settings";
import request, {Response} from "supertest";
import {app} from "../../src/app";
import {DeviceViewModel} from "../../src/features/sessions/type/input-output-device-sessions";

const URL = SETTINGS.PATH.SECURITY;
const URL_PATH = URL + "/devices";

export type ResponseBodySuperTest<T = null> = Promise<Response & { body: T }>

export const deviceSessionsRequests = {
    getAllDeviceSessions: async (cookies:string[]): ResponseBodySuperTest<DeviceViewModel[]> => {
        let res = await request(app).get(URL_PATH).set('Cookie',  cookies.join('; '));
        return res;
    },
    deleteAllOtherDeviceSessions: async (cookies:string[]): ResponseBodySuperTest<null> => {
        let res = await request(app).delete(URL_PATH).set('Cookie',  cookies.join('; '));
        return res;
    },

    deleteDeviceSessionByDeviceId: async (deviceId:string, cookies:string[]): ResponseBodySuperTest<null> => {
        let res = await request(app).delete(URL_PATH+'/'+deviceId).set('Cookie', cookies.join('; '));
        return res;
    },

}