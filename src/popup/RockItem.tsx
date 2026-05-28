import React from 'react'
import { AquariumItem } from './types'

type Props = {
  item: AquariumItem
  onClick: () => void
}

export const getRockX = (existingItems: AquariumItem[]) => {
  const rockWidth = 30  // 실제 표시 크기와 맞춤
  const gap = 10        // 돌 사이 여백
  const existingXs = existingItems
    .filter(i => i.type === 'rock' && i.rockX !== undefined)
    .map(i => i.rockX!)

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * (290 - rockWidth)
    const overlaps = existingXs.some(ex => Math.abs(ex - x) < rockWidth + gap)
    if (!overlaps) return x
  }
  return Math.random() * 260
}


export default function RockItem({ item, onClick }: Props) {
  return (
    <img
      src={item.imageUrl}
      onClick={onClick}
      style={{
        position: 'absolute',
        width: '30px',
        height: 'auto',
        left: item.rockX ?? 0,
        bottom: 0,
        cursor: 'pointer',
      }}
    />
  )
}
