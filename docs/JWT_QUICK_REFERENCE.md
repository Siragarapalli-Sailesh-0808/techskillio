# JWT Authentication - Quick Reference

## 🚀 Quick Start

### Include AuthManager
```html
<script src="js/auth-manager.js"></script>
```

### Login
```javascript
const result = await authManager.login(email, password);
if (result.success) {
    // Success - tokens are automatically stored
    window.location.href = 'dashboard.html';
}
```

### Make Authenticated Request
```javascript
const response = await authManager.apiRequest('/api/v1/endpoint/', {
    method: 'GET'
});
const data = await response.json();
```

### Logout
```javascript
authManager.logout(); // Clears tokens and redirects to login
```

---

## 📋 API Endpoints Reference

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/v1/auth/login/` | POST | ❌ | Login user |
| `/api/v1/auth/token/refresh/` | POST | ❌ | Refresh access token |
| `/api/v1/auth/change-password/` | POST | ✅ | Change password |
| `/api/v1/auth/password-reset/request/` | POST | ❌ | Request reset code |
| `/api/v1/auth/password-reset/verify/` | POST | ❌ | Verify reset code |
| `/api/v1/auth/password-reset/confirm/` | POST | ❌ | Reset password |

---

## 🔑 Authorization Header Format

```
Authorization: TSK <access_token>
```

**Example:**
```
Authorization: TSK eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💾 LocalStorage Keys

| Key | Description |
|-----|-------------|
| `access_token` | JWT access token (short-lived) |
| `refresh_token` | JWT refresh token (long-lived) |
| `userId` | User ID |
| `userType` | User type (it-candidate, etc.) |
| `userProfile` | User profile data (JSON) |

---

## 📝 Common Code Snippets

### Check if User is Logged In
```javascript
if (!authManager.isAuthenticated()) {
    window.location.href = 'login.html';
}
```

### Get Current Access Token
```javascript
const token = authManager.getAccessToken();
```

### Change Password
```javascript
const result = await authManager.changePassword(oldPassword, newPassword);
if (result.success) {
    alert('Password changed!');
}
```

### Password Reset Flow
```javascript
// Step 1: Request code
await authManager.requestPasswordReset(email);

// Step 2: Verify code
const result = await authManager.verifyResetCode(email, code);
const resetToken = result.token;

// Step 3: Reset password
await authManager.resetPassword(resetToken, newPassword);
```

### Upload File with Authentication
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await authManager.apiRequest('/api/v1/upload/', {
    method: 'POST',
    body: formData
});
```

### GET Request
```javascript
const response = await authManager.apiRequest('/api/v1/profile/', {
    method: 'GET'
});
const profile = await response.json();
```

### POST Request with JSON
```javascript
const response = await authManager.apiRequest('/api/v1/update/', {
    method: 'POST',
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com'
    })
});
```

---

## ⚠️ Error Handling

### Login Errors
```javascript
const result = await authManager.login(email, password);

if (!result.success) {
    switch(result.status) {
        case 401:
            alert('Invalid credentials');
            break;
        case 403:
            alert('Account not verified');
            break;
        case 423:
            alert('Account locked');
            break;
        default:
            alert(result.error);
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
    }
} catch (error) {
    console.error('Request failed:', error);
}
```

---

## 🔄 Token Refresh (Automatic)

The AuthManager **automatically** refreshes expired access tokens:

1. API request returns 401 (Unauthorized)
2. AuthManager uses refresh token to get new access token
3. Original request is retried with new token
4. If refresh fails → redirect to login

**You don't need to handle this manually!**

---

## 🛡️ Protected Page Template

```html
<!DOCTYPE html>
<html>
<head>
    <title>Protected Page</title>
</head>
<body>
    <h1>Protected Content</h1>
    <button id="logoutBtn">Logout</button>
    
    <script src="js/auth-manager.js"></script>
    <script>
        // Protect page
        if (!authManager.isAuthenticated()) {
            window.location.href = 'login.html';
        }
        
        // Logout
        document.getElementById('logoutBtn').onclick = () => {
            authManager.logout();
        };
        
        // Load data
        async function loadData() {
            const response = await authManager.apiRequest('/api/v1/data/', {
                method: 'GET'
            });
            const data = await response.json();
            console.log(data);
        }
        
        loadData();
    </script>
</body>
</html>
```

---

## 🧪 Testing in Browser Console

```javascript
// Test login
await authManager.login('test@example.com', 'password123');

// Check tokens
console.log(localStorage.getItem('access_token'));
console.log(localStorage.getItem('refresh_token'));

// Test authenticated request
const response = await authManager.apiRequest('/api/v1/profile/', {
    method: 'GET'
});
console.log(await response.json());

// Logout
authManager.logout();
```

---

## 📞 API Base URL

Current: `http://192.168.1.2:8000`

To change, edit `js/auth-manager.js`:
```javascript
const API_BASE_URL = 'http://your-new-url:port';
```

---

## ✅ Integration Checklist

- [ ] Include `js/auth-manager.js` in your HTML
- [ ] Use `authManager.login()` for login
- [ ] Use `authManager.apiRequest()` for authenticated calls
- [ ] Check `authManager.isAuthenticated()` on protected pages
- [ ] Provide logout button with `authManager.logout()`
- [ ] Handle errors appropriately
- [ ] Test login/logout flow
- [ ] Test token refresh (wait for token to expire)

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Not authenticated" error | Login again - tokens may be expired |
| 401 errors keep happening | Refresh token expired - login again |
| CORS errors | Check backend CORS configuration |
| "Authorization header missing" | Use `authManager.apiRequest()` not `fetch()` |

---

## 📚 Full Documentation

See `docs/JWT_AUTHENTICATION_GUIDE.md` for complete documentation.
