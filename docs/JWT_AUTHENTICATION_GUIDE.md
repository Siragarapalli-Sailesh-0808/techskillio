# JWT Authentication Integration Guide

## Overview
This document explains the JWT authentication system integrated into TechSkillio, including how to use the AuthManager and make authenticated API requests.

## API Configuration

### Base URL
```javascript
const API_BASE_URL = 'http://192.168.1.2:8000';
```

### Authentication Endpoints

#### 1. Login
- **Endpoint**: `/api/v1/auth/login/`
- **Method**: `POST`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "8",
  "profile": { ... }
}
```

#### 2. Change Password (Authenticated)
- **Endpoint**: `/api/v1/auth/change-password/`
- **Method**: `POST`
- **Headers**:
```
Authorization: TSK <access_token>
```
- **Request Body**:
```json
{
  "old_password": "oldPassword123",
  "new_password": "newPassword123"
}
```

#### 3. Password Reset Flow

**Step 1: Request Reset Code**
- **Endpoint**: `/api/v1/auth/password-reset/request/`
- **Method**: `POST`
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Step 2: Verify Reset Code**
- **Endpoint**: `/api/v1/auth/password-reset/verify/`
- **Method**: `POST`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```
- **Response**:
```json
{
  "reset_token": "temporary_reset_token"
}
```

**Step 3: Reset Password**
- **Endpoint**: `/api/v1/auth/password-reset/confirm/`
- **Method**: `POST`
- **Request Body**:
```json
{
  "token": "temporary_reset_token",
  "new_password": "newPassword123"
}
```

#### 4. Token Refresh
- **Endpoint**: `/api/v1/auth/token/refresh/`
- **Method**: `POST`
- **Request Body**:
```json
{
  "refresh": "refresh_token_here"
}
```
- **Response**:
```json
{
  "access": "new_access_token"
}
```

## Using the AuthManager

### Initialization
The AuthManager is automatically initialized when you include the script:

```html
<script src="js/auth-manager.js"></script>
```

A global instance `authManager` is created automatically.

### Login Example

```javascript
// Login user
const result = await authManager.login(email, password);

if (result.success) {
    // Login successful
    console.log('Access Token:', authManager.getAccessToken());
    console.log('User Data:', result.data);
    
    // Store additional user info
    localStorage.setItem('userId', result.data.user_id);
    localStorage.setItem('userProfile', JSON.stringify(result.data.profile));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
} else {
    // Login failed
    console.error('Login error:', result.error);
    alert(result.error);
}
```

### Making Authenticated API Requests

The `apiRequest` method automatically:
- Attaches the Authorization header with "TSK" prefix
- Handles token refresh if the access token expires
- Redirects to login if refresh fails

```javascript
// Example: Get user profile
try {
    const response = await authManager.apiRequest('/api/v1/user/profile/', {
        method: 'GET'
    });
    
    const data = await response.json();
    console.log('Profile:', data);
} catch (error) {
    console.error('API Error:', error);
}

// Example: Update profile
try {
    const response = await authManager.apiRequest('/api/v1/user/profile/', {
        method: 'PUT',
        body: JSON.stringify({
            name: 'John Doe',
            phone: '1234567890'
        })
    });
    
    const data = await response.json();
    console.log('Updated Profile:', data);
} catch (error) {
    console.error('Update Error:', error);
}

// Example: Upload file with FormData
const formData = new FormData();
formData.append('resume', fileInput.files[0]);
formData.append('name', 'John Doe');

try {
    const response = await authManager.apiRequest('/api/v1/user/upload-resume/', {
        method: 'POST',
        body: formData  // AuthManager automatically handles FormData
    });
    
    const data = await response.json();
    console.log('Upload Result:', data);
} catch (error) {
    console.error('Upload Error:', error);
}
```

### Change Password

```javascript
const result = await authManager.changePassword('oldPassword123', 'newPassword123');

if (result.success) {
    alert('Password changed successfully!');
} else {
    alert(result.error);
}
```

### Password Reset Flow

```javascript
// Step 1: Request reset code
const requestResult = await authManager.requestPasswordReset('user@example.com');
if (requestResult.success) {
    console.log('Reset code sent to email');
}

// Step 2: Verify code
const verifyResult = await authManager.verifyResetCode('user@example.com', '123456');
if (verifyResult.success) {
    const resetToken = verifyResult.token;
    
    // Step 3: Reset password
    const resetResult = await authManager.resetPassword(resetToken, 'newPassword123');
    if (resetResult.success) {
        console.log('Password reset successful!');
    }
}
```

### Check Authentication Status

```javascript
if (authManager.isAuthenticated()) {
    console.log('User is logged in');
    console.log('Access Token:', authManager.getAccessToken());
} else {
    console.log('User is not logged in');
    window.location.href = 'login.html';
}
```

### Logout

