import React, { useState, useEffect, useRef } from 'react'
import { AquariumItem, ItemType } from './types'
import FishItem from './FishItem'
import RockItem, { getRockX } from './RockItem'


const bg = chrome.runtime.getURL('./BGImg.png')
const addBtn = chrome.runtime.getURL('icons/addBtn.png')
const delBtn = chrome.runtime.getURL('icons/delBtn.png')


type PanelMode = null | 'add' | 'remove' | 'item'

export default function Popup() {

  // 추가,삭제 버튼 클릭에 대한 상태
  const [mode, setMode] = useState<PanelMode>(null)
  const [memo, setMemo] = useState('')
  const [feeling, setFeeling] = useState<'good'|'bad'>('good')
  const [element, setElement] = useState<AquariumItem | null>(null)
  const [memoVisible, setMemoVisible] = useState(false)
  const [visible, setVisible] = useState(true)
  const [limitAlert, setLimitAlert] = useState(false)


  const AQUARIUM_HEIGHT = 200

  // 물고기 돌
  const [items, setItems] = useState<AquariumItem[]>([])
  const FISH_IMAGES = ['fishes/fish_2.png','fishes/fish_3.png','fishes/fish_4.png','fishes/fish_5.png','fishes/fish_6.png','fishes/fish_7.png','fishes/fish_8.png' ]
  const ROCKS_IMAGES = ['rocks/rock_1.png', 'rocks/rock_2.png','rocks/rock_3.png' ]

  const fishIndexRef = useRef(0)
  const rockIndexRef = useRef(0)

  const getNextImage = (type: ItemType) => {
    const list = type === 'fish' ? FISH_IMAGES : ROCKS_IMAGES
    const ref = type === 'fish' ? fishIndexRef : rockIndexRef
    const image = list[ref.current % list.length]
    ref.current += 1
    return chrome.runtime.getURL(image)
  }


  // 물고기,돌 추가하기
  const handleCreate = () => {
    const type : ItemType = feeling === 'good' ? 'fish' : 'rock'
    const typeCount = items.filter(i => i.type === type).length
    if (typeCount >= 7) {
      setMode(null)
      setLimitAlert(true)
      setTimeout(() => setLimitAlert(false), 2500)
      return
    }
    const newItem: AquariumItem = {
      id :Date.now(),
      type,
      imageUrl: getNextImage(type),
      memo,
      createdAt: new Date().toLocaleDateString('ko-KR'),
      rockX: type === 'rock' ? getRockX(items) : undefined,
    }
    const updated = [...items, newItem]
    setItems(updated)
    chrome.storage.local.set({ items: updated })
    setMode(null)
    setMemo('')
  }

  // 삭제하기
  const handleRemove = () => {
    if (!element) return
    const updated = items.filter(item => item.id !== element.id)
    setItems(updated)
    chrome.storage.local.set({ items: updated })
    setElement(null)
    setMode(null)
  }

  useEffect(() => {
    chrome.storage.local.get('items', (result) => {
      if (result.items) setItems(result.items)
    })
  }, [])


  const handleItemClick = (item: AquariumItem) => {
      if (mode === 'remove') {
        setElement(item)
      } else if(mode === null || mode === 'item'){
        setElement(item)
        setMode('item')
      }
    }

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(prev => !prev)
    }, 1000) // 1초마다 토글
    return () => clearInterval(interval)
  }, [])


  return (
    <div style={{
      width: '360px',
      height: 'auto',
      // background: '#fff',
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontSize:'16px'
    }}>
      {/* 어항 */}
      <div
        onClick={() => setMode(null)}
        style={{
          height: `${AQUARIUM_HEIGHT}px`,
          backgroundImage:`url(${bg})`,
          backgroundSize:'cover',
          backgroundPosition:'center',
          backgroundRepeat:'no-repeat',
          position:'relative'
        }}>
          {/* {element ? (
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              textAlign: 'center',
              transition: 'opacity 0.5s ease',
              fontSize:'14px',
              backgroundColor:'#ACD473',
              padding:'0 14px'
            }}>
              {element.memo.length > 20 ? element.memo.slice(0, 20) + '...' : element.memo}
            </div>
          ) : ( */}
          {limitAlert && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              fontSize: '13px',
              backgroundColor: 'rgba(0,0,0,0.55)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              zIndex: 10,
              pointerEvents: 'none',
            }}>
              Your aquarium is full!
            </div>
          )}
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              textAlign: 'center',
              fontSize:'14px',
              transition: 'opacity 0.8s ease',
            }}>
              Click your fish
            </div>
        

          {items.map((item) => (
            item.type === 'fish'
              ? <FishItem
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              : <RockItem
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
          ))}
        </div>

      {/* 추가, 삭제 버튼 */}
      <div 
        style={{
          display:'flex',
          gap:'4px',
          position:'absolute',
          top:'32px',
          right:'16px'
        }}
      >
        <button 
          style={buttonStyle}
          onClick={() => setMode(prev => prev === 'add' ? null : 'add')}>
          <img 
            style={{
              width:'10px',
              height:'auto'
            }}
          src={addBtn} alt="" />
        </button>
        <button 
          style={buttonStyle}
          onClick={() => (setMode(prev => prev === 'remove' ? null : 'remove'), setElement(null))}>
          <img 
            style={{
              width:'10px',
              height:'auto'
            }}
            src={delBtn} alt="" />
        </button>
      </div>

      {/* 버튼 클릭에 따른 패널 */}
      {mode === 'add' && (
        <div style={panelStyle}>
          <div style={{ width:'100%',padding:'0 24px'}}>
            <div style={{width:'100%',display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
              <span>Express your feeling!</span>
              <div style={radioBtn}>
                <label style={radioBtn}>
                  <input type="radio" value="good" checked={feeling === 'good'} onChange={() => setFeeling('good')} />
                  good
                </label>
                <label style={radioBtn}>
                  <input type="radio" value="good" checked={feeling === 'bad'} onChange={() => setFeeling('bad')} />
                  bad
                </label>
              </div>
            </div>
            <div>
              <input
                style={{
                  width:'100%',
                  resize:'none',
                  overflow:'hidden'
                }}
                type='text'
                maxLength={80}
                value={memo} 
                onChange={(e) => setMemo(e.target.value)}/>
            </div>
          </div>
          <button 
            style={{width:'100px', fontSize:'16px'}}
            onClick={handleCreate}>Create</button>
        </div>
      )}

      {mode === 'remove' && (
        <div style={panelStyle}>
            {element ? (
              <div style={{ width:'100%', padding:'0 24px', display:'flex', gap:'10px', flexDirection:'column', alignItems:'center'}}>
                <div style={{marginBottom:'10px', width:'100%'}}>Are you sure<br></br> you want to Let this fish Go?</div>
                <div style={{width:'100%'}}>
                  <div 
                    style={{
                        display:'flex',
                        justifyContent:'space-between',
                        marginBottom:'10px',
                        width:'100%'
                    }}
                  >
                    <span>My Memo</span>
                    <span>{element.createdAt}</span>
                  </div>
                  <div 
                    style={{
                        wordBreak:'break-word',
                        height:'auto',
                        width:'100%'
                        
                    }}
                  >
                    {element.memo}</div>
                </div>
                <button 
                  style={{width:'100px', fontSize:'16px'}}
                  onClick={handleRemove}>Good Bye</button>

              </div>
            ) : (
              <div>
                <div style={{textAlign:'center'}}>Please click the fish you want to delete</div>
              </div>
            )}
          </div>
      )}

      {mode === 'item' && (
        <div
          onClick={() => { setMode(null); setElement(null) }}
          style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        />
      )}

      {mode === 'item' && element && (
        <div style={{ ...panelStyle, position: 'relative', zIndex: 1 }}>
          <div style={{ width:'100%', padding:'0 24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px', width:'100%' }}>
              <span>My Memo</span>
              <span>{element.createdAt}</span>
            </div>
            <div style={{ wordBreak:'break-word', width:'100%' }}>
              {element.memo}
            </div>
          </div>
        </div>
      )}


   
    </div>
  )
}


const panelStyle : React.CSSProperties = {
  padding:'14px 0',
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  gap:'24px',
  flexDirection:'column',
  width:'100%'
}


const buttonStyle : React.CSSProperties = {
  width:'18px',
  height:'18px',
  display:'flex',
  alignItems: 'center',
  justifyContent:'center',
  backgroundColor:'#8FB35D',
  border: 'none',
  outline: 'none' 
}

const radioBtn : React.CSSProperties = {
  display : 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}