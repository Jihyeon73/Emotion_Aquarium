export type ItemType = 'fish' | 'rock'


export type AquariumItem = {
  id: number
  type: ItemType
  imageUrl: string
  memo: string
  createdAt: string
  rockX?: number  // 돌 전용 x 위치
}
