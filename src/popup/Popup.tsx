import React, { useState, useEffect } from 'react'
import { AquariumItem, ItemType } from './types'
import FishItem from './FishItem'
import RockItem, { getRockX } from './RockItem'


const fish = chrome.runtime.getURL('fishes/fish1.png')

type PanelMode = null | 'add' | 'remove'

export default function Popup() {

  // 추가,삭제 버튼 클릭에 대한 상태
  const [mode, setMode] = useState<PanelMode>(null)
  const [memo, setMemo] = useState('')
  const [feeling, setFeeling] = useState<'good'|'bad'>('good')
  const [element, setElement] = useState<AquariumItem | null>(null)
  const [memoVisible, setMemoVisible] = useState(false)


  // 스타일
  const AQUARIUM_HEIGHT = 200 //어항 높이
  const PANEL_HEIGHT = mode !== null ? 80 : 0 //패널 높이
  const totalHeight = AQUARIUM_HEIGHT + PANEL_HEIGHT + 80 //패널 클릭시 늘어나는 높이 계산

  // 물고기 돌 
  const [items, setItems] = useState<AquariumItem[]>([])
  const FISH_IMAGES = ['fishes/fish_1.png','fishes/fish_2.png','fishes/fish_3.png','fishes/fish_4.png','fishes/fish_5.png','fishes/fish_6.png','fishes/fish_7.png','fishes/fish_8.png' ]
  const ROCKS_IMAGES = ['rocks/rock_1.png', 'rocks/rock_2.png','rocks/rock_3.png' ]

  // 이미지 랜덤으로 넣기
  const getRandomImage = (type: ItemType) => {
    const list = type === 'fish' ? FISH_IMAGES : ROCKS_IMAGES
    const random = list[Math.floor(Math.random() * list.length)]
    return chrome.runtime.getURL(random)
  }


  // 물고기,돌 추가하기
  const handleCreate = () => {
    const type : ItemType = feeling === 'good' ? 'fish' : 'rock'
    const newItem: AquariumItem = {
      id :Date.now(),
      type,
      imageUrl: getRandomImage(type),
      memo,
      createdAt: new Date().toLocaleDateString('ko-KR'),
      rockX: type === 'rock' ? getRockX(items) : undefined,
    }
    const updated = [...items, newItem]
    setItems(updated)
    chrome.storage.local.set({ items: updated })
    setMode(null)
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
      } else {
        setElement(item)
        setMemoVisible(true)
        setTimeout(() => setMemoVisible(false), 2000)   // 2초 후 페이드아웃 시작
        setTimeout(() => setElement(null), 2500)         // 페이드아웃 끝나면 제거
      }
    }


  return (
    <div style={{
      width: '320px',
      height: `${totalHeight}px`,
      background: '#fff',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {/* 어항 */}
      <div
        style={{
          height: `${AQUARIUM_HEIGHT}px`,
          backgroundColor:'#ACD473',
          position:'relative'
        }}>
          {element && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              textAlign: 'center',
              opacity: memoVisible ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}>
              {element.memo}
            </div>
          )}

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
      <div className='flex gap-2'>
        <button onClick={() => setMode(prev => prev === 'add' ? null : 'add')}>+</button>
        <button onClick={() => setMode(prev => prev === 'remove' ? null : 'remove')}>-</button>
      </div>

      {/* 버튼 클릭에 따른 패널 */}
      {mode === 'add' && (
        <div style={panelStyle}>
          <span>Are you sure<br></br> you want to Let this fish Go?</span>
          <div>
            <div className='flex justify-between'>
              <span>express your feeling!</span>
              <div>
                <input type="radio" value="good" checked={feeling === 'good'} onChange={() => setFeeling('good')} />
                <input type="radio" value="bad" checked={feeling === 'bad'} onChange={() => setFeeling('bad')} />
              </div>
            </div>
            <div>
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)}></textarea>
            </div>
          </div>
          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      {mode === 'remove' && (
        <div style={panelStyle}>
          <span>Are you sure<br></br> you want to Let this fish Go?</span>
          <div>
            {element ? (
              <div>
                <span>{element.memo}</span>
                <span>{element.createdAt}</span>
              </div>
            ) : (
              <div>
                <h1>삭제할 물고기를 클릭해주세요</h1>
              </div>
            )}
          </div>
          <button onClick={handleRemove}>Good Bye</button>
        </div>
      )}

      

      
    </div>
  )
}


const panelStyle : React.CSSProperties = {
  // background: '#f9f9f9',
  borderRadius: '10px',
  padding: '12px',
  border: '1px solid #eee',
}
