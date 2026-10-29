import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMessageTranslation, updateMessageTranscript } from '../../features/messages/messageSlice';
import { translateMockText } from '../../services/translationService';

const languageMap = {
  en: 'English',
  ml: 'Malayalam',
  hi: 'Hindi',
  ta: 'Tamil',
  kn: 'Kannada',
  ar: 'Arabic',
  es: 'Spanish',
};

const MessageBubble = ({ message, isMine, conversationId }) => {
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showTranslation, setShowTranslation] = useState(false);

  const translatedText =
    selectedLanguage && message.translations?.[selectedLanguage]
      ? message.translations[selectedLanguage]
      : selectedLanguage !== 'en'
        ? translateMockText(message.text || 'Transcribed audio preview', selectedLanguage)
        : '';

  const handleTranslate = (lang) => {
    setSelectedLanguage(lang);
    setShowTranslation(true);

    const translation = translateMockText(message.text || 'Transcribed audio preview', lang);
    dispatch(
      updateMessageTranslation({
        conversationId,
        messageId: message.id,
        targetLanguage: lang,
        translation,
        status: 'success',
      }),
    );
  };

  const handleTranscribe = () => {
    const transcript = 'Demo transcript: hello everyone, the app is working well.';
    dispatch(
      updateMessageTranscript({
        conversationId,
        messageId: message.id,
        transcript,
        language: 'en',
        status: 'success',
      }),
    );
  };

  return (
    <div className={`d-flex mb-3 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`card shadow-sm ${isMine ? 'bg-success-subtle border-success-subtle' : 'bg-light border-0'}`} style={{ maxWidth: '70%' }}>
        <div className="card-body p-3">
          {!isMine && <div className="small text-muted fw-semibold mb-1">{message.senderName}</div>}

          {message.type === 'audio' && message.audioUrl && (
            <>
              <audio controls src={message.audioUrl} className="w-100 my-2"></audio>
              {message.transcript && <div className="small mt-2 text-secondary">Transcript: {message.transcript}</div>}
              <button type="button" className="btn btn-link btn-sm p-0" onClick={handleTranscribe}>
                {message.transcript ? 'Refresh transcript' : 'Transcribe to text'}
              </button>
            </>
          )}

          {message.type === 'attachment' && message.attachment && (
            <div className="mb-2">
              {message.attachment.type.startsWith('image/') ? (
                <img src={message.attachment.url} alt={message.attachment.name} className="img-fluid rounded" />
              ) : (
                <div className="d-flex align-items-center gap-2 p-2 bg-white rounded border">
                  <i className="bi bi-file-earmark-text fs-4 text-secondary"></i>
                  <div>
                    <div className="fw-semibold small">{message.attachment.name}</div>
                    <div className="text-muted small">{(message.attachment.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {message.text && <div className="mb-1">{message.text}</div>}

          {message.transcript && (
            <div className="small text-secondary border-top mt-2 pt-2">Transcript: {message.transcript}</div>
          )}

          {showTranslation && translatedText && (
            <div className="mt-2 border-top pt-2 small text-secondary">
              <div className="fw-semibold text-dark mb-1">{languageMap[selectedLanguage] || selectedLanguage} translation</div>
              <div>{translatedText}</div>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-2 gap-2 flex-wrap">
            <small className="text-muted">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select form-select-sm"
                value={selectedLanguage}
                onChange={(event) => handleTranslate(event.target.value)}
                aria-label="Translate message"
                style={{ width: '120px' }}
              >
                <option value="en">English</option>
                <option value="ml">Malayalam</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="kn">Kannada</option>
                <option value="ar">Arabic</option>
                <option value="es">Spanish</option>
              </select>
              {translatedText && (
                <button type="button" className="btn btn-link btn-sm p-0 text-secondary" onClick={() => setShowTranslation((value) => !value)}>
                  {showTranslation ? 'Hide' : 'Show'} translation
                </button>
              )}
              {isMine ? <span className="badge text-bg-light">{message.status}</span> : <span className="text-muted small">Seen</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
