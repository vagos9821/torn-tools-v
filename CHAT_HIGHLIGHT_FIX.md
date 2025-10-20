# Chat Highlight vs Colored Chat Fix

## Problem Description
The issue was that when using both "Chat Highlights" and "Colored Chats" features:
- If you set a chat title color for someone named "Will" (making the chat header red)
- The Chat Highlight feature would also highlight every message containing the word "will"
- This created unwanted highlighting of messages based on common words in chat titles

## Root Cause
The Chat Highlight feature was designed to highlight messages in two ways:
1. Outline messages from specific senders
2. Background-highlight messages containing specific words

The problem was that it always did BOTH types of highlighting, so chat title names would trigger word-based highlighting throughout all messages.

## Solution Implemented

### 1. Added Type Field to Highlights
- Modified `globalData.js` to include a `type` field in chat highlights
- Default value is "sender" for backward compatibility
- Possible values: "sender" (sender-only highlighting) or "word" (word-based highlighting)

### 2. Updated Chat Highlight Logic
- Modified `ttChatHighlight.js` to respect the new `type` field
- Word-based highlighting now only occurs when `type === "word"`
- Sender highlighting always works regardless of type
- Added backward compatibility for existing highlights without a type field

### 3. Enhanced Settings UI
- Updated `settings.html` to include a dropdown for highlight type selection
- Modified `settings.js` to handle the new type field in the UI
- Updated save/load functions to preserve the type setting
- Improved help text to explain the difference between sender-only and word-based highlighting

## Files Modified

1. **extension/scripts/global/globalData.js**
   - Added `type: "sender"` to default highlight setting

2. **extension/scripts/features/chat-highlight/ttChatHighlight.js**
   - Updated `readSettings()` to handle type field with backward compatibility
   - Modified `applyV2Highlights()` to only do word highlighting when type === "word"
   - Modified `applyV3Highlights()` to only do word highlighting when type === "word"

3. **extension/pages/settings/settings.html**
   - Added type dropdown to chat highlight input row
   - Updated help text to explain the two modes

4. **extension/pages/settings/settings.js**
   - Updated `addChatHighlightRow()` to accept and create type dropdown
   - Modified loading logic to handle type field with fallback
   - Updated add button handler to include type value
   - Modified save logic to include type field

## Backward Compatibility
- Existing highlights without a `type` field will default to "sender" mode
- This prevents existing word-based highlights from suddenly stopping working
- Users can manually change existing highlights to "word" mode if desired

## Usage Instructions

### For Users Who Want Sender-Only Highlighting (Recommended)
1. Use "Colored Chats" feature for chat title coloring
2. Use "Chat Highlights" with "Sender only" type for highlighting messages from specific people
3. This prevents false positives from common words

### For Users Who Want Word-Based Highlighting
1. Set highlight type to "Word-based" for specific terms you want to highlight in message content
2. Be aware this may cause false positives with common words
3. Consider using less common words or phrases

## Testing Recommendations
1. Test with existing highlights to ensure they work as "sender-only"
2. Test adding new highlights with both "sender-only" and "word-based" types
3. Test that colored chat titles don't interfere with message highlighting
4. Test backward compatibility with saved settings

## Benefits
- Separates chat title coloring from message content highlighting
- Gives users control over when word-based highlighting occurs
- Reduces false positives from common names used as chat titles
- Maintains backward compatibility with existing settings
