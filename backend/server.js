// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mortgage calculation endpoint
app.post('/calculate', (req, res) => {
    try {
        const { principal, rate, period } = req.body;

        // Validation
        if (principal === undefined || rate === undefined || period === undefined) {
            return res.status(400).json({ 
                error: 'Missing required fields: principal, rate, and period are required' 
            });
        }

        if (principal <= 0 || rate < 0 || period <= 0) {
            return res.status(400).json({ 
                error: 'Invalid values: principal and period must be positive, rate must be non-negative' 
            });
        }

        // Convert to proper types
        const principalAmount = parseFloat(principal);
        const interestRate = parseFloat(rate);
        const periodYears = parseInt(period);

        // Calculate monthly rate and total months
        const monthlyRate = interestRate / 100 / 12;
        const months = periodYears * 12;

        let monthlyPayment;

        // Handle zero interest rate case
        if (monthlyRate === 0.0) {
            monthlyPayment = principalAmount / months;
        } else {
            // Standard mortgage formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
            const pow = Math.pow(1 + monthlyRate, months);
            monthlyPayment = principalAmount * monthlyRate * pow / (pow - 1);
        }

        // Calculate totals
        const totalPayment = monthlyPayment * months;
        const totalInterest = totalPayment - principalAmount;

        // Send response
        res.json({
            principal: principalAmount,
            annualInterest: interestRate,
            periodMonths: months,
            monthlyPayment: monthlyPayment,
            totalPayment: totalPayment,
            totalInterest: totalInterest
        });

    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({ 
            error: 'Internal server error during calculation' 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Mortgage Calculator API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Mortgage Calculator API',
        endpoints: {
            'POST /calculate': 'Calculate mortgage with principal, rate, and period',
            'GET /health': 'Check API health status'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Mortgage Calculator API running on http://localhost:${PORT}`);
    console.log(`📊 Ready to calculate mortgages!`);
});