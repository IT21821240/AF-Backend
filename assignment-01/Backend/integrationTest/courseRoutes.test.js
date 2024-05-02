const request = require('supertest');
const app = require("../server");

describe("Course API", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJhZG1pbklEIjoiQUQyMDAxIiwiZW1haWwiOiJjaGFuaWR1QGdtYWlsLmNvbSIsImlkIjoiNjVmOTM3M2YwM2JkYTZkZGMzNmM4NTgzIn0sImlhdCI6MTcxMTA1MTA4MywiZXhwIjoxNzQyNjA4NjgzfQ.3OXmLlmb34aJkBLOe8sCS1EXPBYMXuc5OXx7aLXb0hs";
    
    test("POST /api/cou/courses should create a new course", async () => {
      const newCourseData = {
        courseCode: "SE3040",
        name: "Application Frameworks",
        description:
          "This course explores the frameworks popularly used in industry",
        credits: 4,
        faculties: ["F1000", "F1002"],
      };
  
      const response = await request(app)
        .post("/api/cou/courses")
        .set("Authorization", `Bearer ${token}`)
        .send(newCourseData);
  
      expect(response.status).toBe(201);
  
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Course created successfully");
    });
  
    test("GET /api/cou/courses should return all courses", async () => {
      const response = await request(app).get("/api/cou/courses");
  
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("All Courses List");
      expect(response.body.courses).toBeDefined();
    });

    const courseCode = "SE3040";
   
    test("PUT /api/cou/${courseCode} should update the course", async () => {
        const updatedCourse = {
          courseCode: "SE3040",
          name: "Application Frameworks",
          description:
            "This course explores the frameworks popularly used in industry",
          credits: 4,
          faculties: ["F1000", "F1002"],
        };
    
        const response = await request(app)
          .put(`/api/cou/${courseCode}`)
          .set("Authorization", `Bearer ${token}`)
          .send(updatedCourse);
    
        expect(response.status).toBe(200);
      });
      test("DELETE /api/cou/ should delete course", async () => {
        const response = await request(app)
          .delete(`/api/cou/${courseCode}`)
          .set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(200);
      });


});