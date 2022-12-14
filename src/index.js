import { createHtmlElement } from 'dom-utils';
import { EventEmitter } from 'event-emitter';
import detectSwipe from 'swipe-detection';
import './mobile-nav.css';
/*
  createMobileNav builds a nav bar based on passed menus object.
  object should have the form:
    [
      {
        // will be in h1
        menuTitle: 'sample title',
        menuLink: 'sample/link/path.html',
        // will be put in unordered list
        links: [
          {
            linkTitle: 'sample title',
            link: 'sample/link/path.html',
          }
        ]
      }
    ]
*/

function createMobileNav(menus) {
  if (menus === undefined) {
    return undefined;
  }

  const mobileNav = document.querySelector('.mobile-nav');
  const navWrapper = createHtmlElement({
    tag: 'div',
    classes: ['nav-wrapper'],
    properties: {
      style: `width: calc(100vw * ${menus.length});`,
    },
  });

  menus.forEach((item) => {
    const menuItem = createHtmlElement({
      tag: 'div',
      classes: ['menu-item'],
    });

    const menuTitle = createHtmlElement({
      tag: 'h1',
      classes: ['menu-title'],
      children: [
        createHtmlElement({
          tag: 'a',
          properties: {
            textContent: item.menuTitle,
            href: item.menuLink,
          },
        }),
      ],
    });

    const menuLinksDiv = createHtmlElement({
      tag: 'div',
      classes: ['menu-links'],
    });

    const menuLinksUl = createHtmlElement({
      tag: 'ul',
    });

    item.links.forEach((link) => {
      const linkLi = createHtmlElement({
        tag: 'li',
        children: [
          createHtmlElement({
            tag: 'a',
            properties: {
              textContent: link.linkTitle,
              href: link.link,
            },
          }),
        ],
      });

      menuLinksUl.appendChild(linkLi);
    });

    menuLinksDiv.appendChild(menuLinksUl);

    menuItem.appendChild(menuTitle);
    menuItem.appendChild(menuLinksDiv);

    navWrapper.appendChild(menuItem);
  });

  mobileNav.appendChild(navWrapper);

  const callback = function getSwipeDirection(direction) {
    EventEmitter.raiseEvent('navSwiped', direction);
  };
  detectSwipe(mobileNav, callback);

  return mobileNav;
}

const testLinks = [
  {
    linkTitle: 'One',
    link: '#',
  },
  {
    linkTitle: 'Two',
    link: '#',
  },
  {
    linkTitle: 'Three',
    link: '#',
  },
  {
    linkTitle: 'Four',
    link: '#',
  },
];

const nav = createMobileNav([
  {
    menuTitle: 'home',
    menuLink: '#',
    links: testLinks,
  },
  {
    menuTitle: 'about',
    menuLink: '#',
    links: testLinks,
  },
  {
    menuTitle: 'contact',
    menuLink: '#',
    links: testLinks,
  },
]);

const navWrapper = nav.querySelector('.nav-wrapper');
let swipes = 0;

function swipeLeft() {
  if (swipes === navWrapper.childElementCount - 1) {
    return;
  }
  swipes += 1;
  navWrapper.style.transform = `translateX(calc(${-swipes} * 100vw))`;
}

function swipeRight() {
  if (swipes === 0) {
    return;
  }
  swipes -= 1;
  navWrapper.style.transform = `translateX(calc(${-swipes} * 100vw))`;
}

function swipeDetected(direction) {
  if (direction === 'left') {
    swipeLeft();
  } else if (direction === 'right') {
    swipeRight();
  } else if (direction === 'down') {
    navWrapper.querySelectorAll('.menu-links')[swipes].classList.add('expanded');
  } else if (direction === 'up') {
    navWrapper.querySelectorAll('.menu-links')[swipes].classList.remove('expanded');
  }
}

EventEmitter.addEvent('navSwiped', swipeDetected);
