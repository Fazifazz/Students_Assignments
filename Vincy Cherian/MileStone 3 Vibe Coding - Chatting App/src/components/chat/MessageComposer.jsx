import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../features/messages/messageSlice';
import { markConversationRead, updateConversationPreview } from '../../features/chats/chatSlice';
import AudioRecorder from './AudioRecorder';
import AttachmentMenu from './AttachmentMenu';

const MessageComposer = ({ chatId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [text, setText] = useState('');
  const [audioMessage, setAudioMessage] = useState(null);
  const [attachment, setAttachment] = useState(null);

  const handleSend = () => {
    const messageText = text.trim();
    if (!messageText && !audioMessage && !attachment) return;

    const message = {
      id: `msg-${Date.now()}`,
      conversationId: chatId,
      senderId: user.id,
      senderName: 'You',
      text: messageText || 'Audio message',
      type: audioMessage ? 'audio' : attachment ? 'attachment' : 'text',
      createdAt: new Date().toISOString(),
      status: 'sent',
      audioUrl: audioMessage?.url || '',
      transcript: audioMessage?.transcript || '',
      sourceLanguage: 'en',
      translations: {},
      transcriptionStatus: audioMessage?.transcript ? 'success' : 'idle',
      translationStatus: 'idle',
      attachment: attachment
        ? {
            name: attachment.name,
            size: attachment.size,
            type: attachment.type,
            url: attachment.url,
          }
        : null,
    };

    dispatch(addMessage({ conversationId: chatId, message }));
    dispatch(
      updateConversationPreview({
        chatId,
        text: messageText || 'Audio message',
        timestamp: new Date().toISOString(),
      }),
    );
    dispatch(markConversationRead(chatId));
    setText('');
    setAudioMessage(null);
    setAttachment(null);
  };

  return (
    <div className="border-top bg-white p-3">
      <div className="d-flex gap-2 align-items-center flex-wrap">
        <AttachmentMenu onSelect={setAttachment} />
        <AudioRecorder
          onRecordingComplete={(recording) => {
            const transcript = 'Demo transcript: I just recorded an audio note.';
            setAudioMessage({ ...recording, transcript });
          }}
          onCancel={() => setAudioMessage(null)}
        />
      </div>

      {audioMessage && (
        <div className="alert alert-light border mt-3 mb-2 d-flex justify-content-between align-items-center">
          <div>
            <strong>Audio preview</strong>
            <audio controls className="d-block mt-2" src={audioMessage.url}></audio>
          </div>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setAudioMessage(null)}>
            Remove
          </button>
        </div>
      )}

      {attachment && (
        <div className="alert alert-light border mt-2 mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <span>{attachment.name}</span>
            <button type="button" className="btn btn-sm btn-link text-secondary" onClick={() => setAttachment(null)}>
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="d-flex align-items-end gap-2 mt-2">
        <textarea
          className="form-control"
          rows="2"
          placeholder="Write a message..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <button type="button" className="btn btn-success" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageComposer;
