(function () {
  document.querySelector('#search').oninput = function () {
    let val = this.value.trim();
    let searchItems = document.querySelectorAll('.feature');

    if (val != '' && val != '•') {
      searchItems.forEach(function (elem) {

        if (
          elem.innerText.toLowerCase().search(val) == -1
          && elem.innerText.search(val) == -1
        ) {
          elem.classList.add('hide')
        }
        else {
          elem.classList.remove('hide');
        }
      });
    }
    else {
      searchItems.forEach(function (elem) {
        elem.classList.remove('hide');
      });
    }
  }
})()
