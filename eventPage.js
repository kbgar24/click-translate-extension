// Build menu for Chrome Context Menu
const menuItem = {
  id: 'clickTranslate',
  title: 'ClickTranslate',
  contexts: ['selection']
};

// Create new menu item
chrome.contextMenus.create(menuItem);

// Add click handler to menu item
chrome.contextMenus.onClicked.addListener((clickData) => {
  if (clickData.menuItemId === 'clickTranslate' && clickData.selectionText){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      console.log('tabs', tabs);
      chrome.tabs.sendMessage(tabs[0].id, {todo: 'consoleLog', message: clickData.selectionText});
    });
    console.log('message sent!', clickData.selectionText);
  }
})

// Add Listener for Selection from Content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.todo === 'translateText'){
    console.log('Selection from DOM: ', request.text);
    $.ajax({
      method: 'POST',
      url: 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyB7afMBsYGvO-3ShkOOSDmi8zKW01hV_ls',
      data: {
        q: request.text,
        target: 'de'
      }
    }).done((msg) => {
      console.log(msg);
    });
  }
});