```javascript
// Clear all authentication data and redirect to login
authManager.logout();
```

## Token Storage

Tokens are stored in `localStorage`:
- `access_token`: JWT access token (short-lived)
- `refresh_token`: JWT refresh token (long-lived)
- `userId`: User ID
- `userType`: User type (it-candidate, it-vendor, etc.)
- `userProfile`: User profile data (JSON string)

## Authorization Header Format

All authenticated requests use the custom "TSK" prefix:

```
Authorization: TSK <access_token>
```

Example:
```
Authorization: TSK eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Automatic Token Refresh

The AuthManager automatically refreshes expired access tokens:

1. When an API request returns 401 (Unauthorized)
2. The AuthManager attempts to refresh the access token using the refresh token
3. If refresh succeeds, the original request is retried with the new token
4. If refresh fails, the user is redirected to the login page

## Error Handling

### Login Errors

```javascript
const result = await authManager.login(email, password);

if (!result.success) {
    // Check specific error types
    if (result.status === 401) {
        console.log('Invalid credentials');
    } else if (result.status === 403) {
        console.log('Account not verified or access denied');
    } else if (result.status === 423) {
        console.log('Account locked/suspended');
    } else if (result.networkError) {
        console.log('Network connection error');
    } else {
        console.log('General error:', result.error);
    }
}
```

### API Request Errors

```javascript
try {
    const response = await authManager.apiRequest('/api/v1/endpoint/', {
        method: 'GET'
    });
    
    if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
    } else {
        const data = await response.json();
        console.log('Success:', data);
    }
} catch (error) {
    console.error('Request failed:', error);
}
```

## Integration Checklist

When integrating authentication into a new page:

1. ✅ Include the AuthManager script
```html
<script src="js/auth-manager.js"></script>
```

2. ✅ Check authentication status on protected pages
```javascript
if (!authManager.isAuthenticated()) {
    window.location.href = 'login.html';
}
```

3. ✅ Use `authManager.apiRequest()` for all authenticated API calls

4. ✅ Handle errors appropriately

5. ✅ Provide logout functionality
```javascript
document.getElementById('logoutBtn').addEventListener('click', () => {
    authManager.logout();
});
```

## Example: Protected Dashboard Page

```html
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
</head>
<body>
    <h1>Dashboard</h1>
    <button id="logoutBtn">Logout</button>
    
    <div id="profileData"></div>
    
    <script src="js/auth-manager.js"></script>
    <script>
        // Check authentication
        if (!authManager.isAuthenticated()) {
            window.location.href = 'login.html';
        }
        
        // Load user profile
        async function loadProfile() {
            try {
                const response = await authManager.apiRequest('/api/v1/user/profile/', {
                    method: 'GET'
                });
                
                const profile = await response.json();
                document.getElementById('profileData').textContent = JSON.stringify(profile, null, 2);
            } catch (error) {
                console.error('Failed to load profile:', error);
            }
        }
        
        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            authManager.logout();
        });
        
        // Load profile on page load
        loadProfile();
    </script>
</body>
</html>
```

## Security Best Practices

1. **Never expose tokens in URLs** - Always use headers for authentication
2. **Store tokens securely** - Use localStorage (already implemented)
3. **Clear tokens on logout** - Use `authManager.logout()` or `authManager.clearAuth()`
4. **Validate token expiry** - The AuthManager handles this automatically
5. **Use HTTPS in production** - Ensure all API calls use HTTPS
6. **Implement CSRF protection** - If needed for your backend

## Testing

### Test Login
```javascript
// In browser console
const result = await authManager.login('itcandidate2@test.com', 'Test@1234');
console.log(result);
```

### Test Authenticated Request
```javascript
// In browser console
const response = await authManager.apiRequest('/api/v1/auth/change-password/', {
    method: 'POST',
    body: JSON.stringify({
        old_password: 'Test@1234',
        new_password: 'NewPassword@123'
    })
});
console.log(await response.json());
```

### Check Stored Tokens
```javascript
// In browser console
console.log('Access Token:', localStorage.getItem('access_token'));
console.log('Refresh Token:', localStorage.getItem('refresh_token'));
```

## Troubleshooting

### Issue: "Not authenticated" error
**Solution**: Check if tokens are stored in localStorage. Login again if needed.

### Issue: API requests fail with 401
**Solution**: The AuthManager should automatically refresh the token. If it keeps failing, the refresh token may be expired. Login again.

### Issue: CORS errors
**Solution**: Ensure your backend allows requests from your frontend origin and includes proper CORS headers.

### Issue: "Authorization header missing" error
**Solution**: Ensure you're using `authManager.apiRequest()` instead of plain `fetch()` for authenticated requests.

## Next Steps

1. Update all registration forms to use the new API endpoints
2. Implement profile management with authenticated requests
3. Add job application functionality with JWT authentication
4. Create admin panel with role-based access control
5. Implement email verification flow
