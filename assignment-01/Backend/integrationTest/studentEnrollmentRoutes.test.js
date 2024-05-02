const request = require("supertest");
const app = require("../server");

describe("Enrollment API", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJhZG1pbklEIjoiQUQyMDAxIiwiZW1haWwiOiJjaGFuaWR1QGdtYWlsLmNvbSIsImlkIjoiNjVmOTM3M2YwM2JkYTZkZGMzNmM4NTgzIn0sImlhdCI6MTcxMTA1MTA4MywiZXhwIjoxNzQyNjA4NjgzfQ.3OXmLlmb34aJkBLOe8sCS1EXPBYMXuc5OXx7aLXb0hs";
  const studentToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50Ijp7InN0dWRlbnRJRCI6IklUMjQwMSIsImVtYWlsIjoidGh1d2FAZ21haWwuY29tIiwiaWQiOiI2NWZjOGU0MmQ0YzExYjI1ZmI4MTNiYzcifSwiaWF0IjoxNzExMTI5MTMwLCJleHAiOjE3NDI2ODY3MzB9.52IzQ2JxN8xm1CaQwKHKY6b2IURdOGUj715B-b8Rhwk";
  
    test("POST /api/stuEnroll/enrollments should create a new timeTable", async () => {
    const newEnrollment = { courseId: "SE3040" };

    const response = await request(app)
      .post("/api/stuEnroll/enrollments")
      .set("Authorization", `Bearer ${studentToken}`)
      .send(newEnrollment);
  });

  const studentID= "IT2402";
  test('GET /api/stuEnroll/enrollments/:studentId should get Student', async () => {
    const response = await request(app)
        .get(`/api/stuEnroll/enrollments/${studentID}`)  
        .set('Authorization', `Bearer ${studentToken}`);  

    expect(response.status).toBe(200);
});

const courseId = "SE4070";
test('GET /api/stuEnroll/enrollments/course/:courseId should get Student', async () => {
  const response = await request(app)
      .get(`/api/stuEnroll/enrollments/course/${courseId}`)  
      .set('Authorization', `Bearer ${token}`);  

  expect(response.status).toBe(200);
});
});