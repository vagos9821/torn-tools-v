// Test script to verify the chat highlight logic
// This would be run in a browser console to test the functionality

// Mock data for testing
const testHighlights = [
    { name: "will", color: "#ff0000", type: "sender" },    // Should only highlight sender, not words
    { name: "test", color: "#00ff00", type: "word" },      // Should highlight both sender and words
    { name: "john", color: "#0000ff", type: "sender" },    // Should only highlight sender
];

// Mock function to test the logic
function testHighlightLogic(highlights, sender, messageText) {
    console.log(`Testing with sender: "${sender}", message: "${messageText}"`);

    const senderLower = sender.toLowerCase();
    const words = messageText.toLowerCase().split(" ");

    let senderHighlighted = false;
    let wordHighlighted = false;

    for (const highlight of highlights) {
        // Check sender highlighting
        if (highlight.name === senderLower || highlight.name === "*") {
            senderHighlighted = true;
            console.log(`  ✓ Sender highlighted by: ${highlight.name} (${highlight.color})`);
        }

        // Check word highlighting (only if type is "word")
        if (highlight.type === "word" && words.includes(highlight.name)) {
            wordHighlighted = true;
            console.log(`  ✓ Word highlighted by: ${highlight.name} (${highlight.color})`);
        } else if (highlight.type !== "word" && words.includes(highlight.name)) {
            console.log(`  - Word "${highlight.name}" found but type is "${highlight.type}", skipping word highlight`);
        }
    }

    console.log(`  Result: Sender=${senderHighlighted}, Word=${wordHighlighted}\n`);
    return { senderHighlighted, wordHighlighted };
}

// Test cases
console.log("=== Chat Highlight Logic Test ===\n");

// Test 1: Will sends a message containing "will" (the issue case)
testHighlightLogic(testHighlights, "Will", "I will go to the store");

// Test 2: Someone else mentions "will" in a message
testHighlightLogic(testHighlights, "Bob", "I think Will will be there");

// Test 3: Word-based highlight should work
testHighlightLogic(testHighlights, "Alice", "This is a test message");

// Test 4: John sends a message (sender highlight only)
testHighlightLogic(testHighlights, "John", "Hello everyone");

// Test 5: Someone mentions "john" in a message (should not highlight)
testHighlightLogic(testHighlights, "Mike", "I saw john at the store");

console.log("=== Expected Results ===");
console.log("Test 1: Sender=true, Word=false (will not highlight word despite containing 'will')");
console.log("Test 2: Sender=false, Word=false (will not highlight word despite containing 'will')");
console.log("Test 3: Sender=false, Word=true (test is word-type highlight)");
console.log("Test 4: Sender=true, Word=false (john is sender-only type)");
console.log("Test 5: Sender=false, Word=false (john is sender-only type)");
