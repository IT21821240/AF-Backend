const request = require('supertest');
const app = require("../server");

describe('Admin Registration API', () => {
    test('POST /api/alert should create a new admin', async () => {
        const newNotify = {
            recipient:'IT2401',
            message:'Announcement',
        };

        const response = await request(app)
            .post('/api/alert')
            .send(newNotify);
    });
});