# Admin Setup Instructions

## Accessing the Admin Panel

The admin panel is now **hidden from public view** for enhanced security.

To access it, add `?admin` to your site URL:

- **Local development**: `http://localhost:5173?admin`
- **Production**: `https://yoursite.com?admin`

No admin button appears on the public site, keeping the admin panel completely hidden from visitors.

## Creating Your First Admin Account

The first time you visit the admin URL:

1. Navigate to your site with `?admin` in the URL
2. Click "Sign Up" on the login form
3. Enter your email and password
4. You'll be automatically logged in and can start managing the site

## Logging In

1. Visit your site with `?admin` in the URL
2. Enter your admin credentials
3. You can now:
   - Manage installers (add, edit, delete)
   - View and manage quote requests from customers

## Managing Content

### Installers Tab
- Add new solar installers with company details
- Edit existing installer information
- Delete installers that are no longer active
- All changes update the public directory immediately

### Quote Requests Tab
- View all customer quote submissions
- See contact information (name, address, email, phone)
- Track when quotes were submitted
- Delete processed requests

## Security Notes

- The admin panel requires authentication to access
- Admin URL is only known to site administrators
- No public links or buttons reveal the admin panel
- All admin actions are logged and secured
- Use a strong password for your admin account
