# 📱 Mobile Application Architecture — Moseva

This document outlines the architecture, directory structure, navigation models, local state contexts, and Google OAuth workflows implemented in the **Moseva React Native (Expo) Mobile Client** (`mobile/`).

---

## 🗺️ 1. Technical Framework & Environment

The mobile client is developed using **Expo (v54)** on **React Native (v0.81)**, targeting Android and iOS platforms.

```
+--------------------------------------------------------------+
|                     Navigation Stack                         |
+--------------------------------------------------------------+
|   [LoginScreen] ----> [HomeScreen] ----> [JobDetailsScreen]  |
|         |                   |                   |            |
|   [RegisterScreen]   [PostJobScreen]   [SubmitProposalScreen]|
+--------------------------------------------------------------+
|                   Authentication Context                     |
+--------------------------------------------------------------+
|       [AuthContext.js] <---> Local AsyncStorage Cache        |
+--------------------------------------------------------------+
|                   Network Communication                      |
+--------------------------------------------------------------+
|       [Axios API Client] <---> Live Cloud API Server         |
+--------------------------------------------------------------+
```

---

## 📂 2. Directory Layout & Key Modules

```
mobile/
├── src/
│   ├── context/
│   │   └── AuthContext.js        # Global Authentication state & AsyncStorage cache
│   ├── screens/
│   │   ├── LoginScreen.js        # Form credentials & native Google Sign-In hooks
│   │   ├── RegisterScreen.js     # User registration with Patron/Partner role selection
│   │   ├── HomeScreen.js         # Marketplace explore feed & job lists
│   │   ├── JobDetailsScreen.js   # Single job view with description and proposal details
│   │   ├── PostJobScreen.js      # Patron job listing portal
│   │   └── SubmitProposalScreen.js # Service Partner timeline bidding portal
│   └── services/
│       └── api.js                # Base Axios config pointing to Cloud Run backend
├── package.json
└── App.js                        # App entry point with Stack Navigators
```

---

## 🌐 3. Network Connection & Endpoint Resolution

The mobile client communicates directly with the live GCP Cloud Run backend over HTTPS.
* **Production Gateway API URL**: `https://moseva-backend-98662134377.us-central1.run.app/api/v1`
* **Local Emulator Fallback**: When testing in Android Emulators, the API endpoint resolves to the host's loopback interface `http://10.0.2.2:5001/api/v1` to prevent localhost routing failures.
* **Axios Request Interceptor**: Automatically appends the Bearer token headers:
  ```javascript
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  ```

---

## 🔒 4. Local State Context & Secure Cache

Session states are coordinated through the centralized **AuthContext**:
* **Memory States**: `user` (profile fields), `token` (JWT access token), `isLoading`.
* **AsyncStorage Session Cache**: Session states are cached directly on the physical mobile device storage to allow persistent silent logins:
  * Key `userToken`: Caches active session token.
  * Key `userData`: Caches user profile payload (username, email, role).
* **Automatic Session Handshake**: On app launch, `AuthContext` triggers a `useEffect` to retrieve cache keys, pre-populate default Authorization headers, and bypass the login screen if valid sessions exist.

---

## 🤝 5. Native Google OAuth Integration

Moseva Mobile uses the native **Google Sign-In** client SDK to offer frictionless login.

1. **Client Registration**: Configured with the GCP Web Client ID matching credentials:
   ```javascript
   // src/screens/LoginScreen.js
   GoogleSignin.configure({
     webClientId: '98662134377-p01aj6dk19vr163pmdi0uq9d74hvqm7p.apps.googleusercontent.com',
   });
   ```
2. **Native SDK Launch**: Invoking `GoogleSignin.signIn()` launches standard native Android Google Account pickers.
3. **Payload Token Extraction**: Correctly parses credentials and fallbacks to handle Google API shifts:
   ```javascript
   const idToken = userInfo.idToken || (userInfo.data && userInfo.data.idToken);
   ```
4. **Backend Sync Handshake**: Submits the `idToken` payload directly to the REST API endpoint `/api/v1/auth/google`, receives session cookies, updates context memory, and navigates the user to the main Explore portal.
