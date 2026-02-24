# HackKYX-Web Security & Code Audit Report

**Date:** 2025-02-24  
**Auditor:** Automated Code Review  
**Scope:** `/root/clawd/HackKYX-Web/landing-page`

---

## 📋 Executive Summary

The HackKYX-Web codebase is a Next.js 14 application with Supabase backend for a game creation platform. While the codebase shows good practices in many areas (Zod validation, content filtering, RLS policies), there are **critical security vulnerabilities** that require immediate attention.

### Key Findings Summary

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 3 | Unauthenticated API endpoints, debug route exposing data |
| 🟡 Medium | 8 | Missing rate limits, input validation gaps, console.logs |
| 🟢 Low | 6 | Code quality, minor UX issues |

---

## 🔴 Critical Issues

### 1. Debug Route Exposes All Game Data Without Authentication
**File:** `app/api/debug/game/[gameId]/route.ts:1-42`
**Severity:** 🔴 Critical

The debug endpoint uses the **service role key** and has **NO authentication**. Anyone can access any game's data including storage files.

```typescript
// PROBLEM: No auth check, uses service role key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export async function GET(request: NextRequest, { params }: { params: { gameId: string } }) {
  // No authentication check - anyone can call this!
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
```

**Impact:** Full read access to all games, storage paths, and metadata.

**Recommendation:** 
- Delete this route entirely or add admin-only authentication
- Never expose service role key operations without strict access control

---

### 2. AI Generation Endpoints Missing Authentication
**Files:** 
- `app/api/generate-game-code/route.ts:1-199`
- `app/api/generate-sprite/route.ts:1-80`
- `app/api/generate-config/route.ts:1-115`

**Severity:** 🔴 Critical

These endpoints call OpenAI APIs **without any authentication**. This allows:
- Unauthorized users to drain your OpenAI credits
- Potential abuse for free AI generation

```typescript
// app/api/generate-game-code/route.ts - NO AUTH CHECK
export async function POST(request: Request) {
  const openai = getOpenAIClient();
  // Directly processes request without checking user authentication
  const body: GameGenerationRequest = await request.json();
```

```typescript
// app/api/generate-sprite/route.ts - NO AUTH CHECK  
export async function POST(request: NextRequest) {
  const openai = getOpenAIClient();
  // Uses DALL-E 3 without authentication - expensive API calls!
```

**Impact:** 
- Financial exposure from unauthorized OpenAI API usage
- DALL-E 3 calls are particularly expensive (~$0.04-0.08 per image)

**Recommendation:**
Add authentication to all AI endpoints:
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

### 3. Rate Limiting Is In-Memory Only (Ineffective in Serverless)
**File:** `lib/rate-limit.ts:1-58`
**Severity:** 🔴 Critical

```typescript
const rateLimitMap = new Map<string, RateLimitEntry>();
```

In-memory rate limiting **does not work** in serverless environments like Vercel:
- Each request may hit a different instance
- Rate limit state is lost between cold starts
- Effectively provides **zero protection**

**Impact:** All rate limits (builds, game creation, comments, reports) are effectively disabled.

**Recommendation:** 
- Use Vercel KV or Upstash Redis for rate limiting
- Or use Supabase's rate limiting table (already have `rate_limits` migration)

---

## 🟡 Medium Issues

### 4. Missing Input Validation on gameId in Multiple Routes
**Files:**
- `app/api/games/like/route.ts:18` - No UUID validation
- `app/api/games/publish/route.ts:19` - No UUID validation

**Severity:** 🟡 Medium

```typescript
// app/api/games/like/route.ts
const { gameId } = await request.json();
if (!gameId) { /* only checks existence, not format */ }
```

**Recommendation:** Use the existing `gameIdSchema` from `lib/validation.ts`:
```typescript
import { gameIdSchema } from "@/lib/validation";
const validation = gameIdSchema.safeParse(gameId);
if (!validation.success) {
  return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
}
```

---

### 5. Reports Endpoint Doesn't Validate targetId Format
**File:** `app/api/reports/create/route.ts:25-52`
**Severity:** 🟡 Medium

```typescript
const { targetType, targetId, reason } = await request.json();
// targetId is used directly without UUID validation
reportData.reported_user_id = targetId; // Could be any string
```

**Recommendation:** Add UUID validation for targetId based on targetType.

---

### 6. Admin Reports Page Buttons Non-Functional
**File:** `app/admin/reports/page.tsx:64-72`
**Severity:** 🟡 Medium

```typescript
<Button size="sm" variant="default">Review</Button>
<Button size="sm" variant="outline">Dismiss</Button>
<Button size="sm" variant="default">Take Action</Button>
// These buttons have no onClick handlers!
```

**Impact:** Admin moderation workflow is incomplete.

---

### 7. Console.log Statements Should Be Removed
**Severity:** 🟡 Medium

**Files with console.logs that should be removed:**
- `app/api/webhooks/stripe/route.ts:80,111,133,155,160` - Logs subscription info
- `app/api/generate-config/route.ts:40,105`
- `app/api/generate-game-code/route.ts:48-51,177`
- `app/api/play/[...path]/route.ts:32,85,98,104,180`
- `app/api/games/generate-async/route.ts:46,90,125,142`
- `app/dashboard/page.tsx:93` - Logs all user games to console!

