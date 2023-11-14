import React from 'react'
import DarkMode from '../components/DarkMode';
import { Row, Col } from 'react-bootstrap';
import { Button } from '@mui/material';
import background from '../images/docBgImg.jpg'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div 
      style={{ 
        backgroundImage: `url(${background})`,
        backgroundSize:'cover'
      }}
    >
      <DarkMode />
      <div
        style={{ height: '91vh' }}
        className='d-flex align-items-center justify-content-center p-5'
      >
        <Row className='w-100 d-flex align-items-center justify-content-center'>
          <Col sm={12} md={6} className='p-5'>
            <div className='d-flex align-items-center justify-align-content-start p-3'>
              <i className="fa-regular fa-folder-open fa-beat-fade fs-1 me-3 text-black"></i>              
              <h1 style={{fontSize:'3rem'}} className='fw-bold text-black'>DocsApp</h1>
            </div>
            <div className='w-100'>
              <p style={{fontSize:'2rem', fontFamily:'Cinzel Decorative'}} className='text-black'>Fell Free To Create Your Own Documents</p>
            </div>
            <Button variant="outlined" className='fw-bold shadow'>
              <Link to={'/login'} style={{textDecoration:'none'}}>
              Gets start<i class="fa-solid fa-arrow-right ms-2"></i>
              </Link>
            </Button>  
          </Col>
          <Col sm={12} md={6}></Col>
        </Row>
      </div>
    </div>
  )
}

export default Home