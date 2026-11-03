import { useEffect, useRef, useState } from 'react';

const AudioRecorder = ({ onRecordingComplete, onCancel }) => {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('idle');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording) return undefined;

    const timer = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setStatus('unsupported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size === 0) {
          setStatus('error');
          return;
        }

        const url = URL.createObjectURL(blob);
        onRecordingComplete({ url, blob, duration: seconds });
        setStatus('success');
        setIsRecording(false);
        setSeconds(0);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus('recording');
      setIsRecording(true);
      setSeconds(0);
    } catch (error) {
      console.warn('Mic permission denied or unsupported:', error);
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setStatus('processing');
      setIsRecording(false);
      return;
    }

    setStatus('idle');
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {isRecording ? (
        <>
          <span className="badge bg-danger">Recording {seconds}s</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={stopRecording}>
            Stop
          </button>
        </>
      ) : (
        <>
          <button type="button" className="btn btn-outline-success btn-sm" onClick={startRecording}>
            <i className="bi bi-mic me-1"></i>
            Mic
          </button>
          {status === 'error' && <span className="text-danger small">Microphone unavailable</span>}
          {status === 'unsupported' && <span className="text-warning small">Browser does not support audio recording</span>}
        </>
      )}

      {status === 'success' && (
        <button type="button" className="btn btn-link btn-sm text-secondary" onClick={onCancel}>
          Clear
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
