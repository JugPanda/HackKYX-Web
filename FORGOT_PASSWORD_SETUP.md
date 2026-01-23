# Forgot Password Feature Setup Guide

## Overview

The forgot password feature has been implemented using Supabase's built-in password reset functionality. Users can now reset their passwords via email.

## Features

✅ **Forgot Password Page** - Users can request a password reset link
✅ **Email-based Reset** - Secure reset links sent via email
✅ **Reset Password Page** - Users can set a new password using the link
✅ **Session Validation** - Ensures reset links are valid and not expired
✅ **Password Confirmation** - Requires users to confirm their new password
✅ **Password Strength** - Enforces minimum 6 character password
✅ **Auto Sign-out** - Signs out user after successful reset for security
✅ **User-friendly Messages** - Clear success/error feedback at every step

## User Flow

1. **Request Reset**
   - User clicks "Forgot password?" on sign-in page
   - User enters their email address
   - User receives email with reset link

2. **Reset Password**
   - User clicks the link in their email
   - Link redirects to `/auth/reset-password` with a secure token
   - User enters and confirms new password
   - System updates password and signs out user
   - User is redirected to sign-in page

## Technical Implementation

### Pages Created

- `/app/auth/forgot-password/page.tsx` - Request reset page
- `/app/auth/reset-password/page.tsx` - Reset password page

### Components Created

- `/components/auth/forgot-password-form.tsx` - Request reset form
- `/components/auth/reset-password-form.tsx` - Reset password form

### Updated Files

- `/components/auth/sign-in-form.tsx` - Added "Forgot password?" link
- `/components/auth/index.ts` - Exported new components

## Supabase Configuration

### Email Templates (IMPORTANT)

To properly configure the password reset emails in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select **Reset Password** template
4. Use this template:

```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

5. The `{{ .ConfirmationURL }}` will automatically redirect to `/auth/reset-password`

### Site URL Configuration

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Set your **Site URL** to your production domain:
   - Production: `https://your-domain.com`
   - Development: `http://localhost:3000`

3. Add **Redirect URLs** (under Additional Redirect URLs):
   - Production: `https://your-domain.com/auth/reset-password`
   - Development: `http://localhost:3000/auth/reset-password`

### Email Provider

Make sure you have configured an email provider in Supabase:

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Configure your SMTP provider (SendGrid, Mailgun, etc.)
3. Or use Supabase's built-in email service (limited for free tier)

## Testing the Feature

### Local Testing

1. Start your development server:
   ```bash
   cd landing-page
   npm run dev
   ```

2. Navigate to http://localhost:3000/auth/sign-in
3. Click "Forgot password?"
4. Enter a test email address
5. Check your email for the reset link
6. Click the link and set a new password

### Testing Checklist

- [ ] Request reset email from forgot password page
- [ ] Receive email with reset link
- [ ] Click reset link (should redirect to reset password page)
- [ ] Enter new password (test password validation)
- [ ] Confirm new password (test mismatch error)
- [ ] Submit reset form
- [ ] Verify auto-redirect to sign-in page
- [ ] Sign in with new password
- [ ] Test expired/invalid reset link handling

## Security Features

1. **Token Expiration** - Reset links expire after 1 hour (Supabase default)
2. **One-time Use** - Reset tokens can only be used once
3. **Session Validation** - Validates user has valid session from reset link
4. **Password Requirements** - Enforces minimum 6 characters
5. **Auto Sign-out** - Signs out user after reset for security

## Error Handling

The implementation handles these error scenarios:

- Invalid/expired reset link
- Supabase not configured
- Email not found in database
- Network errors during API calls
- Password mismatch during confirmation
- Password too short

## Environment Variables Required

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## User Experience

### Desktop Flow
```
Sign In Page
    ↓ (Click "Forgot password?")
Forgot Password Page
    ↓ (Enter email → Receive email)
Email Client
    ↓ (Click reset link)
Reset Password Page
    ↓ (Enter new password)
Sign In Page (with success message)
```

### Mobile-Friendly
- All forms are responsive
- Works seamlessly on mobile devices
- Email links open in mobile browsers

## Troubleshooting

### Emails Not Sending

1. Check Supabase email provider configuration
2. Verify SMTP settings are correct
3. Check spam folder
4. Ensure redirect URLs are whitelisted in Supabase

### Reset Link Not Working

1. Verify Site URL in Supabase matches your domain
2. Check redirect URLs are configured
3. Ensure link hasn't expired (1 hour default)
4. Check browser console for errors

### Password Reset Fails

1. Verify session is valid (check browser console)
2. Ensure password meets requirements (6+ characters)
3. Check Supabase service status
4. Verify API keys are correct

## Additional Notes

- The reset token is automatically included in the URL by Supabase
- Users are automatically signed out after password reset
- The feature works with Supabase's RLS (Row Level Security)
- All forms include loading states and error messages
- The implementation follows Next.js 14 App Router patterns

## Future Enhancements

Potential improvements for the future:

- [ ] Add rate limiting to prevent abuse
- [ ] Implement CAPTCHA on forgot password form
- [ ] Add password strength indicator
- [ ] Store password reset history
- [ ] Send confirmation email after password change
- [ ] Add 2FA support for additional security
- [ ] Implement account lockout after multiple failed attempts

## Support

For issues or questions:
- Check Supabase Auth documentation
- Review browser console errors
- Verify environment variables are set
- Test in incognito mode to rule out cache issues
