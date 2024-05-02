const request = require('supertest');
const app = require("../server");

describe('Room Registration API', () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJhZG1pbklEIjoiQUQyMDAxIiwiZW1haWwiOiJjaGFuaWR1QGdtYWlsLmNvbSIsImlkIjoiNjVmOTM3M2YwM2JkYTZkZGMzNmM4NTgzIn0sImlhdCI6MTcxMTA0MjIwNywiZXhwIjoxNzQyNTk5ODA3fQ.3xwW7k-aq9pyiDdAp1SfVlD9ldIFo4wWK6X1J70pWzU";

    test('POST /api/ro/rooms should create a new Room', async () => {
        const newRoom = {
            floorNo: '5',
            building: 'computing',
            name: 'Lab',
            capacity: '60',
            resources: ["projector", "speaker","monitors"],
        };

        const response = await request(app)
            .post('/api/ro/rooms')
            .set('Authorization', `Bearer ${token}`)
            .send(newRoom);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Room created successfully");

    });

    test('GET /api/ro/rooms should return all Rooms', async () => {
        const response = await request(app)
            .get('/api/ro/rooms')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('All Rooms List');
        expect(response.body.rooms).toBeDefined(); // Ensure Rooms array is defined
    });

    const roomId = "RF504";
   
    test('GEt /api/ro/ should get Room', async () => {
        const response = await request(app)
            .get(`/api/ro/${roomId}`)  
            .set('Authorization', `Bearer ${token}`);  

        expect(response.status).toBe(200);
    });

    test("PUT api/ro/${roomId} should update the Room", async () => {
        const updatedRoom = {
            floorNo: '5',
            building: 'computing',
            name: 'Lab',
            capacity: '60',
            resources: ["projector", "speaker","monitors"],
        };
    
        const response = await request(app)
          .put(`/api/ro/${roomId}`) 
          .set('Authorization', `Bearer ${token}`) 
          .send(updatedRoom);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Room updated successfully");
      });

    test('DELETE /api/ro/ should delete Room', async () => {
        const response = await request(app)
            .delete(`/api/ro/${roomId}`)  
            .set('Authorization', `Bearer ${token}`);  

        expect(response.status).toBe(200);
    });
});
