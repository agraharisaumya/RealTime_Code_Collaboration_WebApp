import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
import axios from 'axios';
import { debounce } from 'lodash'; // ✅ Import debounce for better performance

const Editor = ({ socketRef, roomId, selectedLanguage, onCodeChange, isController, username }) => {
  const editorRef = useRef(null);
  const [savedCode, setSavedCode] = useState("");

  useEffect(() => {
    const fetchSavedCode = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/code/${roomId}/${username}`);
        if (data?.code) {
          setSavedCode(data.code);
          if (editorRef.current) {
            editorRef.current.setValue(data.code); // ✅ Set code after fetching
          }
        }
      } catch (error) {
        console.error("Error fetching saved code:", error);
      }
    };

    fetchSavedCode();
  }, [roomId, username]);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          readOnly: !isController,
        }
      );

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);

        if (origin !== 'setValue' && socketRef.current) {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code, selectedLanguage });

          // ✅ Debounced code saving
          debouncedSaveCode(roomId, username, code);
        }
      });
    }
  }, []);

  const saveCodeToDB = async (roomId, username, code) => {
    try {
      await axios.post('http://localhost:5000/api/code/save', { roomId, username, code });
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const debouncedSaveCode = useRef(debounce(saveCodeToDB, 1000)).current; // ✅ Save after 1 sec of inactivity

  useEffect(() => {
    if (socketRef.current) {
      const handleCodeChange = ({ code }) => {
        if (editorRef.current && code !== null && code !== undefined) {
          editorRef.current.replaceRange(code, { line: 0, ch: 0 }, { line: editorRef.current.lineCount(), ch: 0 });
        }
      };

      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
      return () => socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
    }
  }, [socketRef.current]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption('readOnly', !isController);
    }
  }, [isController]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
