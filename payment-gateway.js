// Payment Gateway Service
// This is a static implementation that simulates payment processing
// In production, this would integrate with a payment gateway (Razorpay, PayU, Paytm, etc.)

class PaymentGateway {
    constructor() {
        this.paymentHistory = [];
        this.initModal();
    }

    /**
     * Initialize payment modal HTML
     */
    initModal() {
        const modalHTML = `
            <div id="paymentModalOverlay" class="payment-modal-overlay">
                <div class="payment-modal">
                    <div class="payment-modal-header">
                        <h2>Complete Your Payment</h2>
                        <button class="close-modal" onclick="closePaymentModal()">&times;</button>
                    </div>
                    
                    <div class="payment-modal-body">
                        <!-- Plan Summary -->
                        <div class="plan-summary">
                            <h3>Plan Summary</h3>
                            <div class="summary-row">
                                <span>Plan:</span>
                                <strong id="modalPlanName"></strong>
                            </div>
                            <div class="summary-row">
                                <span>Profiles:</span>
                                <strong id="modalProfiles"></strong>
                            </div>
                            <div class="summary-row">
                                <span>Amount:</span>
                                <strong id="modalAmount" class="amount-highlight"></strong>
                            </div>
                        </div>

                        <!-- Payment Method Selection -->
                        <div class="payment-methods">
                            <h3>Select Payment Method</h3>
                            <div class="method-options">
                                <label class="method-option">
                                    <input type="radio" name="paymentMethod" value="card" checked>
                                    <div class="method-card">
                                        <i class="fas fa-credit-card"></i>
                                        <span>Credit/Debit Card</span>
                                    </div>
                                </label>
                                <label class="method-option">
                                    <input type="radio" name="paymentMethod" value="upi">
                                    <div class="method-card">
                                        <i class="fas fa-mobile-alt"></i>
                                        <span>UPI</span>
                                    </div>
                                </label>
                                <label class="method-option">
                                    <input type="radio" name="paymentMethod" value="netbanking">
                                    <div class="method-card">
                                        <i class="fas fa-university"></i>
                                        <span>Net Banking</span>
                                    </div>
                                </label>
                                <label class="method-option">
                                    <input type="radio" name="paymentMethod" value="wallet">
                                    <div class="method-card">
                                        <i class="fas fa-wallet"></i>
                                        <span>Wallet</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Card Payment Form -->
                        <div id="cardPaymentForm" class="payment-form">
                            <h3>Card Details</h3>
                            <div class="form-group">
                                <label>Card Number</label>
                                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Expiry Date</label>
                                    <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5">
                                </div>
                                <div class="form-group">
                                    <label>CVV</label>
                                    <input type="password" id="cvv" placeholder="123" maxlength="3">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Cardholder Name</label>
                                <input type="text" id="cardholderName" placeholder="Name on card">
                            </div>
                        </div>

                        <!-- UPI Payment Form -->
                        <div id="upiPaymentForm" class="payment-form" style="display: none;">
                            <h3>UPI Details</h3>
                            <div class="form-group">
                                <label>UPI ID</label>
                                <input type="text" id="upiId" placeholder="yourname@upi">
                            </div>
                        </div>

                        <!-- Net Banking Form -->
                        <div id="netbankingPaymentForm" class="payment-form" style="display: none;">
                            <h3>Select Your Bank</h3>
                            <div class="form-group">
                                <select id="bankSelect">
                                    <option value="">Select Bank</option>
                                    <option value="sbi">State Bank of India</option>
                                    <option value="hdfc">HDFC Bank</option>
                                    <option value="icici">ICICI Bank</option>
                                    <option value="axis">Axis Bank</option>
                                    <option value="kotak">Kotak Mahindra Bank</option>
                                    <option value="pnb">Punjab National Bank</option>
                                </select>
                            </div>
                        </div>

                        <!-- Wallet Form -->
                        <div id="walletPaymentForm" class="payment-form" style="display: none;">
                            <h3>Select Wallet</h3>
                            <div class="form-group">
                                <select id="walletSelect">
                                    <option value="">Select Wallet</option>
                                    <option value="paytm">Paytm</option>
                                    <option value="phonepe">PhonePe</option>
                                    <option value="googlepay">Google Pay</option>
                                    <option value="amazonpay">Amazon Pay</option>
                                </select>
                            </div>
                        </div>

                        <!-- Payment Button -->
                        <button class="pay-button" onclick="processPayment()">
                            <i class="fas fa-lock"></i> Pay Securely
                        </button>

                        <div class="security-note">
                            <i class="fas fa-shield-alt"></i>
                            Your payment information is encrypted and secure
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .payment-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .payment-modal {
                    background: white;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .payment-modal-header {
                    background: linear-gradient(135deg, #86c540, #6e9443);
                    color: white;
                    padding: 1.5rem 2rem;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .payment-modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .close-modal {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    line-height: 1;
                }

                .payment-modal-body {
                    padding: 2rem;
                }

                .plan-summary {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .plan-summary h3 {
                    margin: 0 0 1rem 0;
                    color: #2c3e50;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .summary-row:last-child {
                    border-bottom: none;
                }

                .amount-highlight {
                    color: #86c540;
                    font-size: 1.5rem;
                }

                .payment-methods h3 {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                }

                .method-options {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .method-option {
                    cursor: pointer;
                }

                .method-option input[type="radio"] {
                    display: none;
                }

                .method-card {
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 1.5rem;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .method-card i {
                    font-size: 2rem;
                    color: #64748b;
                    margin-bottom: 0.5rem;
                }

                .method-card span {
                    display: block;
                    color: #2c3e50;
                    font-weight: 600;
                }

                .method-option input[type="radio"]:checked + .method-card {
                    border-color: #86c540;
                    background: #f0fdf4;
                }

                .method-option input[type="radio"]:checked + .method-card i {
                    color: #86c540;
                }

                .payment-form {
                    margin: 2rem 0;
                }

                .payment-form h3 {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #2c3e50;
                    font-weight: 600;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1rem;
                }

                .pay-button {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, #86c540, #6e9443);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .pay-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(134, 197, 64, 0.3);
                }

                .security-note {
                    text-align: center;
                    color: #64748b;
                    margin-top: 1rem;
                    font-size: 0.9rem;
                }

                .security-note i {
                    color: #86c540;
                    margin-right: 0.5rem;
                }

                @media (max-width: 768px) {
                    .method-options {
                        grid-template-columns: 1fr;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        // Inject modal HTML into the page
        const modalContainer = document.getElementById('paymentModal');
        if (modalContainer) {
            modalContainer.innerHTML = modalHTML;
        }

        // Setup payment method switching
        this.setupPaymentMethodSwitching();
    }

    /**
     * Setup payment method switching
     */
    setupPaymentMethodSwitching() {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'paymentMethod') {
                // Hide all forms
                document.querySelectorAll('.payment-form').forEach(form => {
                    form.style.display = 'none';
                });

                // Show selected form
                const method = e.target.value;
                const formId = method + 'PaymentForm';
                const form = document.getElementById(formId);
                if (form) {
                    form.style.display = 'block';
                }
            }
        });
    }

    /**
     * Show payment modal with plan details
     */
    showModal(planData) {
        const modal = document.getElementById('paymentModalOverlay');
        if (!modal) return;

        // Populate plan details
        document.getElementById('modalPlanName').textContent = planData.name;
        document.getElementById('modalProfiles').textContent = planData.profiles + ' Profiles';
        document.getElementById('modalAmount').textContent = '₹' + planData.amount.toLocaleString();

        // Store plan data for payment processing
        this.currentPlan = planData;

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close payment modal
     */
    closeModal() {
        const modal = document.getElementById('paymentModalOverlay');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Process payment (static implementation)
     */
    async processPayment() {
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        // Validate based on payment method
        let isValid = false;
        
        if (method === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardholderName = document.getElementById('cardholderName').value;
            
            isValid = cardNumber && expiryDate && cvv && cardholderName;
            
            if (!isValid) {
                alert('Please fill in all card details');
                return;
            }
        } else if (method === 'upi') {
            const upiId = document.getElementById('upiId').value;
            isValid = upiId && upiId.includes('@');
            
            if (!isValid) {
                alert('Please enter a valid UPI ID');
                return;
            }
        } else if (method === 'netbanking') {
            const bank = document.getElementById('bankSelect').value;
            isValid = bank !== '';
            
            if (!isValid) {
                alert('Please select a bank');
                return;
            }
        } else if (method === 'wallet') {
            const wallet = document.getElementById('walletSelect').value;
            isValid = wallet !== '';
            
            if (!isValid) {
                alert('Please select a wallet');
                return;
            }
        }

        // Simulate payment processing
        const payButton = document.querySelector('.pay-button');
        payButton.disabled = true;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate payment record
        const payment = {
            id: this.generatePaymentId(),
            planName: this.currentPlan.name,
            amount: this.currentPlan.amount,
            profiles: this.currentPlan.profiles,
            method: method,
            status: 'success',
            timestamp: new Date().toISOString(),
            transactionId: this.generateTransactionId()
        };

        // Store payment
        this.paymentHistory.push(payment);
        this.savePaymentToLocalStorage(payment);

        // Log payment
        console.log('💳 PAYMENT SUCCESSFUL:', payment);

        // Close modal
        this.closeModal();

        // Show success message
        this.showSuccessMessage(payment);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
            window.location.href = 'teacher-employer-dashboard.html';
        }, 3000);
    }

    /**
     * Show payment success message
     */
    showSuccessMessage(payment) {
        const successHTML = `
            <div class="payment-success-overlay">
                <div class="payment-success-card">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>Your subscription has been activated</p>
                    <div class="payment-details">
                        <div class="detail-row">
                            <span>Transaction ID:</span>
                            <strong>${payment.transactionId}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Plan:</span>
                            <strong>${payment.planName}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Amount Paid:</span>
                            <strong>₹${payment.amount.toLocaleString()}</strong>
                        </div>
                    </div>
                    <p class="redirect-note">Redirecting to dashboard...</p>
                </div>
            </div>
            <style>
                .payment-success-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 20000;
                    animation: fadeIn 0.3s ease;
                }
                .payment-success-card {
                    background: white;
                    border-radius: 20px;
                    padding: 3rem;
                    text-align: center;
                    max-width: 500px;
                    animation: slideUp 0.5s ease;
                }
                .success-icon {
                    font-size: 5rem;
                    color: #86c540;
                    margin-bottom: 1rem;
                }
                .payment-success-card h2 {
                    color: #2c3e50;
                    margin-bottom: 0.5rem;
                }
                .payment-details {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin: 2rem 0;
                    text-align: left;
                }
                .payment-details .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .payment-details .detail-row:last-child {
                    border-bottom: none;
                }
                .redirect-note {
                    color: #64748b;
                    font-style: italic;
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', successHTML);
    }

    // Helper methods
    generatePaymentId() {
        return 'PAY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateTransactionId() {
        return 'TXN' + Date.now().toString().substr(-10);
    }

    savePaymentToLocalStorage(payment) {
        try {
            const payments = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
            payments.push(payment);
            localStorage.setItem('paymentHistory', JSON.stringify(payments));
        } catch (error) {
            console.error('Failed to save payment:', error);
        }
    }

    getPaymentHistory() {
        try {
            return JSON.parse(localStorage.getItem('paymentHistory') || '[]');
        } catch (error) {
            console.error('Failed to retrieve payment history:', error);
            return [];
        }
    }
}

// Create global instance
const paymentGateway = new PaymentGateway();

// Global functions for use in HTML
function showPaymentModal(planData) {
    paymentGateway.showModal(planData);
}

function closePaymentModal() {
    paymentGateway.closeModal();
}

function processPayment() {
    paymentGateway.processPayment();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentGateway;
}
