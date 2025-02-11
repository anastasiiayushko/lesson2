import {throttlingRateCollection} from "../../../db/db";
import {DbThrottlingRateType} from "../../../db/types/db-throttling-rate-type";

export class ThrottlingRateRepository {
    private db;

    constructor() {
        this.db = throttlingRateCollection;
        this.logRequest = this.logRequest.bind(this);
        this.countDocuments = this.countDocuments.bind(this);
    }

    async logRequest(ip: string, url: string) {
        await this.db.insertOne({ip: ip, url: url, date: new Date()});
    }

    async countDocuments(ip: string, url: string,): Promise<number> {
        const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
        const result = await this.db.countDocuments({ip, url, date:{$gte:tenSecondsAgo}});
        return result;
    }

}