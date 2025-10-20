# Fix for "Maximum cycles reached" Error in User Alias Feature

## Problem
The `ttUserAlias.js` feature was causing a "Maximum cycles reached" error because it was trying to wait for a specific chat element `#chatRoot [class*='chat-note-button__']` that might not exist on certain pages or might have changed in the chat interface.

## Root Cause
1. The feature was waiting for a very specific selector that might not be available
2. No timeout or error handling for unavailable elements
3. Missing the `is2FACheckPage()` check that other chat features have

## Solution Applied

### 1. Updated Element Requirement
**Before:**
```javascript
await requireElement("#chatRoot [class*='chat-note-button__']");
```

**After:**
```javascript
await requireChatsLoaded();
```

**Benefits:**
- Uses the standard `requireChatsLoaded()` function that other chat features use
- More reliable selector that checks for `#chatRoot [class*='chat-list-button__'], #notes_settings_button`
- Consistent with other chat-related features

### 2. Added Page Restriction
**Before:**
```javascript
(async () => {
	const feature = featureManager.registerFeature(
```

**After:**
```javascript
(async () => {
	if (is2FACheckPage()) return;

	const feature = featureManager.registerFeature(
```

**Benefits:**
- Prevents the feature from running on inappropriate pages (like 2FA pages)
- Consistent with other chat features like `ttChatHighlight.js`
- Reduces unnecessary feature initialization

## Files Modified
- `extension/scripts/features/user-alias/ttUserAlias.js`

## Expected Results
- No more "Maximum cycles reached" errors
- Feature only runs on appropriate pages
- More robust chat element detection
- Consistent behavior with other TornTools chat features

## Testing Recommendations
1. Test on pages with chat available
2. Test on pages without chat (should not cause errors)
3. Test on 2FA pages (feature should not initialize)
4. Verify user alias functionality still works correctly when chat is available