**Recommendation:** Use a proper logging service or remove for production.

---

### 8. Delete Route Rate Limiting Missing
**File:** `app/api/games/delete/route.ts`
**Severity:** 🟡 Medium

No rate limiting on delete operations. A malicious user could rapidly delete all their games or spam deletion requests.

---

### 9. Comments Create Uses Raw JSON Without Full Schema Validation
**File:** `app/api/comments/create/route.ts:25-27`
**Severity:** 🟡 Medium

```typescript
const { gameId, content } = await request.json();
// gameId not validated as UUID
```

---

### 10. Build Queue Doesn't Verify Game Ownership on GET
**File:** `app/api/games/build/route.ts:161-175`
**Severity:** 🟡 Medium

```typescript
// GET endpoint doesn't verify user owns the game
const { data: buildJob } = await supabase
  .from("build_queue")
  .select("...")
  .eq("game_id", gameId)
  // Missing: .eq("user_id", user.id)
```

Users can see build status of other users' games.

---

### 11. Missing Rate Limits on AI Endpoints
**Files:** `app/api/generate-game-code/route.ts`, `app/api/generate-sprite/route.ts`, `app/api/generate-config/route.ts`
**Severity:** 🟡 Medium

Even after adding authentication, these expensive AI endpoints need rate limiting.

---

## 🟢 Low Issues

### 12. TypeScript @ts-expect-error Usage
**File:** `app/api/webhooks/stripe/route.ts:66`
**Severity:** 🟢 Low

```typescript
// @ts-expect-error - Stripe API version mismatch for current_period_end
const periodEnd = subscription.current_period_end;
```

**Recommendation:** Update Stripe types or properly type the subscription object.

---

### 13. Settings Page Email Verification UX
**File:** `app/settings/page.tsx:46-68`
**Severity:** 🟢 Low

Email verification flow could be confusing - relies on URL parameters and multiple session refreshes.

---

### 14. Game Card Actions Has Unused Variables
**File:** `components/game-card-actions.tsx:15`
**Severity:** 🟢 Low

```typescript
// const [isResetting, setIsResetting] = useState(false); // Unused - for future feature
```

Commented out code should be removed.

---

### 15. Loading States Could Be More Informative
**Files:** `app/dashboard/page.tsx`, `app/settings/page.tsx`
**Severity:** 🟢 Low

```typescript
if (loading) {
  return <div>Loading...</div>; // Generic loading message
}
```

**Recommendation:** Use skeleton loaders or more descriptive loading states.

---

### 16. Missing alt Text for Some Images
**File:** `app/lab/page.tsx` (sprite previews)
**Severity:** 🟢 Low

While there's alt text on sprite previews, the content is generic:
```typescript
<img src={playerSpritePreview} alt="Player preview" />
```

---

### 17. Content Filter Is Basic
**File:** `lib/content-filter.ts`
**Severity:** 🟢 Low

The blocked words list is minimal. Consider integrating a proper profanity filter service for production.

---

## ✅ Positive Findings

The codebase does many things well:

1. **Zod Validation** - Good use of Zod schemas in most routes (`lib/validation.ts`, `lib/schemas.ts`)
2. **Supabase RLS** - Row Level Security policies are properly configured
3. **Content Filtering** - Basic but functional content sanitization
4. **Ownership Verification** - Most routes verify game/comment ownership
5. **Stripe Webhook Verification** - Proper signature verification
6. **Safe JSON Parsing** - `safeJsonParse` utility with size limits
7. **Error Sanitization** - `sanitizeErrorMessage` prevents path leakage
8. **Subscription Limits** - Good subscription tier enforcement

---

## 🔧 Recommended Actions

### Immediate (This Week)
1. 🔴 **DELETE or secure** `app/api/debug/game/[gameId]/route.ts`
2. 🔴 **Add authentication** to all AI generation endpoints
3. 🔴 **Implement Redis-based rate limiting** (Upstash or Vercel KV)

### Short-term (This Month)
4. 🟡 Add UUID validation to `like`, `publish`, `reports` routes
5. 🟡 Implement admin action handlers
6. 🟡 Remove console.log statements
7. 🟡 Add rate limiting to delete endpoint
8. 🟡 Fix build status endpoint to verify ownership

### Long-term
9. 🟢 Implement proper logging service
10. 🟢 Enhance content filtering
11. 🟢 Add skeleton loaders for better UX
12. 🟢 Clean up unused code

---

## 📊 Database Schema Notes

The schema (`supabase-schema.sql`) is well-designed with:
- ✅ Proper foreign key relationships with CASCADE deletes
- ✅ CHECK constraints for status and visibility enums
- ✅ Appropriate indexes on frequently queried columns
- ✅ RLS policies for all tables
- ✅ Triggers for like counts and timestamps

**Note:** The `rate_limits` table mentioned in migrations should be used instead of in-memory rate limiting.

---

## 📁 Files Reviewed

- All API routes in `app/api/`
- All pages in `app/`
- Core library files in `lib/`
- UI components in `components/`
- Database schema files
- Middleware configuration

---

*Report generated by automated code audit. Manual verification recommended for critical issues.*
