const request = require('supertest');
const app = require("../server");

describe('Faculty Registration API', () => {
    test('POST /api/fac/faculties should create a new Faculty', async () => {
        const newFaculty = {
            fullName: 'Ann Joseph',
            dob: '01/01/1990',
            address: '123 Main St, City',
            phone: '+94772933466',
            email: 'annJos@gmail.com',
            password: 'Test#12356'
        };

        const response = await request(app)
            .post('/api/fac/faculties')
            .send(newFaculty);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('fullName', newFaculty.fullName);
        expect(response.body.data).toHaveProperty('email', newFaculty.email);
    });

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJhZG1pbklEIjoiQUQyMDAxIiwiZW1haWwiOiJjaGFuaWR1QGdtYWlsLmNvbSIsImlkIjoiNjVmOTM3M2YwM2JkYTZkZGMzNmM4NTgzIn0sImlhdCI6MTcxMTA0MDU0MywiZXhwIjoxNzQyNTk4MTQzfQ.TT2iecQRP10Wlj0xpAeQpGT37yd_Yale7uRhq8kcozg";
    const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWN1bHR5Ijp7ImZhY3VsdHlJRCI6IkYxMDAxIiwiZW1haWwiOiJqYXlhQGdtYWlsLmNvbSIsImlkIjoiNjVmODRjY2E5NTNmNDExNTVmMzcxMjViIn0sImlhdCI6MTcxMTA0MDU3MywiZXhwIjoxNzQyNTk4MTczfQ.FkY4pkJr4xvjhQSFALtW8SwtDwK7f-DCPx01cMqTQ3I";

    test('GET /api/fac/faculties should return all Faculties', async () => {
        const response = await request(app)
            .get('/api/fac/faculties')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('All Faculties List');
        expect(response.body.faculties).toBeDefined(); // Ensure Facultys array is defined
    });

    const facultyID = "F1003";
   
    test('GEt /api/fac/ should get Faculty', async () => {
        const response = await request(app)
            .get(`/api/fac/${facultyID}`)  
            .set('Authorization', `Bearer ${token2}`);  

        expect(response.status).toBe(200);
    });

    test("PUT api/fac/${facultyID} should update the Faculty", async () => {
        const updatedFaculty = {
            fullName: 'Ann Joseph',
            dob: '01/01/1990',
            address: '123 Main St, City',
            phone: '+94772933466',
            email: 'annJos@gmail.com',
            password: 'Test#12356'
        };
    
        const response = await request(app)
          .put(`/api/fac/${facultyID}`) 
          .set('Authorization', `Bearer ${token2}`) 
          .send(updatedFaculty);
    
      });

    test('DELETE /api/fac/ should delete Faculty', async () => {
        const response = await request(app)
            .delete(`/api/fac/${facultyID}`)  
            .set('Authorization', `Bearer ${token2}`);  

        expect(response.status).toBe(200);
    });
});
