import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BuyMeACoffee from './BuyMeACoffee';
import { getDiaryEntriesFromSupabase } from '../dbSupabase';
import { useSupabaseUser } from '../useSupabaseUser';
import { Link } from 'react-router-dom';
import { Document, Packer, Paragraph, HeadingLevel, ImageRun } from 'docx';

function DiaryList(props) {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const user = useSupabaseUser();

  useEffect(() => {
    if (user && user.id) {
      getDiaryEntriesFromSupabase(user.id).then(({ data }) => {
        setEntries(data || []);
      });
    }
  }, [props.refresh, user]);

  // Filter entries
  const filtered = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase()) || entry.content.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Handler for drag end (to be implemented)
  const onDragEnd = result => {
    // Placeholder: will implement reordering logic later
  };

  // Download all entries as Word
  const downloadAllAsWord = async () => {
  // TODO: Download all entries from Supabase instead of local DB
  const allEntries = entries;
    const sections = await Promise.all(allEntries.map(async (entry) => {
      const children = [
        new Paragraph({
          text: entry.title,
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({ text: entry.date }),
        entry.tags && entry.tags.length > 0 ? new Paragraph({ text: 'Tags: ' + entry.tags.join(', ') }) : null,
        entry.mood ? new Paragraph({ text: 'Mood: ' + entry.mood }) : null,
        new Paragraph({ text: '' }),
      ].filter(Boolean);

      // Add main diary image if present
      if (entry.image) {
        let imgData;
        try {
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
        } catch (e) {
          // Ignore image if it fails to load
        }
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
                // Convert base64 to ArrayBuffer
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
            // Handle formatting tags and recursively process children
            let paraOptions = {};
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
              // For other tags, recursively process children and apply formatting
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

      return { children };
    }));
    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DiaryEntries.docx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
  <div className="backdrop-blur-lg bg-white/80 rounded-2xl shadow-2xl p-4 w-full max-w-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-white/40" style={{boxSizing: 'border-box', padding: '16px', maxWidth: '100vw'}}>
  <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-2">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 shadow-lg mr-4">
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-10 h-10 text-blue-700'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M7 8h10M7 12h6m-6 4h10M5 6a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6z' />
          </svg>
        </span>
  <h2 className="text-2xl sm:text-4xl font-semibold px-4 py-2 rounded-2xl bg-white/80 shadow text-blue-700 tracking-tight" style={{wordBreak: 'break-word'}}>Diary Entries</h2>
      </div>
      <button
        className="mb-4 w-full sm:w-auto flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-full font-bold shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm active:scale-95 min-h-[40px]"
        onClick={downloadAllAsWord}
        style={{ touchAction: 'manipulation', lineHeight: 1, minWidth: 0, wordBreak: 'break-word' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-4-4m4 4l4-4" />
        </svg>
        <span className="inline">Download All as Word</span>
      </button>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
        <input
          type="text"
          className="p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/60 w-full"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="relative w-full">
        {/* Left-side vertical border removed for cleaner look */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="diary-list">
            {(provided) => (
              <ul className="space-y-8 w-full" ref={provided.innerRef} {...provided.droppableProps}>
                {filtered.length === 0 && (
                  <li className="text-center text-gray-400 py-8 text-lg">No diary entries yet. Click "Create New Entry" to get started!</li>
                )}
                {filtered.map((entry, idx) => (
                  <Draggable key={entry.id} draggableId={entry.id.toString()} index={idx}>
                    {(provided) => (
                      <React.Fragment>
                        <li className="relative pl-0 sm:pl-16 w-full" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Link to={`/entry/${entry.id}`} className="block w-full">
                            <div className="absolute left-2 top-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hidden sm:flex items-center justify-center text-white text-2xl shadow-lg">
                              {entry.mood}
                            </div>
                            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow p-4 w-full" style={{boxSizing: 'border-box'}}>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2 w-full">
                                <div className="flex flex-col gap-1 w-full">
                                  <span className="font-bold text-lg sm:text-xl text-blue-700 break-words">{entry.title}</span>
                                  <span className="text-gray-500 text-sm sm:text-base">{entry.date}</span>
                                  {entry.mood && (
                                    <span className="text-xs bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 px-2 py-1 rounded-full text-pink-700 w-fit">Mood: {entry.mood}</span>
                                  )}
                                  {entry.tags && entry.tags.length > 0 && (
                                    <span className="text-xs bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 px-2 py-1 rounded-full text-gray-700 w-fit">{entry.tags.join(', ')}</span>
                                  )}
                                </div>
                                <div className="flex flex-row gap-1 w-full mt-2 justify-end items-center">
                                  <Link
                                    to={`/entry/${entry.id}?edit=true`}
                                    className="flex items-center justify-center px-2 py-1 rounded-full bg-green-200 text-green-700 font-bold shadow hover:bg-green-300 transition-all duration-200 text-xs sm:text-sm"
                                    onClick={e => e.stopPropagation()}
                                    style={{ lineHeight: 1, minWidth: 0, maxWidth: '40px', wordBreak: 'break-word' }}
                                  >
                                    <span>✏️</span>
                                  </Link>
                                  {/* TODO: Implement delete logic for Supabase entries */}
                                  <span>
                                    <BuyMeACoffee />
                                  </span>
                                </div>
                              </div>
                              {entry.image && <img src={entry.image} alt="Diary" className="my-2 max-h-40 rounded-xl shadow w-full" style={{objectFit: 'cover'}} />}
                              {/* Content hidden in list view */}
                            </div>
                          </Link>
                        </li>
                        {idx < filtered.length - 1 && (
                          <hr className="my-4 border-t border-gray-200" />
                        )}
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
  </DragDropContext>
      </div>
    </div>
  );
}

export default DiaryList;
