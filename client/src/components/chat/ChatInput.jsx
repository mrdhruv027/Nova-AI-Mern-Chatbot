import React, { useState, useRef } from 'react';
import { Send, Image, Mic, MicOff, Square, X, Loader2 } from 'lucide-react';
import { uploadAPI } from '../../services/api';

const ChatInput = ({ onSend, isStreaming, onStop }) => {
  const [prompt, setPrompt] = useState('');
  const [attachedImages, setAttachedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim() && attachedImages.length === 0) return;
    if (isStreaming) return;

    onSend(prompt, attachedImages);
    setPrompt('');
    setAttachedImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result;
          const res = await uploadAPI.uploadImage(base64Data, file.name);
          if (res.success) {
            setAttachedImages((prev) => [
              ...prev,
              { url: res.url, fileId: res.fileId, name: res.name },
            ]);
          }
        } catch (err) {
          console.error('Image upload failed:', err.message);
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6 pt-2">
      {/* Attached Images Thumbnail Bar */}
      {attachedImages.length > 0 && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-slate-900/90 rounded-xl border border-slate-800">
          {attachedImages.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.url}
                alt="Attachment preview"
                className="w-14 h-14 object-cover rounded-lg border border-slate-700"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-md transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Input Box Container */}
      <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/70 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xl transition-all">
        {/* File upload hidden input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* Upload Image Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
          title="Attach Image (ImageKit)"
        >
          {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> : <Image className="w-5 h-5" />}
        </button>

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          className={`p-2.5 rounded-xl transition-colors shrink-0 ${
            isListening
              ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/30'
              : 'hover:bg-slate-800 text-slate-400 hover:text-indigo-400'
          }`}
          title="Voice Speech-to-Text Input"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening to your voice...' : 'Ask Nova AI anything, attach images, or paste code...'}
          rows={1}
          className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none resize-none py-2.5 px-2 max-h-44 scrollbar-thin"
        />

        {/* Send or Stop Button */}
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-600/20 transition-all shrink-0"
            title="Stop generating response"
          >
            <Square className="w-4 h-4 fill-white" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!prompt.trim() && attachedImages.length === 0}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium shadow-lg shadow-indigo-600/25 transition-all shrink-0"
            title="Send prompt"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-[11px] text-center text-slate-500 mt-2">
        Nova AI can analyze code, render Markdown, and read images using ImageKit & Gemini. Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400 font-mono">Shift + Enter</kbd> for new line.
      </p>
    </div>
  );
};

export default ChatInput;
