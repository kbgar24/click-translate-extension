// Set default target language
let lang = 'de';

// Set the default source language
let sourceLang = 'en-US';

// Set default speaking rate of 'Pronounce' feature
let rate = 1.0;

// Set default gender of 'Pronounce' voice
let gender = 'male';

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
  const id = clickData.menuItemId;
  const selection = clickData.selectionText;

  if (id === 'clickTranslate' && selection){
    translateViaGoogle(selection).then((translation) => {
      sendMessageToContentScript('translatedText', translation);
    });
  } else if (id === 'clickTranslate-pronounce'){
    chrome.tts.isSpeaking((status) => {
      if (status){
        chrome.tts.stop();
      } else {
        pronounceViaGoogle(selection);
      }
    });
  } else if (id === 'clickTranslate-translate' && selection) {
    translateViaGoogle(selection).then((translation) => {
      sendMessageToContentScript('translatedText', translation);
    });
  }
})

// Add Listener for messages from Content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.todo === 'translateText'){
    console.log('Selection from DOM: ', request.text);
    translateViaGoogle(request.text).then((translation) => {
        sendMessageToContentScript('translatedText', translation);
    });
  } else if (request.todo === 'updateLanguage'){
    console.log('updateLanguage request received!');
    lang = request.message;
  }
});

function sendMessageToContentScript(todo, message){
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    console.log('tabs', tabs);
    chrome.tabs.sendMessage(tabs[0].id, {todo, message});
  });
}

function translateViaGoogle(text) {
  return $.ajax({
    method: 'POST',
    url: 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyB7afMBsYGvO-3ShkOOSDmi8zKW01hV_ls',
    data: {
      q: text,
      target: lang
    }
  }).then((res) => {
    return res.data.translations[0].translatedText;
  });
};

function pronounceViaGoogle(text){
  chrome.tts.speak(text, {
    lang,
    rate,
    gender,
    onEvent: (event) => {
      console.log('event received!', event);
      if (event.type === 'start'){
        chrome.contextMenus.update('clickTranslate-pronounce', {
          title: 'Stop Pronounciation',
        });
      } else if (event.type === 'end') {
        chrome.contextMenus.update('clickTranslate-pronounce',{
          title: 'Pronounce Selection'
        });
      }
    }
  }, () => {
    if (chrome.runtime.lastError){
      console.error(chrome.runtime.lastError.message);
    }
  });
}
