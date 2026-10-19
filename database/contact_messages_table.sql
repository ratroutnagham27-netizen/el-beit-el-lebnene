USE INTERNSHIP;
GO

IF OBJECT_ID('[dbo].[ContactMessages]', 'U') IS NULL
BEGIN
  CREATE TABLE [dbo].[ContactMessages] (
      id INT IDENTITY(1,1) PRIMARY KEY,
      name NVARCHAR(150) NOT NULL,
      email NVARCHAR(150) NOT NULL,
      message NVARCHAR(MAX) NOT NULL,
      createdAt DATETIME DEFAULT GETDATE()
  );
END
GO
