const request = require('supertest');
const app = require("../server");

describe('Student Registration API', () => {
    test('POST /api/stu/students should create a new Student', async () => {
        const newStudent = {
            fullName: 'Ann Joseph',
            dob: '01/01/1990',
            address: '123 Main St, City',
            phone: '+94772933466',
            email: 'annJos@gmail.com',
            password: 'Test#12356'
        };

        const response = await request(app)
            .post('/api/stu/students')
            .send(newStudent);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('fullName', newStudent.fullName);
        expect(response.body.data).toHaveProperty('email', newStudent.email);
    });

    const token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJhZG1pbklEIjoiQUQyMDAxIiwiZW1haWwiOiJjaGFuaWR1QGdtYWlsLmNvbSIsImlkIjoiNjVmOTM3M2YwM2JkYTZkZGMzNmM4NTgzIn0sImlhdCI6MTcxMTExODU3MywiZXhwIjoxNzQyNjc2MTczfQ.SDx7cFpaNvg1RRQrwtqtNscHAlcZ10n0K4d4jw8ONaA";
    const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50Ijp7InN0dWRlbnRJRCI6IklUMjQwMSIsImVtYWlsIjoidGh1d2FAZ21haWwuY29tIiwiaWQiOiI2NWZjOGU0MmQ0YzExYjI1ZmI4MTNiYzcifSwiaWF0IjoxNzExMDUwNDM4LCJleHAiOjE3NDI2MDgwMzh9.IXhDbX3EL-9VAn047Qur6Bi0ZXskuWZO-JxjgbNMWdI";

    test('GET /api/stu/students should return all students', async () => {
        const response = await request(app)
            .get('/api/fac/students')
            .set('Authorization', `Bearer ${token1}`);
    });

    const studentID = "IT2403";
   
    test('GET /api/stu/ should get Student', async () => {
        const response = await request(app)
            .get(`/api/stu/${studentID}`)  
            .set('Authorization', `Bearer ${token2}`);  

    });

    test("PUT api/stu/${studentID} should update the Student", async () => {
        const updatedStudent = {
            fullName: 'Ann Joseph',
            dob: '01/01/1990',
            address: '123 Main St, City',
            phone: '+94772933466',
            email: 'annJos@gmail.com',
            password: 'Test#12356'
        };
    
        const response = await request(app)
          .put(`/api/stu/${studentID}`) 
          .set('Authorization', `Bearer ${token2}`) 
          .send(updatedStudent)
    });

    test('DELETE /api/stu/ should delete Student', async () => {
        const response = await request(app)
            .delete(`/api/stu/${studentID}`)  
            .set('Authorization', `Bearer ${token1}`);  
    });
});
