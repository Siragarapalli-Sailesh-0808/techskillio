/**
 * Credit packs: GET /api/v1/plans/credit-packs/
 * Buy: POST /api/v1/finance/buy-credits/initiate/ { pack_id }
 * Balance: GET /api/v1/finance/credits/me/ → { balance }
 */
(function () {
    var INITIATE_URL = '/api/v1/finance/buy-credits/initiate/';
    var activePackPayments = {};

    function paymentsAreStopped() {
        return !!window.PAYMENTS_EMERGENCY_STOP;
    }

    function paymentStopMessage() {
        return window.PAYMENTS_EMERGENCY_MESSAGE || 'Payments are temporarily disabled. Please contact support.';
    }

    function setPackButtonState(packId, isLoading) {
        var selector = '[data-buy-pack="' + String(packId).replace(/"/g, '&quot;') + '"]';
        var btn = document.querySelector(selector);
        if (!btn) return;
        btn.disabled = !!isLoading;
        btn.style.opacity = isLoading ? '0.7' : '1';
        btn.style.cursor = isLoading ? 'not-allowed' : 'pointer';
        btn.textContent = isLoading ? 'Processing...' : 'Buy pack';
    }

    function toRazorpayPaise(amount, priceInrHint) {
        var a = Number(amount);
        if (!a || a <= 0) return 0;
        var hint = priceInrHint != null ? Number(priceInrHint) : null;
        if (hint && a >= hint * 50) return Math.round(a);
        if (hint && a <= hint * 2 && hint < 1e7) return Math.round(a * 100);
        if (a >= 100000) return Math.round(a);
        return Math.round(a * 100);
    }

    function normalizePack(p) {
        var id = p.id != null ? p.id : p.pack_id;
        var credits = Number(p.credits != null ? p.credits : (p.credit_count || p.credit_amount || 0));
        var price = Number(p.price_in_inr != null ? p.price_in_inr : (p.price != null ? p.price : (p.amount || p.selling_price || 0)));
        var desc = (p.description || 'Credits for viewing candidate profiles on your job posts.').replace(/</g, '&lt;');
        var active = !p.status || String(p.status).toLowerCase() === 'active';
        return {
            id: id,
            name: (p.name || p.title || 'Credit pack').replace(/</g, '&lt;'),
            credits: credits,
            price: price,
            description: desc,
            recommended: !!(p.is_recommended || p.featured || (p.name || '').toLowerCase().indexOf('popular') !== -1),
            active: active
        };
    }

    function escapeAttr(s) {
        return String(s).replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }

    async function tryFetch(url) {
        if (typeof authManager !== 'undefined') {
            try {
                var res = await authManager.apiRequest(url);
                if (res.ok) return res;
            } catch (e) { /* continue */ }
        }
        try {
            var base = typeof window.API_BASE_URL !== 'undefined' ? window.API_BASE_URL : '';
            return await fetch(base + url, { credentials: 'include' });
        } catch (e) {
            return { ok: false };
        }
    }

    async function loadPacks(container) {
        var fromConfig = typeof window.API_CREDIT_PACKS_URL === 'string' ? window.API_CREDIT_PACKS_URL : '';
        var primary = container.getAttribute('data-endpoint') || fromConfig || '/api/v1/plans/credit-packs/';
        var urls = [primary, fromConfig, '/api/v1/plans/credit-packs/'].filter(function (u, i, a) {
            return u && a.indexOf(u) === i;
        });
        for (var i = 0; i < urls.length; i++) {
            var res = await tryFetch(urls[i]);
            if (!res.ok) continue;
            var data;
            try {
                data = await res.json();
            } catch (e) {
                continue;
            }
            var list = Array.isArray(data) ? data : (data.results || data.data || data.credit_packs || []);
            if (Array.isArray(list) && list.length) {
                return list.map(normalizePack).filter(function (p) {
                    return p.id != null && p.credits > 0 && p.active;
                });
            }
        }
        return [];
    }

    function getDashboardHref() {
        var back = document.getElementById('backToDash');
        if (back && back.getAttribute('href')) return back.getAttribute('href');
        var q = new URLSearchParams(window.location.search || '');
        if (q.get('from') === 'nonteaching') return 'teacher-employer-nonteaching-dashboard.html';
        return 'teacher-employer-dashboard.html';
    }

    function firstNumber(payload, keys) {
        if (!payload || typeof payload !== 'object') return null;
        for (var i = 0; i < keys.length; i++) {
            var n = Number(payload[keys[i]]);
            if (!isNaN(n)) return n;
        }
        return null;
    }

    function setCreditWidget(value, note, isError) {
        var valueEl = document.getElementById('creditBalanceValue');
        var noteEl = document.getElementById('creditBalanceNote');
        var cardEl = document.getElementById('creditBalanceCard');
        if (valueEl) valueEl.textContent = value;
        if (noteEl) noteEl.textContent = note;
        if (cardEl) {
            cardEl.style.borderLeftColor = isError ? '#ef4444' : '#86c540';
        }
    }

    async function getCurrentBalance() {
        try {
            var res = await tryFetch('/api/v1/finance/credits/me/');
            if (!res.ok) return null;
            var data = await res.json().catch(function () { return {}; });
            var root = (data && typeof data === 'object') ? data : {};
            var nested = (root.data && typeof root.data === 'object') ? root.data : root;
            var credits = firstNumber(nested, ['balance', 'credits', 'available_credits', 'credit_balance', 'remaining_credits']);
            if (credits == null) credits = firstNumber(root, ['balance', 'credits', 'available_credits', 'credit_balance', 'remaining_credits']);
            return credits;
        } catch (e) {
            return null;
        }
    }

    async function loadLiveCreditBalance() {
        var credits = await getCurrentBalance();
        if (credits == null) {
            setCreditWidget('--', 'Could not fetch live credits right now.', true);
        } else {
            setCreditWidget(String(credits), 'Updated from your live account balance.', false);
        }
    }

    function renderPacks(container, packs) {
        var fallback = document.getElementById('creditPacksFallback');
        if (!packs.length) {
            container.innerHTML = '';
            if (fallback) fallback.style.display = 'block';
            return;
        }
        if (fallback) fallback.style.display = 'none';

        container.innerHTML = packs.map(function (p, i) {
            var rec = p.recommended || i === Math.floor(packs.length / 2);
            var cardClass = 'plan-card' + (rec ? ' recommended' : '');
            var stop = paymentsAreStopped();
            return (
                '<div class="' + cardClass + '">' +
                '<div class="plan-name">' + p.name + '</div>' +
                '<div class="plan-credits">' + p.credits.toLocaleString() + ' <span>credits</span></div>' +
                '<div class="plan-price">₹' + p.price.toLocaleString() + ' <span>one-time</span></div>' +
                '<p class="plan-description">' + p.description + '</p>' +
                '<ul class="plan-features">' +
                '<li><i class="fas fa-check-circle"></i> Use credits to unlock candidate details</li>' +
                '<li><i class="fas fa-check-circle"></i> Applied to your employer account</li>' +
                '<li><i class="fas fa-check-circle"></i> Secure payment via Razorpay</li>' +
                '</ul>' +
                '<button type="button" class="plan-button" data-buy-pack="' + escapeAttr(String(p.id)) + '" ' +
                'data-pack-name="' + escapeAttr(p.name) + '" data-price="' + p.price + '" data-credits="' + p.credits + '" ' + (stop ? 'disabled aria-disabled="true"' : '') + '>' +
                (stop ? 'Payments Disabled' : 'Buy pack') + '</button>' +
                '</div>'
            );
        }).join('');

        container.querySelectorAll('[data-buy-pack]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (paymentsAreStopped()) {
                    alert(paymentStopMessage());
                    return;
                }
                var id = btn.getAttribute('data-buy-pack');
                var name = btn.getAttribute('data-pack-name');
                var price = Number(btn.getAttribute('data-price'));
                var credits = Number(btn.getAttribute('data-credits'));
                window.buyCreditPack(id, name, price, credits);
            });
        });
    }

    window.buyCreditPack = async function (packId, packName, priceHint, credits) {
        if (paymentsAreStopped()) {
            alert(paymentStopMessage());
            return;
        }

        var lockKey = String(packId);
        if (activePackPayments[lockKey]) {
            return;
        }
        activePackPayments[lockKey] = true;
        setPackButtonState(lockKey, true);

        // Fetch initial balance to track later
        var initialBalance = await getCurrentBalance() || 0;

        if (typeof authManager === 'undefined' || !authManager.getAccessToken()) {
            alert('Please log in as a teacher employer to purchase credits.');
            window.location.href = 'login.html';
            activePackPayments[lockKey] = false;
            setPackButtonState(lockKey, false);
            return;
        }
        if (typeof Razorpay === 'undefined') {
            alert('Payment script could not load. Check your connection and refresh the page.');
            activePackPayments[lockKey] = false;
            setPackButtonState(lockKey, false);
            return;
        }

        var lastErr = '';
        var orderData = null;
        try {
            var res = await authManager.apiRequest(INITIATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pack_id: Number(packId) })
            });
            var data = await res.json().catch(function () { return {}; });
            if ((res.ok || res.status === 201) && data.order_id && data.razorpay_key) {
                orderData = data;
            } else {
                lastErr = data.detail || data.message || ('HTTP ' + res.status);
            }
        } catch (e) {
            lastErr = e.message || String(e);
        }

        if (!orderData) {
            try {
                var res2 = await authManager.apiRequest(INITIATE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credit_pack_id: Number(packId) })
                });
                var d2 = await res2.json().catch(function () { return {}; });
                if ((res2.ok || res2.status === 201) && d2.order_id && d2.razorpay_key) {
                    orderData = d2;
                    lastErr = '';
                } else if (!lastErr) lastErr = d2.detail || d2.message || '';
            } catch (e2) { /* ignore */ }
        }

        if (!orderData) {
            alert(lastErr ? ('Could not start payment: ' + lastErr) : 'Could not start payment. Please try again.');
            activePackPayments[lockKey] = false;
            setPackButtonState(lockKey, false);
            return;
        }

        var packMeta = orderData.pack || {};
        var priceInr = packMeta.price_in_inr != null ? packMeta.price_in_inr : (priceHint != null ? priceHint : orderData.amount);
        var amountPaise = toRazorpayPaise(orderData.amount, priceInr);
        if (!amountPaise || amountPaise < 100) {
            alert('Invalid payment amount from server. Please contact support.');
            activePackPayments[lockKey] = false;
            setPackButtonState(lockKey, false);
            return;
        }

        var redirectHref = getDashboardHref();
        var options = {
            key: orderData.razorpay_key,
            amount: amountPaise,
            currency: orderData.currency || 'INR',
            order_id: orderData.order_id,
            name: 'TechSkillio',
            description: (packMeta.name || packName) + ' — ' + (packMeta.credits || credits) + ' credits',
            handler: function () {
                var btn = document.querySelector('[data-buy-pack="' + escapeAttr(String(packId)) + '"]');
                var originalText = btn ? btn.innerHTML : 'Buy pack';
                if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

                let attempts = 0;
                const maxAttempts = 15;
                const checkInterval = setInterval(async function () {
                    attempts++;
                    try {
                        const res = await authManager.apiRequest('/api/v1/finance/payments/status/?order_id=' + encodeURIComponent(orderData.order_id));
                        if (res.ok) {
                            const data = await res.json();
                            const status = (data.status || data.payment_status || '').toLowerCase();
                            if (status === 'success' || status === 'paid' || status === 'completed' || status === 'captured') {
                                clearInterval(checkInterval);
                                if (btn) {
                                    btn.innerHTML = '<i class="fas fa-check"></i> Payment Successful';
                                    btn.style.background = '#166534';
                                }
                                alert('Payment successful! Your credits have been added.');
                                window.location.reload();
                                return;
                            }
                        }
                    } catch (e) {
                        console.warn('Payment check error', e);
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        if (btn) {
                            btn.innerHTML = 'Processing...';
                            btn.disabled = false;
                        }
                        alert('Your payment was received but activation is taking longer than usual. Please check back in a few minutes.');
                        window.location.reload();
                    }
                }, 3000);
            },
            theme: { color: '#86c540' },
            modal: {
                ondismiss: function () {
                    activePackPayments[lockKey] = false;
                    setPackButtonState(lockKey, false);
                    alert('Payment not completed. You can try again when you\'re ready.');
                }
            },
            prefill: {}
        };

        try {
            if (typeof authManager !== 'undefined' && authManager.getUserProfile) {
                var pr = await authManager.getUserProfile();
                if (pr.success && pr.data) {
                    if (pr.data.user && pr.data.user.email) options.prefill.email = pr.data.user.email;
                    if (pr.data.profile) {
                        options.prefill.name = pr.data.profile.full_name || pr.data.profile.institution_name || 'Employer';
                        options.prefill.contact = String(pr.data.profile.contact_number || (pr.data.user && pr.data.user.phoneNumber) || '').replace(/\D/g, '').slice(0, 15) || '9999999999';
                    }
                }
            }
        } catch (pf) { /* optional */ }

        try {
            new Razorpay(options).open();
        } catch (e) {
            activePackPayments[lockKey] = false;
            setPackButtonState(lockKey, false);
            alert('Could not open Razorpay. Please try again.');
        }
    };

    document.addEventListener('DOMContentLoaded', async function () {
        await loadLiveCreditBalance();
        var el = document.getElementById('creditPacksContainer');
        if (!el) return;
        el.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">Loading credit packs...</p></div>';
        var packs = await loadPacks(el);
        renderPacks(el, packs);
    });
})();
