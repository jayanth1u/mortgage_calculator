async function calculateMortgage() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const period = parseInt(document.getElementById('period').value);

    const resultsDiv = document.getElementById('results');

    // Validation
    if (!principal || !rate || !period) {
        resultsDiv.innerHTML = '<h2>Mortgage Summary</h2><div class="error">Please fill in all fields</div>';
        return;
    }

    if (principal <= 0 || rate < 0 || period <= 0) {
        resultsDiv.innerHTML = '<h2>Mortgage Summary</h2><div class="error">Please enter valid positive numbers</div>';
        return;
    }

    // Show loading
    resultsDiv.innerHTML = '<h2>Mortgage Summary</h2><div class="loading">Calculating...</div>';

    try {
        const response = await fetch('http://localhost:3000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ principal, rate, period })
        });

        if (!response.ok) {
            throw new Error('Calculation failed');
        }

        const data = await response.json();

        resultsDiv.innerHTML = `
            <h2>Mortgage Summary</h2>
            <div class="result-item">
                <span class="result-label">Principal</span>
                <span class="result-value">$${data.principal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Annual Interest Rate</span>
                <span class="result-value">${data.annualInterest.toFixed(4)}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">Period (Months)</span>
                <span class="result-value">${data.periodMonths}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Monthly Payment</span>
                <span class="result-value highlight">$${data.monthlyPayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Payment</span>
                <span class="result-value">$${data.totalPayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Interest</span>
                <span class="result-value">$${data.totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<h2>Mortgage Summary</h2><div class="error">Error calculating mortgage. Make sure the server is running on port 3000.</div>';
        console.error('Error:', error);
    }
}

// Allow Enter key to submit
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateMortgage();
    }
});