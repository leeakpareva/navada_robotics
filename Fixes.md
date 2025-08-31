# Bug Fixes Documentation

This document tracks significant bugs encountered and their resolutions.

---

## Fix #1: OpenAI API Parameter Order Issue

**Date:** August 31, 2025  
**Component:** Agent Lee Chat API (`/app/api/agent-lee/route.ts`)  
**Severity:** Critical - Complete feature failure

### Issue Description
The Agent Lee chat feature was completely non-functional, failing with an OpenAI API error when attempting to retrieve run status after creating a thread and run.

### Error Message
```
OpenAIError: Path parameters result in path with invalid segments:
Value of type Undefined is not a valid path parameter
/threads/undefined/runs/thread_WyhuR9Dfki289npwNzAbmg1z
         ^^^^^^^^^
```

### Root Cause
The OpenAI SDK's `openai.beta.threads.runs.retrieve()` method signature was incorrectly implemented. The code was passing two string parameters directly:
```typescript
// INCORRECT - What we had:
runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id)
```

However, the OpenAI SDK v5.16.0 expects:
- First parameter: `runID` (string)
- Second parameter: An object with `thread_id` property

### Effect
- Complete failure of the Agent Lee chat assistant
- Users could not interact with the AI assistant
- All chat requests resulted in HTTP 500 errors
- Feature was completely unusable

### Solution
Updated the API calls to use the correct parameter format:
```typescript
// CORRECT - Fixed implementation:
runStatus = await openai.beta.threads.runs.retrieve(run.id, { 
  thread_id: currentThreadId 
})
```

This change was applied to both the initial status check and the polling loop.

### Files Modified
- `/app/api/agent-lee/route.ts` (Lines 171-184)

### Testing
After the fix:
- Agent Lee successfully processes chat messages
- Run status is correctly retrieved
- Assistant responses are properly returned to the client
- No more OpenAI API errors

### Lessons Learned
1. **SDK Documentation:** Always verify the exact method signature when using third-party SDKs, especially for beta features
2. **Parameter Types:** Pay attention to whether methods expect direct parameters or configuration objects
3. **Error Messages:** The OpenAI error showed the malformed path structure, which helped identify that parameters were being misinterpreted
4. **Version Awareness:** Different versions of SDKs may have different method signatures - the OpenAI SDK v5 changed from earlier versions

### Prevention
- Add TypeScript strict type checking for API calls
- Create integration tests for external API interactions
- Document SDK version requirements in package.json comments
- Add error handling that logs detailed parameter information for debugging

---

## Future Fixes
Additional bug fixes will be documented here as they occur.