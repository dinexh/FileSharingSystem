-- SQL script to modify foreign key constraints for user deletion
-- Apply this script to your database before attempting to delete user accounts

-- First, drop the existing foreign key constraints
ALTER TABLE files DROP FOREIGN KEY FKdgr5hx49828s5vhjo1s8q3wdp; -- user_id constraint
ALTER TABLE files DROP FOREIGN KEY FK75ktc1xy9ycr9hvwp2v82r7ui; -- owner_id constraint (if it exists)

-- Recreate the foreign keys with ON DELETE SET NULL to allow user deletion
ALTER TABLE files 
ADD CONSTRAINT FK_files_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) 
ON DELETE SET NULL;

ALTER TABLE files 
ADD CONSTRAINT FK_files_owner_id 
FOREIGN KEY (owner_id) REFERENCES users(id) 
ON DELETE SET NULL;

-- Update nullable status of user_id and owner_id columns
ALTER TABLE files MODIFY user_id BIGINT NULL;
ALTER TABLE files MODIFY owner_id BIGINT NULL;

-- Handle StarredFile table (if it has foreign key constraints to users)
ALTER TABLE starred_files DROP FOREIGN KEY FK_starred_files_user_id;
ALTER TABLE starred_files 
ADD CONSTRAINT FK_starred_files_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) 
ON DELETE CASCADE;

-- Handle FileShare table (if it has foreign key constraints to users)
ALTER TABLE file_shares DROP FOREIGN KEY FK_file_shares_owner_id;
ALTER TABLE file_shares DROP FOREIGN KEY FK_file_shares_shared_with_id;

ALTER TABLE file_shares 
ADD CONSTRAINT FK_file_shares_owner_id 
FOREIGN KEY (owner_id) REFERENCES users(id) 
ON DELETE SET NULL;

ALTER TABLE file_shares 
ADD CONSTRAINT FK_file_shares_shared_with_id 
FOREIGN KEY (shared_with_id) REFERENCES users(id) 
ON DELETE SET NULL;

-- Update nullable status of owner_id and shared_with_id columns
ALTER TABLE file_shares MODIFY owner_id BIGINT NULL;
ALTER TABLE file_shares MODIFY shared_with_id BIGINT NULL; 