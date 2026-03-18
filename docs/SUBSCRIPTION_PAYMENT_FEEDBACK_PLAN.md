# Subscription payment – success/failure messages and redirect (plan)

## What you’re seeing

- After a successful payment you get no clear message and no redirect to My Subscriptions.
- When payment is not completed or fails, there’s no “Payment not done, try again” message.

---

## Where the fault is

### 1. Success path – no redirect, possible missing message

**File:** `js/plan-selection-modal.js`  
**Location:** Razorpay `handler` and polling success branch (around lines 488–493).

- On success the code does **`window.location.reload()`**, so the user stays on the **same page** (e.g. subscription plans or dashboard). It does **not** navigate to My Subscriptions.
- The success **alert** is there (`Payment Successful! Your ... subscription is now active.`), but:
  - If the **status API** never returns a success (e.g. different response shape, or backend not updated yet), the code keeps polling and may hit the **timeout** message instead, so the user never sees “Payment successful”.
- So: **fault** = no redirect to My Subscriptions; success message can be missed if polling never sees success.

### 2. User closes Razorpay without paying – no message

**File:** `js/plan-selection-modal.js`  
**Location:** Razorpay `options.modal.ondismiss` (around lines 526–529).

- When the user closes the Razorpay checkout without paying, only **`ondismiss`** runs and it just does **`console.log('Payment cancelled by user')`**.
- No **alert** or other user-visible message, so the user doesn’t see “Payment not done. Try again.”  
- **Fault** = no user feedback on cancel/dismiss.

### 3. Backend returns “failed” – no clear feedback

- If the status API returns a failed state (e.g. `failed`, `cancelled`, `payment_failed`), the code keeps **polling** until timeout.
- There’s no branch that shows “Payment not done. Try again.” and stops polling.  
- **Fault** = no handling of failed status and no clear failure message.

---

## Redirect URL to use

- **Teacher:** `teacher-my-subscriptions.html` and, if the current page URL has `from=nonteaching`, add `?from=nonteaching`.
- **IT vendor:** `my-subscriptions.html`.

We already have **`jobCategory`** in `submitForm()` (`'teacher'` vs `'it'`), so the redirect URL can be computed there.

---

## Plan (for your approval)

### 1. Success: message + redirect to My Subscriptions

- **When:** Razorpay handler runs and either:
  - We’re in fallback mode (no `order_id`), or  
  - Polling gets a success status (`success`, `captured`, `completed`, `active`).
- **Do:**
  1. Show **alert:** `"Payment successful! Your subscription is now active."`
  2. Close the “Complete Your Subscription” modal.
  3. **Redirect** to My Subscriptions:
     - If teacher: `teacher-my-subscriptions.html` or `teacher-my-subscriptions.html?from=nonteaching` (if current URL has `from=nonteaching`).
     - If IT: `my-subscriptions.html`.
- **Implementation:** Replace `window.location.reload()` in the success path with setting `window.location.href` to the correct My Subscriptions URL. Keep the alert before redirect so the user sees the message.

### 2. User cancels / closes Razorpay (payment not done)

- **When:** Razorpay calls **`modal.ondismiss`** (user closed checkout without completing payment).
- **Do:**
  1. Show **alert:** `"Payment not done. Try again."`
  2. Optionally close the “Complete Your Subscription” modal so the user is back on the plan list (current behaviour can stay: modal stays open so they can click “Proceed to Payment” again).
- **Implementation:** In `options.modal.ondismiss`, add an `alert('Payment not done. Try again.');` (and optionally call `planSelectionModal.close()`).

### 3. Payment failed (backend says failed)

- **When:** Status API returns a status that means failure (e.g. `failed`, `cancelled`, `payment_failed`, `expired`).
- **Do:**
  1. **Stop** polling.
  2. Show **alert:** `"Payment not done. Try again."`
  3. Close the modal.
- **Implementation:** In the polling callback, after reading `statusData.status`, if it’s one of the failure values, don’t schedule the next poll; show the alert and close the modal.

### 4. Polling timeout (still processing)

- **When:** Polling runs for all attempts (e.g. 10 or 100) and never gets success or failed.
- **Do:** Keep the existing message (e.g. “Payment processing is taking longer than expected. Please check your My Subscriptions page in a few minutes.”) and **optionally** redirect to My Subscriptions so the user can check there.
- **Implementation:** In the timeout branch, optionally set `window.location.href` to the same My Subscriptions URL as in (1).

### 5. Error in handler (e.g. network during polling)

- **When:** The `catch` in the handler runs (e.g. polling request throws).
- **Do:** Keep showing an error message; optionally also redirect to My Subscriptions so the user can verify.
- **Implementation:** No change required to the message; optionally add redirect to My Subscriptions in the catch block.

---

## Summary

| Scenario              | Current behaviour                         | After fix                                                    |
|-----------------------|-------------------------------------------|--------------------------------------------------------------|
| Payment success       | Alert + reload same page                  | Alert + redirect to My Subscriptions (teacher or IT)         |
| User closes Razorpay   | Only console log                          | Alert: “Payment not done. Try again.”                        |
| Backend says failed   | Keeps polling until timeout               | Stop polling, alert “Payment not done. Try again.”, close modal |
| Polling timeout       | Alert “taking longer…”                    | Same + optional redirect to My Subscriptions                 |

---

## Files to change

- **`js/plan-selection-modal.js`**  
  - Add a small helper to get “My Subscriptions” URL from `jobCategory` and `window.location.search`.  
  - In success path: show alert, close modal, then `window.location.href = mySubscriptionsUrl`.  
  - In `modal.ondismiss`: show `"Payment not done. Try again."` (and optionally close modal).  
  - In polling: treat failed statuses as above; on timeout optionally redirect to My Subscriptions.

If you approve this plan, the next step is to implement these changes in `plan-selection-modal.js` only.
