document.addEventListener('DOMContentLoaded', function() {
  const checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {

      const form = document.createElement('form');
      form.action = 'http://gtmetrix.com/analyze.html?bm';
      form.method = 'post';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'url';
      input.value = tab.url;

      form.appendChild(i);
      document.body.appendChild(f);
      form.submit();
    });
  }, false);
}, false);
