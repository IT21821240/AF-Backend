const request = require('supertest');
const app = require("../server");

describe('Admin Registration API', () => {
    test('POST /api/adm/admins should create a new admin', async () => {
        const newAdmin = {
            fullName: 'Ann Joseph',
            dob: '01/01/1990',
            address: '123 Main St, City',
            phone: '+94772933466',
            email: 'annJos@gmail.com',
            password: 'Test#12356'
        };

        const response = await request(app)
            .post('/api/adm/admins')
            .send(newAdmin);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('fullName', newAdmin.fullName);
        expect(response.body.data).toHaveProperty('email', newAdmin.email);
    });

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJhZG1pbklEIjoiQUQyMDAxIiwiZW1haWwiOiJjaGFuaWR1QGdtYWlsLmNvbSIsImlkIjoiNjVmOTM3M2YwM2JkYTZkZGMzNmM4NTgzIn0sImlhdCI6MTcxMTA0MDU0MywiZXhwIjoxNzQyNTk4MTQzfQ.TT2iecQRP10Wlj0xpAeQpGT37yd_Yale7uRhq8kcozg";

    test('GET /api/adm/admins should return all admins', async () => {
        const response = await request(app)
            .get('/api/adm/admins')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('All Admins List');
        expect(response.body.admins).toBeDefined(); // Ensure admins array is defined
    });

    const adminID = "AD2004";
   
    test('GEt /api/adm/ should get admin', async () => {
        const response = await request(app)
            .get(`/api/adm/${adminID}`)  
            .set('Authorization', `Bearer ${token}`);  

        expect(response.status).toBe(200);
    });

    test("PUT api/adm/${adminID} should update the admin", async () => {
        const updatedAdmin = {
            fullName: 'Ann Joseph',
            dob: '01/01/1990',
            address: '123 Main St, City',
            phone: '+94772933466',
            email: 'annJos@gmail.com',
            password: 'Test#12356'
        };
    
        const response = await request(app)
          .put(`/api/adm/${adminID}`) 
          .set('Authorization', `Bearer ${token}`) 
          .send(updatedAdmin);
      });

    test('DELETE /api/adm/ should delete admin', async () => {
        const response = await request(app)
            .delete(`/api/adm/${adminID}`)  
            .set('Authorization', `Bearer ${token}`);  

        expect(response.status).toBe(200);
    });
});
