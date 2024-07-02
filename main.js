//globals
const darkOverlay = $('.darken-overlay')
const sidebarWrapper = $('.sidebar-wrapper')
const sidebar = $('.sidebar')
const sidebarBtn = $('.sidebar-btn')
console.log('wa')
//event listeners
$('.sidebar-btn').addEventListener('click', () => {
  showSidebar();
})

$('.sidebar-wrapper').addEventListener('click', (e) => {
  hideSidebar();
  console.log('clicked wrapper')
})

$('.sidebar').addEventListener('click', e => {
  e.stopPropagation(); //stops sidebar clickthrough to overlay which closed it previously
})


$('.sidebar ul').addEventListener('click', e => { //clicking sidebar options
  const target = e.target
  const option = target.dataset.option
  if (target.hasAttribute('active') || option == undefined) return;

  console.log(option);
})
//functions
function $(query) {
  return document.querySelector(query)
}

async function showSidebar() {
  darkOverlay.setAttribute('active', true)
  sidebarWrapper.style.display = 'flex'
  await wait(100);
  sidebar.setAttribute('active', true)
}

async function hideSidebar() {
  darkOverlay.removeAttribute('active')
  sidebar.removeAttribute('active',)
  await wait(100);
  sidebarWrapper.style.display = 'none'
}

async function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}