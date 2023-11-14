import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Auth from './components/Auth';
import Document from './pages/Document';
import Quill from './components/Quill';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth register />} />
        <Route path='/document' element={<Document />} />
        <Route path='/document/quill/:id' element={<Quill />} />
      </Routes>
    </div>
  );
}

export default App;
