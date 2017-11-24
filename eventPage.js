// Set default currentLanguage
let currentLanguage = 'de';

// Build menu for Chrome Context Menu
const menuItem = {
  id: 'clickTranslate',
  title: 'ClickTranslate',
  contexts: ['selection']
};

const subMenuItemPronounce = {
  id: 'clickTranslate-pronounce',
  title: 'Pronouce Selection',
  parentId: 'clickTranslate',
  contexts: ['selection']
}

const subMenuItemTranslate = {
  id: 'clickTranslate-translate',
  title: 'Translate Selection',
  parentId: 'clickTranslate',
  contexts: ['selection']
}

// Create new menu item
chrome.contextMenus.create(menuItem);
chrome.contextMenus.create(subMenuItemPronounce);
chrome.contextMenus.create(subMenuItemTranslate);

// Add click handler to menu item
chrome.contextMenus.onClicked.addListener((clickData) => {
  if (clickData.menuItemId === 'clickTranslate' && clickData.selectionText){
    translateViaGoogle(clickData.selectionText, currentLanguage).then((translation) => {
      sendMessageToContentScript('translatedText', translation);
    });
  }
})

// Add Listener for messages from Content.js
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
