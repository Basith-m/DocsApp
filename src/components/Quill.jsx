import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Quill.css';
import { auth } from '../firebase/firebase-config';
import { collection, doc, getFirestore, getDoc, setDoc} from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

function Quill() {

  const [content, setContent] = useState('');
  const [documentName, setDocumentName] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Extracts the documentId from the URL

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, proceed with fetching content
        fetchDocumentContent(user.uid);
      } else {
        // User is not authenticated, handle accordingly
      }
    });

    return () => {
      unsubscribeAuth(); // Unsubscribe when the component unmounts
    }
  }, [id]);

  const handleChange = (html) => {
    setContent(html);
  };

  const fetchDocumentContent = async (userId) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', userId);
      const documentRef = doc(collection(userDocRef, 'documents'), id);

      const docSnap = await getDoc(documentRef); 
      if (docSnap.exists()) {
        const documentData = docSnap.data();
        setContent(documentData.content || '');
        setDocumentName(documentData.name || ''); 
      }
    } catch (error) {
      console.error('Error fetching document content:', error.message);
    }
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser.uid;
      const db = getFirestore();
      const userDocRef = doc(db, 'users', userId);
      const documentRef = doc(userDocRef, 'documents', id);

      // Update the document with the new content from the state
      await setDoc(documentRef, { content, name: documentName });

      // Navigate back to Document.jsx
      navigate('/document');
    } catch (error) {
      console.error('Error saving content:', error.message);
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],  // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],          // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],     // outdent/indent
      [{ 'direction': 'rtl' }],                    // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],    // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                   // remove formatting button
      ['link', 'image'],                          // link and image
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background',
  ];
  return (
    <div style={{ position: 'relative' }} className='p-5'>
      <ReactQuill
        className='text-center'
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
      <div className='mt-3 d-flex align-items-center'>
        <button
          className='btn btn-info fw-bold'
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Quill;
