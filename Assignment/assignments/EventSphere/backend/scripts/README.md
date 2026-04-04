# Admin Scripts for EventSphere

This directory contains utility scripts for managing user roles in the EventSphere application.

## Problem: Failed to Create Event

If you're experiencing a "Failed to create event" error, it's likely because your user account doesn't have admin privileges. The EventSphere application requires admin privileges to create events.

## Solution: Update User Role to Admin

You can use the provided scripts to check and update user roles.

### 1. Check Current User Role

First, check if your user has admin privileges:

```bash
# Navigate to the backend directory
cd backend

# Run the check script with your email
npm run check-user-role your.email@example.com
```

This will display your current role ("user" or "admin").

### 2. Update User Role to Admin

If your role is "user", update it to "admin":

```bash
# Navigate to the backend directory
cd backend

# Run the make-admin script with your email
npm run make-admin your.email@example.com
```

### 3. Verify the Update

After updating, verify that your role has been changed to "admin":

```bash
# Run the check script again
npm run check-user-role your.email@example.com
```

## Next Steps

After updating your role to admin:

1. Log out of the application
2. Log back in to refresh your session
3. Try creating an event again

You should now be able to create events successfully.