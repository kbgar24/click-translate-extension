console.log('content.js loaded!');

document.body.ondblclick = () => {
  console.log('double click!');
  const selection = window.getSelection().toString();
  console.log('selection: ', selection);
  if (selection) {
    chrome.runtime.sendMessage({todo: 'translateText', text: selection});
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.todo === 'consoleLog'){
    console.log('Background Page message: ', request.message);
  }
});
