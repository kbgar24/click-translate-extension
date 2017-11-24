// Build menu for Chrome Context Menu
const menuItem = {
  id: 'clickTranslate',
  title: 'ClickTranslate',
  contexts: ['selection']
};

let currentLanguage = 'de';

function sendMessageToContentScript(todo, message){
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    console.log('tabs', tabs);
    chrome.tabs.sendMessage(tabs[0].id, {todo, message});
  });
}

function translateViaGoogle(text, language) {
  return $.ajax({
    method: 'POST',
    url: 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyB7afMBsYGvO-3ShkOOSDmi8zKW01hV_ls',
    data: {
      q: text,
      target: language
    }
  }).then((res) => {
    const translatedText = res.data.translations[0].translatedText;
    return res.data.translations[0].translatedText;
  });
};

// Create new menu item
chrome.contextMenus.create(menuItem);

// Add click handler to menu item
chrome.contextMenus.onClicked.addListener((clickData) => {
  if (clickData.menuItemId === 'clickTranslate' && clickData.selectionText){
    translateViaGoogle(clickData.selectionText, currentLanguge).then((translation) => {
      sendMessageToContentScript('translatedText', translation);
    });
  }
})

// Add Listener for Selection from Content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.todo === 'translateText'){
    console.log('Selection from DOM: ', request.text);
    translateViaGoogle(request.text, currentLanguage).then((translation) => {
        sendMessageToContentScript('translatedText', translation);
    });
  } else if (request.todo === 'updateLanguage'){
    console.log('updateLanguage request received!');
    currentLanguage = request.message;
  }
});
