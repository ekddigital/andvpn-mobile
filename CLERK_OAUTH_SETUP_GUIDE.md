# Clerk OAuth Setup Guide for AndVPN Mobile

This guide covers how to set up OAuth providers (Google, Apple, Microsoft) in Clerk for your AndVPN mobile application.

## 🔍 Understanding Clerk's OAuth System

### Development vs Production Credentials

**✅ Development/Testing Phase:**

- Clerk provides **shared OAuth credentials** automatically
- No configuration needed - just enable the providers
- Perfect for development, testing, and initial deployment
- Limited to reasonable usage for development purposes

**⚠️ Production Phase:**

- **Must provide your own OAuth credentials**
- Required for production apps with high user volumes
- Gives you full control and removes shared limits
- Your app name appears in OAuth dialogs
- Required for App Store/Play Store submissions

## 📋 Quick Setup (Development Phase)

### Step 1: Enable Native API Access

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=native-applications)
2. Navigate to **Configure > Native applications**
3. **Enable Native API access**
4. This fixes the "Native API disabled" error in mobile apps

### Step 2: Configure OAuth Providers (Development)

For each provider you want to enable:

#### Google OAuth

1. Check ✅ **"Enable for sign-up and sign-in"**
2. Leave ❌ **"Use custom credentials" UNCHECKED**
3. Don't fill in any credential fields
4. Save changes

#### Apple OAuth

1. Check ✅ **"Enable for sign-up and sign-in"**
2. Leave ❌ **"Use custom credentials" UNCHECKED**
3. Don't fill in any credential fields
4. Save changes

#### Microsoft OAuth

1. Check ✅ **"Enable for sign-up and sign-in"**
2. Leave ❌ **"Use custom credentials" UNCHECKED**
3. Don't fill in any credential fields
4. Save changes

### Step 3: Test Your Mobile App

Your app will immediately support:

- ✅ Email/password authentication
- ✅ Google Sign-In (shared credentials)
- ✅ Apple Sign-In (shared credentials)
- ✅ Microsoft Sign-In (shared credentials)

## 🚀 Production Setup (When Ready to Launch)

### When You Need Custom Credentials

Set up custom OAuth credentials when you:

- Are ready for production launch
- Need more than the shared usage limits
- Want your app name in OAuth dialogs
- Are submitting to App Store/Play Store
- Need specific OAuth scopes/permissions

### Google OAuth Setup

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/
   - Create new project or select existing one

2. **Enable Google+ API**

   - Go to APIs & Services > Library
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**

   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `https://clerk.vpn.andgroupco.com/v1/oauth_callback`

4. **Copy Credentials to Clerk**
   - Client ID → Clerk Dashboard
   - Client Secret → Clerk Dashboard
   - Check "Use custom credentials"

### Apple OAuth Setup

1. **Apple Developer Portal**

   - Visit: https://developer.apple.com/account/
   - Sign in with your Apple Developer account

2. **Create App ID**

   - Certificates, Identifiers & Profiles > Identifiers
   - Create new App ID for your mobile app
   - Enable "Sign In with Apple" capability

3. **Create Services ID**

   - Create new Services ID (for web authentication)
   - Configure domains: `vpn.andgroupco.com`
   - Return URLs: `https://clerk.vpn.andgroupco.com/v1/oauth_callback`

4. **Generate Private Key**

   - Keys > Create new key
   - Enable "Sign In with Apple"
   - Download the .p8 key file

5. **Configure in Clerk**
   - Apple Services ID → Client ID field
   - Private Key content → Apple Private Key field
   - Team ID → Apple Team ID field
   - Key ID → Apple Key ID field

### Microsoft OAuth Setup

1. **Azure Portal**

   - Visit: https://portal.azure.com/
   - Go to Azure Active Directory > App registrations

2. **Register Application**

   - Click "New registration"
   - Name: "AndVPN Mobile"
   - Redirect URI: `https://clerk.vpn.andgroupco.com/v1/oauth_callback`

