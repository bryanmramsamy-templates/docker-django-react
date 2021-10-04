import React from 'react';


const LogoutButton = () => {
  const handleOnLogout = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <button onClick={ handleOnLogout }>LOGOUT</button>
  );
}


export default LogoutButton;
