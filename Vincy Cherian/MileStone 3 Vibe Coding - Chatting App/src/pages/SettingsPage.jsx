const SettingsPage = () => (
  <div className="container py-4">
    <h3>Application settings</h3>
    <div className="card p-4 mt-3">
      <h5>Prototype capabilities</h5>
      <ul className="mb-0">
        <li>Mock authentication with browser storage only</li>
        <li>Audio recording via MediaRecorder when supported</li>
        <li>Attachment validation for photos, PDFs, docs, and text files</li>
        <li>Demo translation and transcription states for browser-based mock flows</li>
      </ul>
    </div>
  </div>
);

export default SettingsPage;
