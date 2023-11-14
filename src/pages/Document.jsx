import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './Document.css';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  doc,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';

function Document() {
  const [show, setShow] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [userDocuments, setUserDocuments] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreateDocument = async () => {
    try {
      const userId = auth.currentUser.uid;
      const db = getFirestore();
      const userDocRef = doc(db, 'users', userId);
      const userDocumentsCollection = collection(userDocRef, 'documents');

      await addDoc(userDocumentsCollection, {
        name: documentName,
        content: '',
      });

      await fetchUserDocuments(userId);

      handleClose();
    } catch (error) {
      console.error('Error creating document:', error.message);
    }
  };

  const fetchUserDocuments = async (userId) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', userId);
      const userDocumentsQuery = collection(userDocRef, 'documents');
      const querySnapshot = await getDocs(userDocumentsQuery);

      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        content: doc.data().content
      }));

      setUserDocuments(documents);
    } catch (error) {
      console.error('Error fetching user documents:', error.message);
    }
  };

  const handleDocDelete = async (documentId) => {
    try {
      const userId = auth.currentUser.uid;
      const db = getFirestore();

      const userDocRef = doc(db, 'users', userId);
      const userDocumentsCollection = collection(userDocRef, 'documents');
      const documentRef = doc(userDocumentsCollection, documentId);

      const isConfirmed = window.confirm(
        'Are you sure you want to delete this document?'
      );

      if (isConfirmed) {
        await deleteDoc(documentRef);
        await fetchUserDocuments(userId);
      }
    } catch (error) {
      console.error('Error deleting document:', error.message);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDocuments(user.uid);
      } else {
        setUserDocuments([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <>
      <div className='d-flex flex-column align-items-center justify-content-center'>
        <div
          className='add-box d-flex align-items-center justify-content-center mt-4 mb-3 p-2 rounded border border-1 border-secondary shadow'
          onClick={handleShow}
        >
          <h4 className='mt-2'>Add Documents</h4>
          <i className="fa-solid fa-file-circle-plus ms-3 fs-5"></i>
        </div>

        <Modal className='' show={show} onHide={handleClose} backdrop='static' keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Document Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              className='custom-input'
              size='lg'
              type='text'
              placeholder='Enter Document Name'
              onChange={(e) => setDocumentName(e.target.value)}
            />
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button variant='primary' onClick={handleCreateDocument}>
              Create Document
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className='px-5 m-5'>
        <Row>
          {userDocuments?.map((document) => (
            <Col key={document.id} sm={12} md={6} lg={4} className='mb-3'>
              <div style={{height:'240px',overflow:'scroll'}} className='p-3 border border-secondary rounded shadow'>
                <div className='d-flex justify-content-between align-items-center'>
                  <h4>{document.name}</h4>
                  <span>
                    <Link to={`/document/quill/${document.id}`}>
                      <i className='fa-regular fa-pen-to-square mx-2'></i>
                    </Link>
                    <i
                      className='fa-solid fa-trash text-danger mx-2'
                      onClick={() => handleDocDelete(document.id)}
                    ></i>
                  </span>
                </div>
                <div
                  className='document-content'
                  dangerouslySetInnerHTML={{ __html: document.content }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Document;
