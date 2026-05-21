import React from 'react'

const fish = chrome.runtime.getURL('fishes/fish1.png')

export default function Popup() {
  return (
    <div style={{
      width: '320px',
      height: '400px',
      background: '#fff',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <h3>내 위젯 🎉</h3>
      <button onClick={() => window.close()}>닫기</button>
      <img src={fish} alt="" style={{ width: '100%' }} />
    </div>
  )
}
