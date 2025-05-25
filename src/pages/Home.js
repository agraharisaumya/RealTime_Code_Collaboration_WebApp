import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Created a new room');
  };

  const joinRoom = async () => {
    if (!roomId || !username) {
      toast.error('ROOM ID & Username is required');
      return;
    }

    try {
      // ✅ Call API to check if username exists in the database
      const response = await fetch('http://localhost:5000/api/checkusername', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Username verified! Joining room...');
        navigate(`/editor/${roomId}`, {
          state: { username },
        });
      } else {
        toast.error(data.message || 'Sign up first to join a room.');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      toast.error('Server error. Please try again.');
    }
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img className="homePageLogo" src='/Logo.png' alt='SynCode Logo' />
        <h4 className="mainLabel">Paste invitation Room ID</h4>
        <div className="inputGroup">
          <input 
            type="text" 
            className='inputBox' 
            placeholder='Room ID' 
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input 
            type="text" 
            className='inputBox' 
            placeholder='Username' 
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button className='btn joinBtn' onClick={joinRoom}>Join</button>
          <span className='createInfo'>
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="/" className='createNewBtn'>
              new room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
