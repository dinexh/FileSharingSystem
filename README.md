# FileSharingSystem

A secure and user-friendly file sharing application built with React and Spring Boot.

## Features

- User authentication with JWT-based security
- File upload, download, and sharing capabilities
- Email notifications for file sharing with customizable preferences
- Light/Dark mode theme support
- File organization with starred/favorite files
- Share files via email or shareable links
- Permission-based file access controls (read-only or edit)
- File metadata storage and management
- Responsive design for all devices

## System Architecture

### File Storage and Sharing

The FileSharingSystem employs a hybrid architecture for file storage and sharing:

1. **Physical Storage**:
   - Files are stored in the filesystem within an `uploads` directory
   - Files are renamed with UUID-based names to prevent conflicts
   - Original filenames and metadata are preserved in the database
   - File paths are stored in the database to facilitate retrieval

2. **Database Storage**:
   - File metadata stored in MySQL database
   - Includes fields for owner, size, type, upload date, etc.
   - Maintains relationships between files and users

3. **Sharing Mechanism**:
   - Files are shared via reference rather than duplication
   - A `FileShare` entity tracks sharing relationships:
     - Owner ID
     - File ID
     - Recipient email
     - Permission level (read/edit)
     - Sharing date and expiration date
   - Email notifications sent when files are shared
   - Optional shareable links for easy access

4. **Security**:
   - JWT-based authentication for API access
   - Permission-based access control
   - Files are private by default
   - Optional expiration dates for shared files

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Java JDK 11 or higher
- Maven
- MySQL database

### Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE filesharing_db;
   ```

2. Create a user or use root (for development):
   ```sql
   CREATE USER 'fileuser'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON filesharing_db.* TO 'fileuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Backend Setup (Spring Boot)

1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com/yourusername/FileSharingSystem.git
   cd FileSharingSystem/backend
   ```

2. Configure your database connection in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/filesharing_db
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   ```

3. Configure email settings in the same file (for sharing notifications):
   ```properties
   spring.mail.host=smtp.example.com
   spring.mail.port=587
   spring.mail.username=your_email@example.com
   spring.mail.password=your_email_password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   ```

4. **Create uploads directory** (this folder is excluded from git):
   ```bash
   mkdir uploads
   ```

5. Build and run the Spring Boot application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend server will start on http://localhost:8080

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd ../client
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

### User Registration and Login

1. Open your browser and go to http://localhost:3000
2. Click "signup" to create a new account
3. Verify your email (if configured)
4. Log in with your credentials

### File Management

1. **Upload Files**: 
   - Use the upload button on the dashboard
   - Drag and drop files into the upload area
   - Maximum file size is 25MB by default

2. **View Files**:
   - All your files appear on the dashboard
   - Filter by name, type, or date
   - Click on a file to preview (if supported)
   - Star important files to find them quickly

3. **Download Files**:
   - Click the download icon on any file
   - Files are downloaded with their original names

### Sharing Files

1. **Share with Users**:
   - Click the share icon on any file
   - Enter recipient email address
   - Choose permission level (read-only or edit)
   - Add a message (optional)
   - Toggle email notification

2. **Share via Link**:
   - Click "Get Link" on any file
   - Copy the generated link
   - Links can be set to expire (optional)

3. **Manage Shared Files**:
   - Go to the "Shared" tab
   - View files shared with you
   - View files you've shared with others
   - Revoke access if needed

### User Settings

1. Access your profile by clicking your username
2. Update personal information
3. Change password
4. Configure notification preferences
5. Toggle between light and dark themes

## Troubleshooting

### Common Issues

1. **Backend connection errors**
   - Ensure MySQL is running
   - Verify database credentials in application.properties
   - Check that port 8080 is not in use

2. **File upload issues**
   - Confirm file size is under 25MB (default limit)
   - Check that the uploads directory has write permissions
   - Verify file type is not blocked by security settings

3. **Email notification issues**
   - Verify SMTP settings in application.properties
   - Check spam folder for notification emails
   - Ensure email provider allows SMTP access

## API Documentation

The backend provides RESTful APIs for all operations:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/files` - List all user files
- `POST /api/files/upload` - Upload new file
- `GET /api/files/{id}` - Download file
- `POST /api/files/share` - Share file with user
- `GET /api/files/shared-with-me` - List received files
- `GET /api/files/shared-by-me` - List shared files

## Developer 
This site was made for a hackathon at KLEF (Deembed to be University) by https://dineshkorukonda.in

## License

This project is licensed under the MIT License.