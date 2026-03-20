import React from 'react';

function LinkList() {
  return (
    
<div className="card-container">

  <input  className="addLinkInput" placeholder=" + Add New Link "></input>
  <button className="addBtn"> Add</button>
  <div class="card profile-card">
    
    <h3 class="card-title">LinkedIn</h3>
    <p class="card-subtitle">linkedin.com/in/yourprofile</p>
    <button className='btn'>Edit</button>
    <button className='btn'>Copy</button>
    <button className='btn'>Delete</button>
  </div>

  
  <div class="card youtube-card">

    <h3 class="card-title">YouTube</h3>
    <p class="card-subtitle">youtube.com/yourchannel</p>
    <button className='btn'>Edit</button>
    <button className='btn'>Copy</button>
    <button className='btn'>Delete</button>
  </div>

  
  <div class="card instagram-card">
    <h3 class="card-title">Instagram</h3>
    <p class="card-subtitle">@yourhandle</p>
    <button className='btn'>Edit</button>
    <button className='btn'>Copy</button>
    <button className='btn'>Delete</button>
  </div>
</div>
  );
}

export default LinkList;