3. **Configure Authentication**

   - Authentication > Platform configurations
   - Add "Mobile and desktop applications"
   - Add custom redirect URIs if needed

4. **Create Client Secret**

   - Certificates & secrets > New client secret
   - Copy the secret value immediately

5. **Copy to Clerk**
   - Application (client) ID → Client ID field
   - Client secret value → Client Secret field

## 🛠️ AndVPN Mobile App Configuration

### Current Setup

Your mobile app is already configured with:

```typescript
// .env file
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsudnBuLmFuZGdyb3VwY28uY29tJA
EXPO_PUBLIC_API_BASE_URL=https://vpn.andgroupco.com/api
EXPO_PUBLIC_WEB_APP_URL=https://vpn.andgroupco.com
```

### ClerkProvider Configuration

```typescript
<ClerkProvider
  publishableKey={AUTH_CONFIG.clerkPublishableKey}
  tokenCache={tokenCache}
  signInFallbackRedirectUrl={AUTH_CONFIG.afterSignInUrl}
  signUpFallbackRedirectUrl={AUTH_CONFIG.afterSignUpUrl}
>
```

## 🔧 Troubleshooting

### Common Issues

**"Native API is disabled" Error:**

- Solution: Enable Native API in Clerk Dashboard > Configure > Native applications

**OAuth provider not showing in mobile:**

- Check that "Enable for sign-up and sign-in" is checked
- For development, ensure "Use custom credentials" is UNCHECKED
- Restart your mobile app after changes

**Authentication tokens not working:**

- Verify you're using the production publishable key (`pk_live_...`)
- Check that your web API and mobile app use the same Clerk instance
- Ensure CORS is configured on your backend API

**Custom credentials not working:**

- Double-check all credential fields are correctly copied
- Ensure redirect URIs exactly match: `https://clerk.vpn.andgroupco.com/v1/oauth_callback`
- Verify OAuth applications are properly configured in each provider's console

## 📱 Mobile-Specific Considerations

### iOS (Apple Sign-In)

- Apple requires Apple Sign-In if you offer other social logins
- Configure Apple Sign-In capability in Xcode
- Test on physical devices (doesn't work in simulator)

### Android (Google Sign-In)

- Add SHA-1 certificate fingerprints to Google Cloud Console
- Configure OAuth consent screen
- Test with release builds for production behavior

### Cross-Platform

- Email/password authentication works universally
- Web-based OAuth flows work on both platforms
- Consider implementing platform-specific UI/UX

## 🚦 Deployment Checklist

### Before Production Launch

- [ ] Set up custom OAuth credentials for all enabled providers
- [ ] Test authentication flows on both iOS and Android
- [ ] Verify API endpoints work with production tokens
- [ ] Configure OAuth consent screens with your branding
- [ ] Test with real user accounts (not test accounts)
- [ ] Set up proper error handling for OAuth failures
- [ ] Configure analytics/monitoring for authentication events

### Post-Launch Monitoring

- [ ] Monitor OAuth success/failure rates
- [ ] Track user preferences for authentication methods
- [ ] Monitor for any authentication-related crashes
- [ ] Keep OAuth credentials secure and rotate as needed

## 📞 Support Resources

- **Clerk Documentation**: https://clerk.com/docs
- **Clerk Community**: https://discord.gg/clerk
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Apple Sign-In**: https://developer.apple.com/sign-in-with-apple/
- **Microsoft Identity**: https://docs.microsoft.com/en-us/azure/active-directory/develop/

## 🔄 Maintenance

### Regular Tasks

- Review OAuth provider terms of service updates
- Rotate client secrets periodically (recommended annually)
- Monitor usage quotas and limits
- Update redirect URIs if domain changes
- Test authentication flows after any provider updates

---

**Created**: September 5, 2025  
**Last Updated**: September 5, 2025  
**Version**: 1.0  
**Project**: AndVPN Mobile App
