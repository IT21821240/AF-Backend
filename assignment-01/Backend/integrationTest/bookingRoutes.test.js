const request = require('supertest');
const app = require("../server");


describe('Booking Registration API', () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJhZG1pbklEIjoiQUQyMDAxIiwiZW1haWwiOiJjaGFuaWR1QGdtYWlsLmNvbSIsImlkIjoiNjVmOTM3M2YwM2JkYTZkZGMzNmM4NTgzIn0sImlhdCI6MTcxMTExODU3MywiZXhwIjoxNzQyNjc2MTczfQ.SDx7cFpaNvg1RRQrwtqtNscHAlcZ10n0K4d4jw8ONaA";

    const bookingId = null;

    test("POST /api/book/bookings should create a new booking", async () => {
        const newBooking = {
          roomId: "RF503",
          courseCode: "SE4070",
          day: 6,
          startTime: {
            hours: 11,
            minutes: 0,
          },
          endTime: {
            hours: 13,
            minutes: 0,
          },
        };
    
        const response = await request(app)
          .post("/api/book/bookings")
          .set("Authorization", `Bearer ${token}`)
          .send(newBooking);
    
      });

      test("GET /api/book/bookings should return all bookings", async () => {
        const response = await request(app)
          .get('/api/book/bookings')
          .set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("All Booking Entries");
      });

      
      test("PUT api/book/${bookingId} should update the booking", async () => {
        const updatedBooking = {
            roomId: "RF503",
            courseCode: "SE4070",
            day: 7,
            startTime: {
              hours: 11,
              minutes: 0,
            },
            endTime: {
              hours: 13,
              minutes: 0,
            },
        };
        const response = await request(app)
          .put(`/api/book/${bookingId}`)
          .set("Authorization", `Bearer ${token}`)
          .send(updatedBooking);
      });
      
      test("DELETE /api/book/ should delete booking", async () => {
        const response = await request(app)
          .delete(`/api/book/${bookingId}`)
          .set("Authorization", `Bearer ${token}`);
  
      });
});