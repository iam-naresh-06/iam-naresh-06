// src/components/admin/Reports.jsx
import React, { useState } from 'react';
import reportService from '../../services/reportService';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  const reportTypes = [
    { id: 'circulation', name: 'Circulation Report' },
    { id: 'inventory', name: 'Inventory Report' },
    { id: 'financial', name: 'Financial Report' },
    { id: 'user-activity', name: 'User Activity Report' },
    { id: 'overdue', name: 'Overdue Items Report' }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) return;

    setGenerating(true);
    try {
      const data = await reportService.generateReport(selectedReport, dateRange);
      setReportData(data);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (format) => {
    if (!reportData) return;
    
    // Implement export functionality
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Generate and export library reports</p>
      </div>

      <div className="report-generator">
        <div className="form-group">
          <label className="form-label">Report Type</label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="form-select"
          >
            <option value="">Select Report Type</option>
            {reportTypes.map(report => (
              <option key={report.id} value={report.id}>
                {report.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date Range</label>
          <div className="date-range-inputs">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="form-input"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={!selectedReport || generating}
          className="btn btn-primary"
        >
          {generating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {reportData && (
        <div className="report-results">
          <div className="report-actions">
            <button onClick={() => handleExport('pdf')} className="btn btn-secondary">
              Export PDF
            </button>
            <button onClick={() => handleExport('excel')} className="btn btn-secondary">
              Export Excel
            </button>
            <button onClick={() => handleExport('csv')} className="btn btn-secondary">
              Export CSV
            </button>
          </div>

          <div className="report-content">
            <h3>{reportTypes.find(r => r.id === selectedReport)?.name}</h3>
            <pre>{JSON.stringify(reportData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
