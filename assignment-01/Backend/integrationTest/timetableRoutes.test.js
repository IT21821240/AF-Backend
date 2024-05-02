const request = require('supertest');
const app = require("../server");

describe("TimeTable API", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJhZG1pbklEIjoiQUQyMDAxIiwiZW1haWwiOiJjaGFuaWR1QGdtYWlsLmNvbSIsImlkIjoiNjVmOTM3M2YwM2JkYTZkZGMzNmM4NTgzIn0sImlhdCI6MTcxMTExODU3MywiZXhwIjoxNzQyNjc2MTczfQ.SDx7cFpaNvg1RRQrwtqtNscHAlcZ10n0K4d4jw8ONaA";
    const id = null;
    test("POST /api/time/timetables should create a new timeTable", async () => {
      const newTimeTable = {
        courseId: "SE4070",
        day: 6,
        startTime: {
          hours: 11,
          minutes: 0,
        },
        endTime: {
          hours: 13,
          minutes: 0,
        },
        faculty: "F1000",
        location: "RF503",
      };
  
      const response = await request(app)
        .post("/api/time/timetables")
        .set("Authorization", `Bearer ${token}`)
        .send(newTimeTable);
  
    });

    test("GET /api/time/timetable should return all timeTables", async () => {
        const response = await request(app)
          .get("/api/time/timetable")
          .set("Authorization", `Bearer ${token}`);
    
      });

      const timetableId = null;
      test("PUT api/time/:timetableId should update the admin", async () => {
        const updatedAdmin = {
          courseId: "SE4070",
          day: 6,
          startTime: {
            hours: 11,
            minutes: 0,
          },
          endTime: {
            hours: 13,
            minutes: 0,
          },
          faculty: "F1000",
          location: "RF503",
        };
    
        const response = await request(app)
          .put(`/api/time/${timetableId}`) 
          .set('Authorization', `Bearer ${token}`) 
          .send(updatedAdmin);
    
        });

    test('DELETE /api/time/:timetableId should delete admin', async () => {
        const response = await request(app)
            .delete(`/api/time/${timetableId}`)  
            .set('Authorization', `Bearer ${token}`);  
    });
});