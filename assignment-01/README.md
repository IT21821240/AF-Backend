# A Secure RESTful API for a University Timetable Management System

### Description
This project aims to develop a robust RESTful API using Express.js, a popular Node.js framework, and MongoDB, a NoSQL database, to manage timetable, courses, users, and other related data. The API will implement secure authentication and authorization mechanisms to ensure the confidentiality and integrity of user data.

### Features
1. **User Management**: Manage users with different roles (admins, faculty, students).
2. **Authentication**: Use JWT for secure user authentication.
3. **Authorization**: Ensure users can only access authorized resources.
4. **Timetable Management**: Create, update, retrieve, and delete timetables for courses.
5. **Course Management**: Perform operations for courses (create, retrieve, update, delete).
6. **Room and Resource Booking**: Manage availability of classrooms and resources, allowing bookings without overlaps.
7. **Student Enrollment**: Enable students to enroll in courses and view their timetables. Allow faculty and admins to manage student enrollments.
8. **Notifications**: Notify users of timetable or room changes, and important announcements.
9. **Logging**: Use Winston and Express-Winston for logging application events and requests.
10. **Testing**: Conduct unit tests with Jest, integration tests with Supertest, and security testing with OWASP ZAP. Also perform performance testing with Artillery.io.
11. **Data Persistence**: Utilize MongoDB for efficient data storage.
12. **RESTful API**: Design an intuitive and clean API following REST principles.
13. **Software Development Best Practices**: Adhere to best practices such as modularization, error handling, logging, and documentation to ensure code quality and scalability.

### Setup Instructions:

- Cloning the Repository and accessing the Project:
First, ensure that you have Git installed on your local machine. If not, you can download and install it from Git's official website.
Open a terminal or command prompt on the computer.
Navigate to the directory where you want to store the project files using the 'cd' command.
Once you're in the desired directory, you can clone the project repository using the following command:
```sh
git clone <https://github.com/sliitcsse/assignment-01-IT21821240>
```
Press Enter to execute the command. Git will download all the files from the repository and create a local copy in the directory you specified.
After cloning the repository, navigate into the project directory using the cd command. 
```sh
cd Backend
```

- Installing Dependencies using npm or Yarn
To install these dependencies, you'll need a package manager like npm (Node Package Manager) or Yarn. Both npm and Yarn allow you to install packages listed in the package.json file along with their respective versions.
```sh
npm install 
yarn install
```

- Setting up a MongoDB Database
to use a cloud service, sign up for an account on MongoDB Atlas, create a new cluster
Then follow the instructions to connect your application to the cluster.
configure environment variables by creating a file named .env in the root directory of your project and defining key-value pairs like this
MONGODB_URL=mongodb://localhost:27017/mydatabase
Ensure that you add the .env file to your .gitignore to avoid committing sensitive information to version control.

- Starting the Server:
Once you've installed dependencies, set up the database, configured environment variables, and run any necessary database scripts, you can start the server to run your application.
Typically, you'll have a script defined in your package.json file to start the server.
```sh
npm run dev
```

### Testing 
#### Unit Testing
Unit testing is the practice of testing individual units or components of a software application in isolation to ensure that they function correctly.
 Unit test cases are under "unitTest" folder. To run the test, simply you have to give the command as below.
```sh
npm test <Unit-test-file-name>.test.js
```

#### Integration Testing
Integration testing involves testing the interactions between different components or modules of a software application to ensure that they work together as expected.
Integration test cases are under "integrationTest folder". To run the test, simply you have to give the command as below.
```sh
npm test <Integration-test-file-name>.test.js
```

#### Performance Testing
Performance testing is conducted to evaluate how a system behaves under different conditions and to ensure that it meets performance requirements.
To use Artillery for performace testing, you have to install in your machine
```sh
npm install -g artillery
```
Performance test cases are located under the "performanceTest" folder. To run the tests, simply execute the command below:
```sh
artillery run <test_file_name>.yaml
```
After the test case is executed, you will receive a JSON file. To generate the HTML report, you can use the created JSON file:
```sh
artillery report <test_file_name>.json
```
You will receive an HTML file where you can view the details of the API calls and their security level.
Already created JSON files and reports are available in the "integrationTesting" folder itself for your reference

#### Security Testing
Security testing involves identifying vulnerabilities and weaknesses in a software application's security measures to protect against potential threats.
For security testing, we used ZAP (Zed Attack Proxy), a widely used open-source security testing tool.
These testing practices help ensure the reliability, scalability, and security of our software application.
To utilize OWASP ZAP for security testing, you must download the appropriate version for your machine from [Download ZAP](https://www.zaproxy.org/download/). Refer to [OWASP ZAP documentation](https://www.zaproxy.org/docs/) for instructions.
The already completed security test report is available in the "securityTest" folder for reference.

### API Documentation
[API Documentation is available as ApiDocumentation.json in the folder.](https://github.com/sliitcsse/assignment-01-IT21821240/blob/main/Backend/ApiDocumentation.json)

### Contributing
Contributions are welcome! Please follow the standard guidelines:
- Fork the repository.
- Create a new branch (git checkout -b feature/new-feature).
- Commit your changes (git commit -am 'Add new feature').
- Push to the branch (git push origin feature/new-feature).
- Create a new Pull Request.

### Conclusion
This README provides comprehensive documentation for setting up, using, and contributing to the University Timetable Management System API. By following the instructions outlined here, you can effectively utilize the API for managing timetables, courses, users, and other related functionalities in a secure and efficient manner.
If you have any questions, feedback, or suggestions, please feel free to reach out. Thank you for your interest and support!

