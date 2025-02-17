import {throttlingRateCollection} from "../../../db/db";

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
        // console.log(`countDocuments: ${tenSecondsAgo.toISOString()}`);
        const result = await this.db.countDocuments({ip, url, date:{$gte:tenSecondsAgo}});
        // console.log('countDocuments: ', result);
        return result;
    }

}