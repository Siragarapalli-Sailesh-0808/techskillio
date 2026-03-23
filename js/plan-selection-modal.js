/**
 * PlanSelectionModal - Handles job details collection for subscription plans
 */
class PlanSelectionModal {
    constructor() {
        this.selectedPlan = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        // Inject modal HTML if not already present
        if (!document.getElementById('planSelectionModal')) {
            const modalHTML = `
                <div id="planSelectionModal" class="modal-overlay" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Complete Your Subscription</h2>
                            <button class="close-modal" onclick="planSelectionModal.close()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="plan-summary-bar">
                                <span id="modalPlanName" style="font-weight: 700; color: #86c540;"></span>
                                <span id="modalPlanPrice" style="float: right; font-weight: 600;"></span>
                            </div>
                            
                            <form id="planSelectionForm">
                                <div id="dynamicJobsContainer"></div>

                                <button type="submit" class="btn-save" style="margin-top: 20px;">
                                    Proceed to Payment <i class="fas fa-arrow-right"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <style>
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.6);
                        backdrop-filter: blur(4px);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 100000;
                        animation: fadeIn 0.2s ease-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { 
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .modal-content {
                        background: white;
                        border-radius: 16px;
                        width: 90%;
                        max-width: 650px;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                        animation: slideUp 0.3s ease-out;
                    }
                    .modal-header {
                        padding: 24px 28px;
                        border-bottom: 2px solid #f1f5f9;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                    }
                    .modal-header h2 {
                        margin: 0;
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #1e293b;
                    }
                    .close-modal {
                        background: #f1f5f9;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #64748b;
                        width: 36px;
                        height: 36px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                    }
                    .close-modal:hover {
                        background: #e2e8f0;
                        color: #334155;
                    }
                    .modal-body {
                        padding: 28px;
                    }
                    .plan-summary-bar {
                        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                        padding: 16px 20px;
                        border-radius: 12px;
                        margin-bottom: 28px;
                        border: 2px solid #86c540;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .plan-summary-bar span:first-child {
                        font-weight: 700;
                        color: #15803d;
                        font-size: 1.1rem;
                    }
                    .plan-summary-bar span:last-child {
                        font-weight: 700;
                        color: #15803d;
                        font-size: 1.25rem;
                    }
                    .form-group {
                        margin-bottom: 20px;
                    }
                    .form-group label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: 600;
                        color: #334155;
                        font-size: 0.95rem;
                    }
                    .form-group input,
                    .form-group select,
                    .form-group textarea {
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 10px;
                        font-size: 0.95rem;
                        transition: all 0.2s;
                        font-family: inherit;
                    }
                    .form-group input:focus,
                    .form-group select:focus,
                    .form-group textarea:focus {
                        outline: none;
                        border-color: #86c540;
                        box-shadow: 0 0 0 3px rgba(134, 197, 64, 0.1);
                    }
                    .form-group small {
                        display: block;
                        margin-top: 6px;
                        color: #64748b;
                        font-size: 0.85rem;
                    }
                    .form-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                        margin-bottom: 20px;
                    }
                    .btn-save {
                        background: linear-gradient(135deg, #86c540 0%, #6e9443 100%);
                        color: white;
                        padding: 14px 32px;
                        border-radius: 10px;
                        border: none;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                        box-shadow: 0 4px 12px rgba(134, 197, 64, 0.3);
                    }
                    .btn-save:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(134, 197, 64, 0.4);
                    }
                    .btn-save:active {
                        transform: translateY(0);
                    }
                    @media (max-width: 600px) {
                        .modal-content {
                            width: 95%;
                            border-radius: 12px;
                        }
                        .modal-header {
                            padding: 20px;
                        }
                        .modal-body {
                            padding: 20px;
                        }
                        .form-row {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Bind form submission
            document.getElementById('planSelectionForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }
    }

    open(planData) {
        this.selectedPlan = planData;
        document.getElementById('modalPlanName').textContent = `Selected Plan: ${planData.name}`;
        document.getElementById('modalPlanPrice').textContent = `₹${planData.price.toLocaleString()}`;

        // Auto-detect category from user type
        const userType = localStorage.getItem('userType') || sessionStorage.getItem('userType') || 'teacher_employer';
        const isTeacher = userType.includes('teacher') || userType.includes('school');
        const category = isTeacher ? 'teacher' : 'it';

        // Store for submitForm
        this.currentCategory = category;

        // Teacher recruiters: no job form, only plan summary + Proceed to Payment. IT: full job fields.
        if (isTeacher) {
            const container = document.getElementById('dynamicJobsContainer');
            if (container) container.innerHTML = '<p style="color:#64748b;margin:0 0 20px 0;font-size:0.95rem;">Proceed to payment to activate your subscription. You can assign candidates from My Subscriptions after purchase.</p>';
        } else {
            this.renderJobFields(planData.candidate_limit || 1);
        }

        document.getElementById('planSelectionModal').style.display = 'flex';
    }

    renderJobFields(limit) {
        const container = document.getElementById('dynamicJobsContainer');
        container.innerHTML = ''; // Clear previous

        const userType = localStorage.getItem('userType') || sessionStorage.getItem('userType') || 'teacher_employer';
        const isTeacher = userType.includes('teacher') || userType.includes('school');
        const category = isTeacher ? 'teacher' : 'it'; // also determines teacher vs it fields
        this.currentCategory = category;

        for (let i = 0; i < limit; i++) {
            const index = i + 1;
            const jobHtml = `
                <div class="job-entry" style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 20px; position: relative;">
                    <div style="position: absolute; top: -12px; left: 20px; background: white; padding: 0 10px; font-weight: 700; color: #86c540;">
                        Job/Candidate Profile #${index}
                    </div>
                    
                    <div class="form-group">
                        <label>Job Title *</label>
                        <input type="text" name="title_${index}" required placeholder="e.g. Senior ${category === 'teacher' ? 'Teacher' : 'Developer'}">
                    </div>

                    <div class="form-group">
                        <label>Job Description *</label>
                        <textarea name="description_${index}" required placeholder="Describe the role responsibilities..." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; min-height: 100px;"></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Location *</label>
                            <input type="text" name="location_${index}" required placeholder="e.g. Hyderabad">
                        </div>
                        <div class="form-group">
                            <label>Employment Type *</label>
                            <select name="employment_type_${index}" required>
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                                <option value="contract">Contract</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Work Mode *</label>
                            <select name="work_mode_${index}" required>
                                <option value="onsite">On-site</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Experience (Years)</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="number" name="experience_min_years_${index}" placeholder="Min" min="0" style="width: 50%;">
                                <input type="number" name="experience_max_years_${index}" placeholder="Max" min="0" style="width: 50%;">
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Annual Salary (CTC)</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="number" name="salary_min_${index}" placeholder="Min" min="0" style="width: 50%;">
                            <input type="number" name="salary_max_${index}" placeholder="Max" min="0" style="width: 50%;">
                        </div>
                    </div>

                    ${category === 'teacher' ? `
                    <div class="form-group">
                        <label>Subjects Required *</label>
                        <input type="text" name="subjects_required_${index}" required placeholder="e.g. Mathematics, Physics (comma separated)">
                        <small style="color: #666;">Separate multiple subjects with commas</small>
                    </div>` : `
                    <div class="form-group">
                        <label>Skills Required *</label>
                        <input type="text" name="skills_required_${index}" required placeholder="e.g. Python, Django, AWS (comma separated)">
                        <small style="color: #666;">Separate multiple skills with commas</small>
                    </div>`}
                </div>
            `;
            container.insertAdjacentHTML('beforeend', jobHtml);
        }

        document.getElementById('planSelectionModal').style.display = 'flex';
    }

    close() {
        document.getElementById('planSelectionModal').style.display = 'none';
        document.getElementById('planSelectionForm').reset();
        this.selectedPlan = null;
        this.currentCategory = null;
    }

    /** My Subscriptions URL after successful payment */
    getMySubscriptionsUrl() {
        const jobCategory = this.currentCategory || 'teacher';
        const isTeacher = jobCategory === 'teacher';
        const q = new URLSearchParams(window.location.search || '');
        const fromNt = q.get('from') === 'nonteaching' ? '?from=nonteaching' : '';
        if (isTeacher) return 'teacher-my-subscriptions.html' + fromNt;
        return 'my-subscriptions.html';
    }

    static toRazorpayPaise(amount, planPriceInrHint) {
        const a = Number(amount);
        if (!a || a <= 0) return 0;
        const hint = planPriceInrHint != null ? Number(planPriceInrHint) : null;
        if (hint && a >= hint * 50) return Math.round(a);
        if (hint && a <= hint * 2 && hint < 1e7) return Math.round(a * 100);
        if (a >= 100000) return Math.round(a);
        return Math.round(a * 100);
    }

    async submitForm() {
        if (this.isSubmitting) return;
        this.isSubmitting = true;

        const btn = document.querySelector('#planSelectionForm .btn-save');
        const originalBtnText = btn ? btn.innerHTML : 'Proceed to Payment';
        if (btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            btn.disabled = true;
        }

        const jobCategory = this.currentCategory || 'teacher';
        const isTeacher = jobCategory === 'teacher';
        let jobs = [];

        if (!isTeacher) {
            const formData = new FormData(document.getElementById('planSelectionForm'));
            const limit = this.selectedPlan.candidate_limit || 1;
            for (let i = 0; i < limit; i++) {
                const index = i + 1;
                const jobData = {
                    job_category: jobCategory,
                    is_teaching_job: false,
                    title: formData.get(`title_${index}`),
                    description: formData.get(`description_${index}`),
                    location: formData.get(`location_${index}`),
                    employment_type: formData.get(`employment_type_${index}`),
                    work_mode: formData.get(`work_mode_${index}`),
                    experience_min_years: formData.get(`experience_min_years_${index}`) ? parseInt(formData.get(`experience_min_years_${index}`)) : null,
                    experience_max_years: formData.get(`experience_max_years_${index}`) ? parseInt(formData.get(`experience_max_years_${index}`)) : null,
                    salary_min: formData.get(`salary_min_${index}`) ? parseInt(formData.get(`salary_min_${index}`)) : null,
                    salary_max: formData.get(`salary_max_${index}`) ? parseInt(formData.get(`salary_max_${index}`)) : null,
                    status: 'active',
                    plan_id: this.selectedPlan.id
                };
                const skills = formData.get(`skills_required_${index}`);
                jobData.skills_required = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
                jobs.push(jobData);
            }
            console.log('--- Jobs Data ---');
            console.log(JSON.stringify(jobs, null, 2));
        }

        try {
            // Step 1: Create order on backend
            const vendorType = jobCategory === 'teacher' ? 'teacher' : 'it';

            if (typeof authManager === 'undefined') {
                throw new Error('AuthManager not initialized. Please refresh the page.');
            }

            // Track initial active subscriptions count before proceeding
            let initialActiveSubsCount = 0;
            try {
                const countRes = await authManager.apiRequest('/api/v1/plans/my-subscriptions/');
                if (countRes.ok) {
                    const countData = await countRes.json();
                    const subsArray = Array.isArray(countData) ? countData : (countData.results || []);
                    initialActiveSubsCount = subsArray.filter(s => s.status === 'active').length;
                }
            } catch (countErr) {
                console.warn('Could not fetch initial subs count', countErr);
            }

            const initiateBody = JSON.stringify({
                plan_id: this.selectedPlan.id,
                vendor_type: vendorType,
                jobs: jobs
            });
            const initiateUrls = [
                '/api/v1/finance/buy-plan/initiate/',
                '/api/v1/plans/buy-plan/initiate/'
            ];
            let orderData = null;
            let lastInitErr = '';
            for (const url of initiateUrls) {
                const r = await authManager.apiRequest(url, {
                    method: 'POST',
                    body: initiateBody
                });
                const d = await r.json().catch(() => ({}));
                if (r.ok && d.order_id && d.razorpay_key) {
                    orderData = d;
                    break;
                }
                lastInitErr = d.detail || d.message || `HTTP ${r.status}`;
            }

            if (!orderData || !orderData.order_id || !orderData.razorpay_key) {
                throw new Error(lastInitErr || 'Server did not return order_id or razorpay_key.');
            }

            if (typeof Razorpay === 'undefined') {
                throw new Error('Razorpay script not loaded. Refresh the page and try again.');
            }

            const planName = (orderData.plan && orderData.plan.name) || this.selectedPlan.name || 'Your';
            const planPriceHint = this.selectedPlan.price != null ? this.selectedPlan.price : (orderData.plan && orderData.plan.price);
            const amountPaise = PlanSelectionModal.toRazorpayPaise(orderData.amount, planPriceHint);
            if (!amountPaise || amountPaise < 100) {
                throw new Error('Invalid payment amount from server.');
            }

            const subsUrl = planSelectionModal.getMySubscriptionsUrl();

            const options = {
                key: orderData.razorpay_key,
                amount: amountPaise,
                currency: orderData.currency || 'INR',
                order_id: orderData.order_id,
                name: 'TechSkillio',
                description: `${planName} Subscription`,
                handler: function () {
                    const btn = document.querySelector('#planSelectionForm .btn-save');
                    const originalBtnText = btn ? btn.innerHTML : 'Proceed to Payment';
                    if (btn) {
                        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
                        btn.disabled = true;
                    }
                    let attempts = 0;
                    const maxAttempts = 15;
                    const checkInterval = setInterval(async () => {
                        attempts++;
                        try {
                            // Using the explicit Payment Status endpoint specified by backend
                            const res = await authManager.apiRequest(`/api/v1/finance/payments/status/?order_id=${orderData.order_id}`);
                            if (res.ok) {
                                const data = await res.json();
                                // Assuming 'status' is 'paid', 'success', 'captured', or 'completed'
                                const status = (data.status || data.payment_status || '').toLowerCase();
                                if (status === 'success' || status === 'paid' || status === 'completed' || status === 'captured') {
                                    clearInterval(checkInterval);
                                    if (btn) {
                                        btn.innerHTML = '<i class="fas fa-check"></i> Activated Successfully';
                                        btn.style.background = '#166534';
                                    }
                                    alert('Payment successful! Your plan is now active.');
                                    window.location.reload();
                                    return;
                                }
                            }
                        } catch (e) {
                            console.warn('Payment check error:', e);
                        }

                        if (attempts >= maxAttempts) {
                            clearInterval(checkInterval);
                            if (btn) {
                                btn.innerHTML = 'Payment Received. Processing...';
                                btn.disabled = false;
                            }
                            alert('Your payment was received but activation is taking longer than usual. Please check back in a few minutes.');
                            window.location.reload();
                        }
                    }, 3000); // 3 seconds * 15 = 45 seconds polling
                },
                prefill: {
                    name: 'TechSkillio User',
                    email: localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
                },
                theme: { color: '#86c540' },
                modal: {
                    ondismiss: () => {
                        this.isSubmitting = false;
                        if (btn) {
                            btn.innerHTML = originalBtnText;
                            btn.disabled = false;
                        }
                        if (window.confirm('Are you sure you want to cancel the payment?')) {
                            // User cancelled intentionally
                        }
                    }
                }
            };

            // Try to prefill user details if authManager is available
            if (typeof authManager !== 'undefined') {
                try {
                    const res = await authManager.getUserProfile();
                    if (res.success && res.data) {
                        if (res.data.user && res.data.user.email) {
                            options.prefill.email = res.data.user.email;
                        }
                        if (res.data.profile) {
                            options.prefill.name = res.data.profile.full_name || res.data.profile.institution_name || "TechSkillio User";
                            options.prefill.contact = res.data.profile.contact_number || res.data.user.phoneNumber || "9999999999";
                        }
                    }
                } catch (err) {
                    console.log('Auth check failed for prefill, using defaults', err);
                }
            }

            // Open Razorpay checkout
            const rzp1 = new Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error('Error creating order:', error);
            alert(error.message ? ('Failed to initiate payment: ' + error.message) : 'Failed to initiate payment. Please try again.');
        }
    }
}

// Create global instance
const planSelectionModal = new PlanSelectionModal();
