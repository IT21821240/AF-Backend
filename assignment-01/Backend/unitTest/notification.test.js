const { createNotification } = require("../controllers/notificationController");
const Notification = require("../models/notification");

jest.mock("../models/notification", () => ({
  create: jest.fn(),
}));

describe("createNotification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a notification with the given recipient and message", async () => {
    const recipient = "user@example.com";
    const message = "Test notification";

    await createNotification(recipient, message);


  });

  it("should log an error if there's an error sending the notification", async () => {
    const recipient = "user@example.com";
    const message = "Test notification";

    // Mock the Notification.create to throw an error
    Notification.create.mockRejectedValueOnce(new Error("Database error"));

    await createNotification(recipient, message);

  });
});