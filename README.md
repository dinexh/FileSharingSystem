# FileSharingSystem

A secure and user-friendly file sharing application built with React and Spring Boot.

## Features

- User authentication and account management
- File upload, download, and sharing
- Email notifications for file sharing (with toggleable preferences)
- Light/Dark mode themes
- File organization with starred files
- Share files via email
- Responsive design for all devices

## Getting Started

This application consists of two parts:
1. A React.js frontend client
2. A Spring Boot backend server

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Java JDK 11 or higher
- Maven
- MySQL database

## Setup and Installation

### Database Setup

1. Create a MySQL database named `filesharing_db`
2. Create a database user or use the root user

### Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure your database connection in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/filesharing_db
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   ```

3. Build and run the Spring Boot application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend server will start on http://localhost:8080

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The React app will start on http://localhost:3000

## Using the Application

1. Open your browser and go to http://localhost:3000
2. Create a new account or log in with existing credentials
3. Upload files from the home page using the upload button
4. Share files with other users by entering their email
5. Manage notifications and appearance in Settings

## API Documentation

The backend provides RESTful APIs for all operations:

- `/api/auth/register` - User registration
- `/api/auth/login` - User authentication
- `/api/files` - File operations (upload, download, list)
- `/api/files/share` - File sharing operations
- `/api/users` - User profile management

## Troubleshooting

### Common Issues

1. **Backend connection errors**
   - Ensure MySQL is running
   - Check the database credentials in application.properties

2. **File upload issues**
   - Check that the upload directory exists and has proper permissions
   - Verify file size limits in application.properties

3. **Email notification issues**
   - Ensure email configuration is correct in application.properties
   - Check spam folder for notification emails

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.