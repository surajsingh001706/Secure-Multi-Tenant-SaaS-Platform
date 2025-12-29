const UsageLog = require('../models/UsageLog');
const AnalyticsReport = require('../models/AnalyticsReport');
const { generateInsights } = require('../services/geminiService');

// @desc    Generate/Get Analytics
// @route   POST /api/analytics/generate
// @access  Private (Admin)
const generateReport = async (req, res) => {
    try {
        const tenantId = req.tenant._id;

        // Fetch last 7 days of logs
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const logs = await UsageLog.find({
            tenantId,
            createdAt: { $gte: startDate, $lte: endDate }
        });

        if (logs.length === 0) {
            return res.status(200).json({ message: 'No logs to analyze' });
        }

        // Call Gemini
        const insights = await generateInsights(logs);

        // Save Report
        const report = await AnalyticsReport.create({
            tenantId,
            weekStartDate: startDate,
            weekEndDate: endDate,
            totalActions: logs.length,
            aiInsights: insights,
        });

        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating report' });
    }
};

// @desc    Get past reports
// @route   GET /api/analytics
const getReports = async (req, res) => {
    try {
        const reports = await AnalyticsReport.find({ tenantId: req.tenant._id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
};

module.exports = { generateReport, getReports };
