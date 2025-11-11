# Fix Email Redirect and Email Change Issues

## Problem 1: Email confirmation links redirect to `localhost:3000`
## Problem 2: Email change doesn't actually update credentials

## Solution

### Step 1: Configure URL Settings

Go to **Authentication** → **URL Configuration**:

1. Set **Site URL**:
   ```
   https://kyx-engine.vercel.app
   ```

2. Add **Redirect URLs** (one per line):
   ```
   https://kyx-engine.vercel.app/**
   http://localhost:3000/**
   ```

3. Click **Save**

### Step 2: Enable Email Change

Go to **Authentication** → **Settings**:

1. Scroll to **Email Auth Provider**

2. Make sure these are ENABLED:
   - ✅ **Enable email confirmations** 
   - ✅ **Secure email change** (IMPORTANT!)

3. Set **Confirm email** to: `enabled`

4. Click **Save**

### Step 3: Check Email Templates

Go to **Authentication** → **Email Templates**:

1. Select **Change Email Address** template

2. Verify it contains:
   ```html
   <h2>Confirm email address change</h2>
   <p>Follow this link to confirm the update of your email from {{ .Email }} to {{ .NewEmail }}:</p>
   <p><a href="{{ .ConfirmationURL }}">Change Email Address</a></p>
   ```

3. Make sure **{{ .ConfirmationURL }}** is present (not a custom URL)

4. Click **Save**

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

