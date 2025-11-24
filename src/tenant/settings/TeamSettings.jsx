// src/tenant/settings/TeamSettings.jsx
import React, { useState } from 'react';
import './TeamSettings.css';

const TeamSettings = () => {
  const [companyData, setCompanyData] = useState({
    company_name: 'AcmeCorp',
    industry: 'Technology',
    company_size: '50-100',
    website: 'https://acmecorp.com',
    timezone: 'America/New_York',
    date_format: 'MM/DD/YYYY',
    language: 'en'
  });

  const [notifications, setNotifications] = useState({
    email_assignments: true,
    email_approvals: true,
    email_deadlines: true,
    email_reports: false,
    slack_notifications: false,
    weekly_digest: true
  });

  const [security, setSecurity] = useState({
    require_2fa: false,
    password_expiry_days: 90,
    session_timeout_minutes: 60,
    ip_whitelist_enabled: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="team-settings-page">
{/* Clean Page Header */}
      <div className="page-header-settings">
        <div className="header-content">
          <div className="header-left">
            <h1>Team Settings</h1>
            <p className="header-subtitle">
              Configure your company settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="team-settings-content">
        {/* Company Profile */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Company Profile</h2>
            <p className="section-description">Basic information about your company</p>
          </div>

          <div className="settings-card">
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyData.company_name}
                  onChange={(e) => setCompanyData({...companyData, company_name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <select
                  className="form-input"
                  value={companyData.industry}
                  onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Company Size</label>
                <select
                  className="form-input"
                  value={companyData.company_size}
                  onChange={(e) => setCompanyData({...companyData, company_size: e.target.value})}
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="50-100">50-100 employees</option>
                  <option value="101-500">101-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  className="form-input"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Company Logo</label>
              <div className="logo-upload">
                <div className="logo-preview">
                  <i className="fas fa-building"></i>
                </div>
                <div className="logo-upload-actions">
                  <button className="upload-btn">
                    <i className="fas fa-upload"></i>
                    Upload Logo
                  </button>
                  <p className="upload-hint">JPG, PNG or SVG. Max 2MB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Regional Settings</h2>
            <p className="section-description">Timezone and localization preferences</p>
          </div>

          <div className="settings-card">
            <div className="form-grid">
              <div className="form-group">
                <label>Timezone</label>
                <select
                  className="form-input"
                  value={companyData.timezone}
                  onChange={(e) => setCompanyData({...companyData, timezone: e.target.value})}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date Format</label>
                <select
                  className="form-input"
                  value={companyData.date_format}
                  onChange={(e) => setCompanyData({...companyData, date_format: e.target.value})}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="form-group">
                <label>Language</label>
                <select
                  className="form-input"
                  value={companyData.language}
                  onChange={(e) => setCompanyData({...companyData, language: e.target.value})}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Notification Preferences</h2>
            <p className="section-description">Manage email and system notifications</p>
          </div>

          <div className="settings-card">
            <div className="toggle-list">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Assignment Notifications</h4>
                  <p>Receive emails when new controls are assigned to you</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email_assignments}
                    onChange={(e) => setNotifications({...notifications, email_assignments: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Approval Requests</h4>
                  <p>Get notified when submissions need your approval</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email_approvals}
                    onChange={(e) => setNotifications({...notifications, email_approvals: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Deadline Reminders</h4>
                  <p>Reminders for upcoming deadlines and overdue items</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email_deadlines}
                    onChange={(e) => setNotifications({...notifications, email_deadlines: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Compliance Reports</h4>
                  <p>Weekly compliance score and progress reports</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email_reports}
                    onChange={(e) => setNotifications({...notifications, email_reports: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Weekly Digest</h4>
                  <p>Summary of all activities every Monday morning</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.weekly_digest}
                    onChange={(e) => setNotifications({...notifications, weekly_digest: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Security Settings</h2>
            <p className="section-description">Configure security and access controls</p>
          </div>

          <div className="settings-card">
            <div className="toggle-list">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Require Two-Factor Authentication (2FA)</h4>
                  <p>All users must enable 2FA to access the system</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={security.require_2fa}
                    onChange={(e) => setSecurity({...security, require_2fa: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="form-group">
                <label>Password Expiry (days)</label>
                <input
                  type="number"
                  className="form-input"
                  value={security.password_expiry_days}
                  onChange={(e) => setSecurity({...security, password_expiry_days: parseInt(e.target.value)})}
                  min="30"
                  max="365"
                />
                <p className="field-hint">Users will be required to change password after this period</p>
              </div>

              <div className="form-group">
                <label>Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  value={security.session_timeout_minutes}
                  onChange={(e) => setSecurity({...security, session_timeout_minutes: parseInt(e.target.value)})}
                  min="15"
                  max="480"
                />
                <p className="field-hint">Auto-logout after period of inactivity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="save-section">
          <button 
            className="save-settings-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSettings;