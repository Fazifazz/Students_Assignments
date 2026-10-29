import { useRef } from 'react';

const AttachmentMenu = ({ onSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(png|jpg|jpeg|webp|pdf|doc|docx|txt)$/i)) {
      alert('Unsupported file type. Please choose a photo, PDF, Word, or text file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please upload a file smaller than 5MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    onSelect({ name: file.name, size: file.size, type: file.type, url });
    event.target.value = '';
  };

  return (
    <>
      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => fileInputRef.current?.click()}>
        <i className="bi bi-paperclip me-1"></i>
        Attach
      </button>
      <input ref={fileInputRef} type="file" className="d-none" onChange={handleFileChange} />
    </>
  );
};

export default AttachmentMenu;
