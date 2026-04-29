-- Insert Admin User
INSERT INTO users (email, username, password, full_name, phone, role, is_active, is_approved, created_at, updated_at)
VALUES (
    's.aathiththan14@gmail.com',
    'admin',
    'admin123',
    'Admin',
    NULL,
    'ADMIN',
    true,
    true,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    email = 'updated';
