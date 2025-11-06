import React, { useState } from 'react';
import JSZip from 'jszip';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, HeadingLevel, ImageRun } from 'docx';

// Helper to export as EPUB
function exportEPUB(entry) {
  const zip = new JSZip();
  const htmlContent = `<h1>${entry.title}</h1><div>${entry.content}</div>`;
  zip.file('index.html', htmlContent);
  zip.generateAsync({ type: 'blob' }).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.title || 'diary'}.epub.zip`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Helper to export as PDF
function exportPDF(entry) {
  const element = document.createElement('div');
  element.innerHTML = `<h1>${entry.title}</h1><div>${entry.content}</div>`;
  html2pdf().from(element).set({ filename: `${entry.title || 'diary'}.pdf` }).save();
}


async function exportWord(entry) {
  const children = [
    new Paragraph({ text: entry.title, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ text: entry.date }),
    entry.tags && entry.tags.length > 0 ? new Paragraph({ text: 'Tags: ' + entry.tags.join(', ') }) : null,
    entry.mood ? new Paragraph({ text: 'Mood: ' + entry.mood }) : null,
    new Paragraph({ text: '' }),
  ].filter(Boolean);

  // Add main diary image if present
  if (entry.image) {
    let imgData;
    if (entry.image.startsWith('data:image')) {
      const base64 = entry.image.split(',')[1];
      const binary = atob(base64);
      const len = binary.length;
      const buffer = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
      }
      imgData = buffer;
    } else {
      imgData = await fetch(entry.image).then(r => r.arrayBuffer());
    }
    children.push(new Paragraph({
      children: [
        new ImageRun({
          data: imgData,
          transformation: { width: 400, height: 300 },
        })
      ]
    }));
  }

  // Parse HTML content for images and text
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = entry.content;

  async function htmlToDocxParagraphs(node) {
    let paragraphs = [];
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim()) {
        paragraphs.push(new Paragraph({ text: node.textContent }));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'IMG') {
        const src = node.getAttribute('src');
        if (src) {
          let imgData;
          if (src.startsWith('data:image')) {
            const base64 = src.split(',')[1];
            const binary = atob(base64);
            const len = binary.length;
            const buffer = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              buffer[i] = binary.charCodeAt(i);
            }
            imgData = buffer;
          } else {
            imgData = await fetch(src).then(r => r.arrayBuffer());
          }
          paragraphs.push(new Paragraph({
            children: [
              new ImageRun({
                data: imgData,
                transformation: { width: 400, height: 300 },
              })
            ]
          }));
        }
      } else {
  let paraOptions = {}; // used for formatting options
        switch (node.tagName) {
          case 'H1': paraOptions.heading = HeadingLevel.HEADING_1; break;
          case 'H2': paraOptions.heading = HeadingLevel.HEADING_2; break;
          case 'H3': paraOptions.heading = HeadingLevel.HEADING_3; break;
          case 'B':
          case 'STRONG': paraOptions.bold = true; break;
          case 'I':
          case 'EM': paraOptions.italics = true; break;
        }
        if (node.tagName === 'UL' || node.tagName === 'OL') {
          for (const li of node.children) {
            if (li.tagName === 'LI') {
              paragraphs.push(new Paragraph({
                text: li.textContent,
                bullet: node.tagName === 'UL' ? { level: 0 } : undefined,
                numbering: node.tagName === 'OL' ? { reference: 'numbered-list', level: 0 } : undefined,
              }));
            }
          }
        } else {
          let text = '';
          for (const child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
              text += child.textContent;
            } else {
              const childParagraphs = await htmlToDocxParagraphs(child);
              paragraphs = paragraphs.concat(childParagraphs);
            }
          }
          if (text.trim()) {
            paragraphs.push(new Paragraph({ text, ...paraOptions }));
          }
        }
      }
    }
    return paragraphs;
  }

  for (const node of tempDiv.childNodes) {
    const nodeParagraphs = await htmlToDocxParagraphs(node);
    children.push(...nodeParagraphs);
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${entry.title || 'DiaryEntry'}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

const ExportButtons = ({ entry }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleDownload = async (type) => {
    setShowMenu(false);
    if (type === 'word') await exportWord(entry);
    if (type === 'pdf') exportPDF(entry);
    if (type === 'epub') exportEPUB(entry);
  };

  return (
    <div className="flex gap-2 mt-2 items-center relative">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        onClick={e => { e.stopPropagation(); e.preventDefault(); setShowMenu(!showMenu); }}
      >
        Download
      </button>
      {showMenu && (
        <div className="absolute z-50 bottom-12 left-0 bg-white border rounded shadow-lg flex flex-col min-w-[12rem] w-max">
          <button className="px-4 py-2 font-bold bg-blue-100 text-blue-700 text-left" onClick={e => { e.stopPropagation(); e.preventDefault(); handleDownload('word'); }}>Word (.docx)</button>
          <button className="px-4 py-2 hover:bg-purple-100 text-left" onClick={e => { e.stopPropagation(); e.preventDefault(); handleDownload('pdf'); }}>PDF (.pdf)</button>
          <button className="px-4 py-2 hover:bg-green-100 text-left" onClick={e => { e.stopPropagation(); e.preventDefault(); handleDownload('epub'); }}>EPUB (.epub)</button>
        </div>
      )}
      <button
        className="ml-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-3 py-1 rounded-full shadow transition-all duration-300 flex items-center gap-1 text-sm sm:text-base min-w-[44px] min-h-[28px]"
        style={{ boxShadow: '0 2px 8px rgba(255,193,7,0.2)', lineHeight: 1.1 }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          window.open('https://hellomydude.gumroad.com/coffee', '_blank', 'noopener,noreferrer');
        }}
      >
  <span role="img" aria-label="coffee">☕</span>
  <span className="ml-1 text-xs font-normal">Buy Me a Coffee</span>
      </button>
    </div>
  );
};

export default ExportButtons;
