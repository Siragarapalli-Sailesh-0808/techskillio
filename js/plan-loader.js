/**
 * PlanLoader - Fetches and renders subscription plans
 */
class PlanLoader {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.apiEndpoint = this.container ? (this.container.getAttribute('data-endpoint') || '/api/v1/plans/teacher/') : '/api/v1/plans/teacher/';
    }

    async init() {
        if (!this.container) {
            console.error('Plan container not found');
            return;
        }

        this.renderLoading();
        await this.fetchAndRenderPlans();
    }

    renderLoading() {
        this.container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">Loading plans...</p></div>';
    }

    async fetchAndRenderPlans() {
        try {
            // Use authManager if available
            let response;
            if (typeof authManager !== 'undefined') {
                try {
                    response = await authManager.apiRequest(this.apiEndpoint);
                } catch (e) {
                    console.log('Auth request failed, trying public access for plans', e);
                    response = await fetch(`${window.API_BASE_URL}${this.apiEndpoint}`);
                }
            } else {
                response = await fetch(`${window.API_BASE_URL}${this.apiEndpoint}`);
            }

            if (response.ok) {
                const data = await response.json();
                let plans = Array.isArray(data) ? data : (data.results || data.data || []);
                plans = (plans || []).filter(p => !p.status || String(p.status).toLowerCase() === 'active');
                this.renderPlans(plans);
            } else {
                this.renderError('Failed to load plans.');
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
            this.renderError('Unable to load plans. Please try again later.');
        }
    }

    renderError(message) {
        this.container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 20px;"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
    }

    renderPlans(plans) {
        if (!plans || plans.length === 0) {
            this.container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;"><i class="fas fa-inbox fa-2x"></i><p style="margin-top:10px;">No subscription plans available at the moment.</p></div>';
            return;
        }

        this.container.innerHTML = plans.map(plan => this.createPlanCard(plan)).join('');
    }

    createPlanCard(plan) {
        const name = (plan.name || 'Plan').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const price = Number(plan.price) || 0;
        const validityDays = plan.validity_days != null ? plan.validity_days : 30;
        const candidateLimit = plan.candidate_limit != null ? plan.candidate_limit : 1;
        const isFeatured = (plan.name || '').toLowerCase().includes('gold') || (plan.name || '').toLowerCase().includes('featured') || plan.is_recommended;
        const cardClass = `plan-card ${isFeatured ? 'featured' : ''}`;
        
        const badge = isFeatured ? '<span class="plan-badge">MOST POPULAR</span>' : '';
        
        let featuresHtml = `<li>Access to ${candidateLimit} candidate profiles</li>`;
        featuresHtml += `<li>${validityDays} days validity</li>`;
        featuresHtml += `<li>${plan.is_interview_allowed_for_employer ? 'Employer Interviews Allowed' : 'TechSkillio Screening'}</li>`;
        featuresHtml += `<li>Direct contact information</li>`;
        featuresHtml += `<li>Email & Phone support</li>`;

        return `
            <div class="${cardClass}">
                ${badge}
                <div class="plan-name">${(plan.name || 'Plan').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                <div class="plan-price">₹${price.toLocaleString()} <span>/ ${validityDays} days</span></div>
                <p class="plan-description">${(plan.description || 'Comprehensive hiring solution.').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                <ul class="plan-features">
                    ${featuresHtml}
                </ul>
                <button class="btn-select-plan" onclick="handlePlanSelection(${plan.id}, '${name}', ${price}, ${candidateLimit})">Select Plan</button>
            </div>
        `;
    }
}

// Global handler for plan selection
function handlePlanSelection(planId, planName, price, candidateLimit = 1) {
    if (typeof planSelectionModal !== 'undefined') {
        // Use existing global instance
        planSelectionModal.open({ id: planId, name: planName, price: price, candidate_limit: candidateLimit });
    } else if (typeof PlanSelectionModal !== 'undefined') {
        // Fallback: create instance, but ideally this shouldn't happen if loaded correctly
        console.warn('Using fallback PlanSelectionModal instantiation');
        const modal = new PlanSelectionModal();
        modal.open({ id: planId, name: planName, price: price, candidate_limit: candidateLimit });
    } else {
        console.error('PlanSelectionModal not loaded');
        alert('Payment system is initializing. Please wait or reload.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Look for container with specific ID
    if (document.getElementById('plansContainer')) {
        const loader = new PlanLoader('plansContainer');
        loader.init();
    }
});
