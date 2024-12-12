import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css';

const App = () => {
  return (
    <div className='app'>
      <BrowserRouter>
        <nav>
          <h1>Header</h1>
          <ul>
            <li><Link to={'/'}>Login</Link></li>
            <li><Link to={'/profile'}>Profile</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function fetchUser() {
    setLoading(true);
    fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        password: password,
      })
    })
      .then(res => {
        if (res.status === 400) {
          setError('Invalid Credentials');
          throw new Error('404 not found')
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message) {
          setError(data.message);
        } else {
          const user = { token: data.accessToken, id: data.id }
          localStorage.setItem('userLogin', JSON.stringify(user));
          setLoading(false);
          setError('');
          navigate('/profile');
        }
      })
      .catch(error => {
        console.log(error.message);
        setLoading(false);
      })
  }
  function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('All* field is mandatory...');
    } else {
      // make api call for the corresponding data
      fetchUser();
      setUserName('');
      setPassword('');
    }
  }
  return (
    <div className='loginContainer'>
      <a href='https://dummyjson.com/users' target='_blank'>Click_me_Dummy_API_(Take help of API to login)</a>
      <h1>Login</h1>
      <form>
        <div className='formItem'>
          <label htmlFor='username'>Username</label><br />
          <input type='text' placeholder='John@123' value={username} onChange={(e) => { setUserName(e.target.value) }} />
        </div>
        <div className='formItem'>
          <label htmlFor='password'>Password</label><br />
          <input type='password' placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
        </div>
        <div className='forItem'>
          <p style={{ fontSize: '14px', color: "red", marginBottom: '10px' }}>{error}</p>
          <button onClick={(e) => { handleLogin(e) }}>{loading ? 'Loading...' : 'Login'}</button>
        </div>
      </form>
    </div>
  )
}

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('userLogin')) || null;
    if (user && user.id) {
      fetch(`https://dummyjson.com/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUser(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      console.error('User not found in localStorage or missing ID');
      setLoading(false);
      navigate('/');
    }
  }, []);

  function handleLogout(){
    localStorage.removeItem('userLogin');
    navigate('/');
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className='profileContainer'>
      {
        user && (
          <>
            <h1>Profile</h1>
            <div className='user'>
              <img src={user.image}/>
              <h1>{user.firstName} {user.lastName}</h1>
            </div>
            <p style={{margin: '12px 0px'}}><span style={{color: 'green'}}>email:</span> {user.email}</p>
            <p><span style={{color: 'green'}}>password:</span> {user.password}</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        )
      }
    </div>
  )
}