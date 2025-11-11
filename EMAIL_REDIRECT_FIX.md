# Fix Email Redirect Issue

## Problem
Email confirmation links redirect to `localhost:3000` instead of your production domain.

## Solution

### In Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**

2. Set **Site URL** to your production domain:
   ```
   https://kyx-engine.vercel.app
   ```

3. Set **Redirect URLs** (add both):
   ```
   https://kyx-engine.vercel.app/**
   http://localhost:3000/**
   ```

4. Click **Save**

### For Email Templates:

1. Go to **Authentication** → **Email Templates**

2. For each template (Confirm signup, Magic Link, Change Email, Reset Password):
   - Find: `{{ .ConfirmationURL }}`
   - Make sure it uses the Site URL setting (it should by default)

3. **Confirm Email Change** template should contain:
   ```html
   <p>Follow this link to confirm the update of your email from {{ .Email }} to {{ .NewEmail }}:</p>
   <p><a href="{{ .ConfirmationURL }}">Change Email Address</a></p>
   ```

## Testing

After configuration:
1. Try changing your email in Settings
2. Check the email you receive
3. The link should now point to `https://kyx-engine.vercel.app` not `localhost`

## Alternative: Handle in Code

If you need more control, you can also set the redirect URL in the code when calling updateUser:

```typescript
const { error } = await supabase.auth.updateUser(
  { email: newEmail },
  { 
    emailRedirectTo: 'https://kyx-engine.vercel.app/settings?email-updated=true' 
  }
);
```

