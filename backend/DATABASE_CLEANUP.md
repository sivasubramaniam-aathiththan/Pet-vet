# Run these SQL commands in your MySQL database to clear old data:

```sql
USE pet_care_sys;

-- Clear old data
TRUNCATE TABLE medication;
TRUNCATE TABLE vaccination;

-- If you want to reset everything:
-- TRUNCATE TABLE appointments;
-- TRUNCATE TABLE pets;
-- TRUNCATE TABLE users;
```

# Or add this to application.properties to recreate tables:
spring.jpa.hibernate.ddl-auto=create-drop
# Change back to 'update' after first run
