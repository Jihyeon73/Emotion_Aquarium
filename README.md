# My Widget - 크롬 확장 프로그램

---

## 시작하기

### 1. 클론

```bash
git clone https://github.com/유저명/레포이름.git
cd 레포이름
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 빌드

```bash
npm run build
```

### 4. 크롬에 설치

1. 크롬 주소창에 `chrome://extensions/` 입력
2. 우측 상단 **개발자 모드** ON
3. **압축해제된 확장 프로그램 로드** 클릭
4. 프로젝트 폴더 안의 `dist/` 폴더 선택

### 5. 실행

아무 웹사이트 접속 후 우측 상단 확장 프로그램 아이콘 클릭

---

## 개발

코드 수정 후 아래 순서로 반영

```bash
npm run build
```

`chrome://extensions/` 에서 🔄 새로고침 버튼 클릭

---

## 폴더 구조

```
my-extension/
├── manifest.json         # 확장 프로그램 설정
├── vite.config.ts
├── public/
│   └── icons/            # 확장 프로그램 아이콘
└── src/
    ├── popup/
    │   ├── index.tsx     # 위젯 마운트 진입점
    │   └── Popup.tsx    # 위젯 UI
    └── background/
        └── index.ts      # 서비스 워커
```

---

## 기술 스택

- React + TypeScript
- Vite
- CRXJS (크롬 확장 빌드 플러그인)