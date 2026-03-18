# Credit Pack Payment Initiation – Plan (for approval)

## Goal
Use the **same payment initiation flow** for **Credit Packs** as for **Subscription Plans**: backend creates a Razorpay order → frontend opens Razorpay with `order_id`, `razorpay_key`, and `amount` → user pays → success handling.

---

## Current state

| Flow | Backend call | Razorpay |
|------|----------------|----------|
| **Subscription plans** | `POST /api/v1/finance/buy-plan/initiate/` with `plan_id`, `vendor_type`, `jobs` → returns `order_id`, `amount`, `currency`, `razorpay_key`, `plan` | Opens with backend order; supports status polling. |
| **Credit packs** | None | Opens only if `window.RAZORPAY_KEY` is set; uses pack price × 100 as amount; no `order_id`. |

---

## Backend (to confirm)

We need an endpoint that creates a **Razorpay order for a credit pack** and returns the same shape as the subscription initiate.

**Option A – New endpoint (approved)**  
- **URL:** `POST /api/v1/finance/buy-credits/initiate/`  
- **Body:** `{ "credit_pack_id": <id> }`.  
- **Response (201):** same as buy-plan, e.g.  
  `order_id`, `amount` (rupees or paise), `currency`, `razorpay_key`, and optionally `pack: { id, name, price }`.  
- **Implemented** in `teacher-credit-packs.html`: “Proceed to Payment” calls this endpoint and opens Razorpay with the returned order.

**Option B – Reuse buy-plan endpoint**  
- Same URL: `POST /api/v1/finance/buy-plan/initiate/`.  
- Body includes a type and pack id, e.g. `{ "type": "credit_pack", "credit_pack_id": <id> }` (or `plan_id` if credit packs are stored as plans).  
- Response shape: same as today (order_id, amount, currency, razorpay_key, and plan/pack info).

**Please confirm:**  
- Which option (A or B) and the **exact** path and body field names.  
- Whether you have (or will add) a **payment status** endpoint for credit pack orders (e.g. same `GET .../payments/status/?order_id=...` or a credit-pack-specific one).

---

## Frontend (teacher-credit-packs.html)

1. **“Proceed to Payment” click**
   - Don’t close the modal immediately.
   - Call the backend **credit pack initiate** endpoint (URL/body as per your choice above) with the selected pack id.
   - Use the same **Authorization** header as elsewhere (e.g. `authManager.apiRequest` or fetch with `TSK <token>`).

2. **Response handling**
   - Parse response like subscription: `order_id`, `razorpay_key`, `amount` (convert to paise if backend sends rupees, same rule as subscriptions).
   - If backend fails or returns no order/key: show error message; optionally allow fallback with `window.RAZORPAY_KEY` and pack price (same as current subscription fallback).

3. **Open Razorpay**
   - Use `order_id` from backend when present.
   - Use `razorpay_key` from response (or fallback key).
   - Use `amount` in paise, `currency`, description e.g. `"Credit Pack: {pack name}"`.
   - Prefill name/email/contact if available from auth/profile.

4. **Success handler**
   - Show success message (e.g. “Payment successful. Your credits will be available shortly.”).
   - Close the buy modal.
   - Reload the page or refresh credit balance if you have an API for it.
   - If backend provides a payment/order status endpoint for this order, optionally poll (same pattern as subscription) and then show success.

5. **Error handling**
   - Network/CORS/4xx/5xx: show backend error in alert (same style as subscription).
   - Missing `order_id` or `razorpay_key`: message + optional fallback with `window.RAZORPAY_KEY`.

---

## Summary

| Step | Action |
|------|--------|
| 1 | You confirm backend: endpoint URL, request body, and response shape (and status endpoint if any). |
| 2 | Frontend: On “Proceed to Payment”, call that endpoint with selected `credit_pack_id` (or agreed field). |
| 3 | Frontend: Normalize response (order_id, key, amount in paise), then open Razorpay with same pattern as subscription. |
| 4 | Frontend: On payment success, show message, close modal, reload or refresh; optionally poll status if backend supports it. |

Once you approve this plan and confirm the backend API (path + body + response), the frontend changes can be implemented accordingly.
