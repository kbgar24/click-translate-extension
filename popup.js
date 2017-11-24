
let selection = $('#languageSelect').val();
console.log(selection);

$('#languageSelect').on('change', () => {
  updateLanguage($('#languageSelect').val());
});

function updateLanguage(languageCode){
  chrome.runtime.sendMessage({todo: 'updateLanguage', message: languageCode});
}
