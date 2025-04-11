import React, { useState, useEffect } from 'react';

/**
 * Component for automatically generating and managing incident reports
 * Implements Requirement 8: The System should be able to record a report about each situation
 */
const IncidentReportComponent = ({ onBack, responses = [] }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [reportData, setReportData] = useState({
    id: '',
    responseId: '',
    title: '',
    date: '',
    emtName: '',
    patientName: '',
    patientCondition: '',
    procedures: '',
    medications: '',
    vitalSigns: '',
    transportDetails: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch reports data from API
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports');
      
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        // If API fails, use mock data for demonstration
        const mockReports = generateMockReports();
        setReports(mockReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Use mock data if API fails
      const mockReports = generateMockReports();
      setReports(mockReports);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock reports data for demonstration
  const generateMockReports = () => {
    const mockData = [];
    
    // Create sample reports for each response
    responses.forEach(response => {
      // Only create reports for completed responses
      if (response.status === 'completed') {
        const reportDate = response.completionTime || new Date().toISOString();
        
        mockData.push({
          id: `report-${response.id}`,
          responseId: response.id,
          title: `Incident Report: ${response.location || 'Unknown Location'}`,
          date: reportDate,
          emtName: 'John Medic', // Placeholder
          patientName: response.patient?.name || 'Unknown',
          patientCondition: response.patient?.condition || 'Stable',
          procedures: 'Initial assessment and stabilization',
          medications: 'None administered',
          vitalSigns: 'Heart Rate: 75 bpm, BP: 120/80',
          transportDetails: 'Transported to General Hospital',
          notes: `Priority ${response.priority} incident. ${response.notes || ''}`
        });
      }
    });
    
    return mockData;
  };

  // Handle selecting a report to view/edit
  const handleSelectReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setReportData(report);
      
      // Find the associated response
      const response = responses.find(r => r.id === report.responseId);
      setSelectedResponse(response);
      
      setEditMode(false);
    }
  };

  // Auto-generate report based on selected response
  const generateReportFromResponse = (response) => {
    if (!response) return null;
    
    // Determine appropriate procedures based on priority
    let procedures = '';
    let medications = '';
    let vitalSigns = '';
    
    switch(response.priority) {
      case 1:
        procedures = 'Basic assessment; Wound cleaning and dressing; Vital signs monitoring.';
        medications = 'Basic pain relief medication administered.';
        vitalSigns = 'Heart Rate: 72 bpm, BP: 120/80, O2 Sat: 98%';
        break;
      case 2:
        procedures = 'Advanced assessment; IV access established; Wound care; Vital signs monitoring.';
        medications = 'IV fluids; Pain management medication; Antibiotic prophylaxis.';
        vitalSigns = 'Heart Rate: 88 bpm, BP: 130/85, O2 Sat: 96%, Resp: 18';
        break;
      case 3:
        procedures = 'Advanced trauma assessment; Multiple IV access; Airway management; Bleeding control; Splinting.';
        medications = 'IV fluids; Analgesics; Anxiolytics; Vasoactive medications.';
        vitalSigns = 'Heart Rate: 105 bpm, BP: 95/60, O2 Sat: 94%, Resp: 22, GCS: 13';
        break;
      case 4:
        procedures = 'Critical care protocols; Advanced airway management; Multiple IV/IO access; Chest decompression; Hemorrhage control; Hypothermia prevention.';
        medications = 'IV fluid bolus; Blood products; Vasoactive medications; RSI medications; Antiarrhythmics.';
        vitalSigns = 'Heart Rate: 130 bpm, BP: 80/50, O2 Sat: 88%, Resp: 28, GCS: 9';
        break;
      default:
        procedures = 'Standard assessment and care provided.';
        medications = 'Standard medications administered as per protocol.';
        vitalSigns = 'Vital signs within normal limits.';
    }
    
    // Generate situational notes based on situation type
    let situationNotes = '';
    if (response.situationType) {
      switch(response.situationType) {
        case 'minor':
          situationNotes = 'Minor incident requiring basic treatment. Patient stable throughout.';
          break;
        case 'moderate':
          situationNotes = 'Moderate severity incident requiring standard care protocols. Patient responded well to treatment.';
          break;
        case 'severe':
          situationNotes = 'Severe incident requiring advanced protocols. Patient condition stabilized during transport.';
          break;
        case 'trauma':
          situationNotes = 'Trauma incident with multiple injuries. Appropriate interventions performed per trauma protocols.';
          break;
        case 'cardiac':
          situationNotes = 'Cardiac emergency protocols implemented. Continuous cardiac monitoring during transport.';
          break;
        case 'pediatric':
          situationNotes = 'Pediatric protocols followed. Age-appropriate assessment and interventions performed.';
          break;
        default:
          situationNotes = 'Standard protocols followed based on patient presentation.';
      }
    }
    
    // Generate transport details based on priority
    let transportDetails = '';
    if (response.priority >= 3) {
      transportDetails = 'Emergency transport to nearest trauma center with pre-notification to receiving facility.';
    } else if (response.priority === 2) {
      transportDetails = 'Priority transport to appropriate medical facility with report called ahead.';
    } else {
      transportDetails = 'Routine transport to local emergency department.';
    }
    
    // Create the generated report
    return {
      id: `report-${Date.now()}`,
      responseId: response.id,
      title: `Incident Report: ${response.location || 'Unknown Location'}`,
      date: new Date().toISOString(),
      emtName: '', // To be filled by the operator
      patientName: response.patient?.name || '',
      patientCondition: response.patient?.condition || '',
      procedures: procedures,
      medications: medications,
      vitalSigns: vitalSigns,
      transportDetails: transportDetails,
      notes: `Priority ${response.priority} incident. ${situationNotes} ${response.notes || ''}`
    };
  };

  // Handle selecting a response to create a new report
  const handleSelectResponse = (responseId) => {
    const response = responses.find(r => r.id === responseId);
    if (response) {
      setSelectedResponse(response);
      
      // Check if report already exists for this response
      const existingReport = reports.find(r => r.responseId === responseId);
      
      if (existingReport) {
        setSelectedReport(existingReport);
        setReportData(existingReport);
        setEditMode(false);
      } else {
        // Auto-generate a new report based on response data
        const generatedReport = generateReportFromResponse(response);
        
        setSelectedReport(null);
        setReportData(generatedReport);
        setEditMode(true);
      }
    }
  };

  // Handle report form changes
  const handleInputChange = (e) => {
    setReportData({
      ...reportData,
      [e.target.name]: e.target.value
    });
  };

  // Generate a new report using AI-like analysis of the response data
  const handleAutoGenerateReport = () => {
    if (!selectedResponse) return;
    
    const generatedReport = generateReportFromResponse(selectedResponse);
    setReportData(generatedReport);
  };

  // Save report to API and state
  const handleSaveReport = async () => {
    try {
      // Prepare report data with current date if it's a new report
      const updatedReport = {
        ...reportData,
        date: reportData.date || new Date().toISOString()
      };
      
      // Send to API
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
      });
      
      if (response.ok) {
        // Update state with saved report
        const existingIndex = reports.findIndex(r => r.id === updatedReport.id);
        
        if (existingIndex >= 0) {
          // Update existing report
          setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
        } else {
          // Add new report
          setReports([...reports, updatedReport]);
        }
        
        setSelectedReport(updatedReport);
        setEditMode(false);
        alert('Report saved successfully!');
      } else {
        // Even if API fails, update UI for demonstration
        const existingIndex = reports.findIndex(r => r.id === updatedReport.id);
        
        if (existingIndex >= 0) {
          setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
        } else {
          setReports([...reports, updatedReport]);
        }
        
        setSelectedReport(updatedReport);
        setEditMode(false);
        console.warn('Could not save to API, but updated local state');
        alert('Report saved locally!');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      
      // Update UI for demonstration even if API fails
      const updatedReport = {
        ...reportData,
        date: reportData.date || new Date().toISOString()
      };
      
      const existingIndex = reports.findIndex(r => r.id === updatedReport.id);
      
      if (existingIndex >= 0) {
        setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
      } else {
        setReports([...reports, updatedReport]);
      }
      
      setSelectedReport(updatedReport);
      setEditMode(false);
      alert('Report saved locally!');
    }
  };

  // Create a new blank report
  const createNewReport = () => {
    const newReport = {
      id: `report-${Date.now()}`,
      responseId: '',
      title: 'New Report',
      date: new Date().toISOString(),
      emtName: '',
      patientName: '',
      patientCondition: '',
      procedures: '',
      medications: '',
      vitalSigns: '',
      transportDetails: '',
      notes: ''
    };
    
    setSelectedReport(null);
    setSelectedResponse(null);
    setReportData(newReport);
    setEditMode(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Get response data for display
  const getResponseInfo = (responseId) => {
    const response = responses.find(r => r.id === responseId);
    if (!response) return 'Unknown Response';
    
    // Create a display string with location and priority
    return `${response.location || 'Unknown Location'} (Priority ${response.priority})`;
  };

  if (loading) {
    return (
      <div className="form-container">
        <h2>Incident Reports</h2>
        <div className="loading-container">
          <p>Loading reports data...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container team-management">
      <h2>Incident Reports</h2>
      
      <div className="team-management-content">
        <div className="team-list">
          <h3>Available Reports</h3>
          
          <div className="filter-container">
            <span className="filter-label">Existing Reports</span>
          </div>
          
          <div className="team-buttons">
            {reports.map(report => (
              <button 
                key={report.id}
                className={`team-button ${selectedReport && selectedReport.id === report.id ? 'selected' : ''}`}
                onClick={() => handleSelectReport(report.id)}
              >
                <div>{report.title}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {formatDate(report.date)}
                </div>
                <div style={{ fontSize: '11px', marginTop: '3px' }}>
                  {getResponseInfo(report.responseId)}
                </div>
              </button>
            ))}
            
            <button className="team-button new-team" onClick={createNewReport}>
              + Create New Report
            </button>
          </div>
          
          <div className="filter-container" style={{ marginTop: '20px' }}>
            <span className="filter-label">Create Report for Response</span>
          </div>
          
          <div className="team-buttons">
            {responses
              .filter(response => response.status === 'completed')
              .map(response => {
                const hasReport = reports.some(r => r.responseId === response.id);
                
                return (
                  <button 
                    key={response.id}
                    className={`team-button ${selectedResponse && selectedResponse.id === response.id ? 'selected' : ''}`}
                    onClick={() => handleSelectResponse(response.id)}
                  >
                    <div className="response-summary">
                      <span className={`priority priority-${response.priority}`}>P{response.priority}</span>
                      <span>{response.location || 'Unknown Location'}</span>
                      {hasReport && <span style={{ color: '#4CAF50', marginLeft: '5px' }}>✓</span>}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {formatDate(response.completionTime || response.dispatchTime)}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
        
        <div className="team-details">
          <h3>Report Details</h3>
          
          {editMode ? (
            // Edit form
            <div className="team-edit-form">
              {selectedResponse && (
                <div className="button-group" style={{ marginBottom: '15px' }}>
                  <button 
                    className="gradient-button view" 
                    onClick={handleAutoGenerateReport}
                  >
                    Auto-Generate Report Content
                  </button>
                </div>
              )}
              
              <div className="form-group">
                <label>Report Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  value={reportData.title} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label>EMT Name:</label>
                <input 
                  type="text" 
                  name="emtName" 
                  value={reportData.emtName} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label>Date:</label>
                <input 
                  type="datetime-local" 
                  name="date" 
                  value={reportData.date ? new Date(reportData.date).toISOString().slice(0, 16) : ''} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label>Patient Name:</label>
                <input 
                  type="text" 
                  name="patientName" 
                  value={reportData.patientName} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label>Patient Condition:</label>
                <textarea 
                  name="patientCondition" 
                  value={reportData.patientCondition} 
                  onChange={handleInputChange} 
                  rows="2"
                />
              </div>
              
              <div className="form-group">
                <label>Procedures Performed:</label>
                <textarea 
                  name="procedures" 
                  value={reportData.procedures} 
                  onChange={handleInputChange} 
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Medications Administered:</label>
                <textarea 
                  name="medications" 
                  value={reportData.medications} 
                  onChange={handleInputChange} 
                  rows="2"
                />
              </div>
              
              <div className="form-group">
                <label>Vital Signs:</label>
                <textarea 
                  name="vitalSigns" 
                  value={reportData.vitalSigns} 
                  onChange={handleInputChange} 
                  rows="2"
                />
              </div>
              
              <div className="form-group">
                <label>Transport Details:</label>
                <textarea 
                  name="transportDetails" 
                  value={reportData.transportDetails} 
                  onChange={handleInputChange} 
                  rows="2"
                />
              </div>
              
              <div className="form-group">
                <label>Additional Notes:</label>
                <textarea 
                  name="notes" 
                  value={reportData.notes} 
                  onChange={handleInputChange} 
                  rows="3"
                />
              </div>
              
              <div className="button-group">
                <button className="gradient-button" onClick={handleSaveReport}>Save Report</button>
                <button className="gradient-button" onClick={() => {
                  if (selectedReport) {
                    setEditMode(false);
                  } else {
                    setSelectedReport(null);
                    setSelectedResponse(null);
                    setReportData({});
                  }
                }}>Cancel</button>
              </div>
            </div>
          ) : selectedReport ? (
            // View mode
            <div className="team-info">
              <div className="info-group">
                <label>Report Title:</label>
                <p>{selectedReport.title}</p>
              </div>
              
              <div className="info-group">
                <label>Date:</label>
                <p>{formatDate(selectedReport.date)}</p>
              </div>
              
              <div className="info-group">
                <label>Emergency Response:</label>
                <p>{getResponseInfo(selectedReport.responseId)}</p>
              </div>
              
              <div className="info-group">
                <label>EMT Name:</label>
                <p>{selectedReport.emtName || 'Not specified'}</p>
              </div>
              
              <h4>Patient Information</h4>
              
              <div className="info-group">
                <label>Patient Name:</label>
                <p>{selectedReport.patientName || 'Not specified'}</p>
              </div>
              
              <div className="info-group">
                <label>Patient Condition:</label>
                <p>{selectedReport.patientCondition || 'Not specified'}</p>
              </div>
              
              <h4>Medical Details</h4>
              
              <div className="info-group">
                <label>Procedures Performed:</label>
                <p>{selectedReport.procedures || 'None recorded'}</p>
              </div>
              
              <div className="info-group">
                <label>Medications Administered:</label>
                <p>{selectedReport.medications || 'None administered'}</p>
              </div>
              
              <div className="info-group">
                <label>Vital Signs:</label>
                <p>{selectedReport.vitalSigns || 'Not recorded'}</p>
              </div>
              
              <div className="info-group">
                <label>Transport Details:</label>
                <p>{selectedReport.transportDetails || 'Not specified'}</p>
              </div>
              
              {selectedReport.notes && (
                <div className="info-group">
                  <label>Additional Notes:</label>
                  <p>{selectedReport.notes}</p>
                </div>
              )}
              
              <div className="button-group">
                <button className="gradient-button" onClick={() => setEditMode(true)}>Edit Report</button>
              </div>
            </div>
          ) : (
            // No report selected
            <div className="info-display" style={{ textAlign: 'center' }}>
              <p>Select a report from the list to view details or click "Create New Report" to create a new one.</p>
              <p>You can also create a report for a completed emergency response by selecting from the list below.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="button-group">
        <button type="button" className="gradient-button" onClick={onBack}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default IncidentReportComponent;