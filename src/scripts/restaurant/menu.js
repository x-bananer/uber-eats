(function () {

  const tabsBtn = document.querySelectorAll(".offers-menu__item");
  const tabsItems = document.querySelectorAll(".offers-section__content");

  const accBtn = document.querySelectorAll(".offers__title");
  const accItems = document.querySelectorAll(".offers__list");

  const mql = window.matchMedia("(max-width: 767px)");

  window.onresize = function () {
    menuChange()
  }

  function menuChange() {
    if (mql.matches) {
      accBtn.forEach(onAccClick);

      tabsItems.forEach(function (item) {
        item.classList.add("active")
      });
    } else {
      tabsBtn.forEach(onTabClick);
    }
  }

  function onTabClick(item) {
    item.addEventListener("click", function () {
      let currentBtn = item;
      let tabId = currentBtn.getAttribute("data-tab");
      let currentTab = document.querySelector(tabId);

      if (!currentBtn.classList.contains("offers-menu__item-active")) {
        tabsBtn.forEach(function (item) {
          item.classList.remove("offers-menu__item-active")
        });

        tabsItems.forEach(function (item) {
          item.classList.remove("active")
        });

        currentBtn.classList.add("offers-menu__item-active");
        currentTab.classList.add("active");
      }
    });
  }

  function onAccClick(item) {
    item.addEventListener("click", function () {
      const content = item.nextElementSibling;

      if (content.classList.contains("active-item")) {
        content.classList.remove("active-item");
      } else {
        accItems.forEach(function (item) {
          item.classList.remove("active-item")
        });
        content.classList.add("active-item");
      }
    })

  }

  menuChange();
})()