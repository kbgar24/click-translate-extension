
let selection = $('#languageSelect').val();
console.log(selection);

$('#languageSelect').on('change', () => {
  newLanguage = $('#languageSelect').val();
  updateLanguage(newLanguage);
});

function updateLanguage(languageCode){
  chrome.runtime.sendMessage({todo: 'updateLanguage', message: languageCode});
}
