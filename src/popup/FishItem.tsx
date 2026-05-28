import React, { useState, useEffect, useRef } from 'react'
import { AquariumItem } from './types'

type Props = {
  item: AquariumItem
  onClick: () => void
}

export default function FishItem({ item, onClick }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [flipped, setFlipped] = useState(false)
  const stateRef = useRef({
    x: Math.random() * 200,
    y: 50 + Math.random() * 80,
    direction: Math.random() > 0.5 ? 1 : -1,
    speed: 0.3 + Math.random() * 0.3,
    t: Math.random() * Math.PI * 2,
    amplitude: 10 + Math.random() * 10,
    waiting: false,
  })

  useEffect(() => {
    let animFrame: number
    const s = stateRef.current
    setFlipped(s.direction === 1)  // 초기 방향 설정

    const animate = () => {
      if (!s.waiting) {
        s.t += 0.04
        s.x += s.direction * s.speed

        // 오른쪽으로 화면 밖
        if (s.x > 360) {
          s.waiting = true
          setTimeout(() => {
            s.x = -60
            s.direction = 1
            setFlipped(true)
            s.waiting = false
          }, 2000)
        }

        // 왼쪽으로 화면 밖
        if (s.x < -60) {
          s.waiting = true
          setTimeout(() => {
            s.x = 380
            s.direction = -1
            setFlipped(false)
            s.waiting = false
          }, 2000)
        }

        const y = s.y + Math.sin(s.t) * s.amplitude
        setPos({ x: s.x, y })
      }

      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <img
      src={item.imageUrl}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        height: '40px',
        width: 'auto',
        transform: flipped ? 'scaleX(-1)' : 'scaleX(1)',
        cursor: 'pointer',
      }}
    />
  )
}
