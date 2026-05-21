chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id!, { type: 'TOGGLE_WIDGET' })
    .catch(() => {
      // content script 아직 로드 안됐으면 무시
    })
})