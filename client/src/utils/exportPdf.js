import html2pdf from 'html2pdf.js';

export const exportChatToPdf = (chatTitle, messages) => {
  const container = document.createElement('div');
  container.style.padding = '30px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.color = '#111827';
  container.style.backgroundColor = '#ffffff';

  let htmlContent = `
    <div style="border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 24px;">
      <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">Nova AI - Conversation Export</h1>
      <h3 style="color: #4b5563; margin: 6px 0 0 0; font-weight: normal;">Title: ${chatTitle || 'Chat Transcript'}</h3>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 4px;">Exported on: ${new Date().toLocaleString()}</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: 16px;">
  `;

  messages.forEach((msg) => {
    const isUser = msg.role === 'user';
    const roleTitle = isUser ? 'You' : 'Nova AI Assistant';
    const bg = isUser ? '#f3f4f6' : '#eef2ff';
    const border = isUser ? '#d1d5db' : '#c7d2fe';

    htmlContent += `
      <div style="background-color: ${bg}; border-left: 4px solid ${border}; padding: 12px 16px; border-radius: 6px;">
        <div style="font-weight: bold; color: ${isUser ? '#374151' : '#4338ca'}; font-size: 13px; margin-bottom: 4px;">
          ${roleTitle} • <span style="font-weight: normal; color: #6b7280; font-size: 11px;">${new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</span>
        </div>
        <div style="font-size: 14px; line-height: 1.5; white-space: pre-wrap; word-break: break-word;">${msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>
    `;
  });

  htmlContent += `</div>`;
  container.innerHTML = htmlContent;

  const opt = {
    margin: [15, 15, 15, 15],
    filename: `${(chatTitle || 'nova_ai_chat').toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().set(opt).from(container).save();
};
