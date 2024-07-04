//globals
const editor = {
  current_model: "Landie",
  current_transition: null,
  current_emotion: null,
};

let activePage = "editor";
$('[data-page="editor"]').style.display = "block"; //debug

//event listeners
$(".carousel.models").addEventListener("click", e => {
  const target = e.target;
  const isDelete = target.classList.contains("danger");
  if (isDelete) {
    const modelId = target.closest("[data-model-id]").dataset.modelId;
    console.log(modelId);
  }
});

$(".sidebar-btn").addEventListener("click", () => {
  showSidebar();
});

$(".sidebar-wrapper").addEventListener("click", e => {
  hideSidebar();
  console.log("clicked wrapper");
});

$(".sidebar").addEventListener("click", e => {
  e.stopPropagation(); //stops sidebar clickthrough to overlay which closed it previously
});

$(".sidebar ul").addEventListener("click", e => {
  //clicking sidebar options
  const target = e.target;
  const option = target.dataset.option;
  if (target.hasAttribute("active") || option == undefined) return;

  changePage(option);
});

//functions
function changePage(page) {
  //hide current page
  $(`[data-page="${activePage}"]`).style.display = "none";
  $(`.sidebar ul [data-option="${activePage}"]`).removeAttribute("active");

  $(`[data-page="${page}"]`).style.display = "block";
  $(`.sidebar ul [data-option="${page}"]`).setAttribute("active", true);
  activePage = page;

  updateHeader(page);

  //update sidebar
  hideSidebar();
}

function updateHeader(id) {
  let innerHeaderHtml;
  switch (id) {
    case "editor":
      innerHeaderHtml = `<i class="bi bi-pencil-fill"></i> Editor`;
      break;
    case "home":
      innerHeaderHtml = `🏠 Home`;
      break;
    case "volume_points":
      innerHeaderHtml = `🗣 Volume Points`;
      break;
    case "layers":
      innerHeaderHtml = `📰 Layers`;
      break;
    case "settings":
      innerHeaderHtml = `⚙ Settings`;
      break;
    default:
      innerHeaderHtml = `❓ ???`;
      break;
  }
  $('.header h1').innerHTML = innerHeaderHtml;
}

function updateBreadcrumbs() {
  const breadcrumbs = strToHTML(`
      <nav class="breadcrumb editor">
        <button>◀</button>
        <div>📦</div>
      </nav>
    `);
  let currentModel;
  let currentTransition;
  let currentEmotion;

  if (editor.current_model !== null) {
    currentModel = document.createElement("p");
    currentModel.innerText = editor.current_model;
    breadcrumbs.appendChild(currentModel);
  }

  if (editor.current_emotion !== null) {
    breadcrumbs.appendChild(strToHTML(`<div>/</div>`));
    breadcrumbs.appendChild(strToHTML(`<div>🙂</div>`));
    currentEmotion = document.createElement("p");
    currentEmotion.innerText = editor.current_emotion;
    breadcrumbs.appendChild(currentEmotion);
  }

  if (editor.current_transition !== null) {
    breadcrumbs.appendChild(strToHTML(`<div>/</div>`));
    breadcrumbs.appendChild(strToHTML(`<div>⏯</div>`));
    currentTransition = document.createElement("p");
    currentTransition.innerText = editor.current_transition;
    breadcrumbs.appendChild(currentTransition);
  }

  replaceNode($(".breadcrumb.editor"), breadcrumbs);
}

async function showSidebar() {
  $(".darken-overlay").setAttribute("active", true);
  $(".sidebar-wrapper").style.display = "flex";
  await wait(100);
  $(".sidebar").setAttribute("active", true);
}

async function hideSidebar() {
  $(".darken-overlay").removeAttribute("active");
  $(".sidebar").removeAttribute("active");
  await wait(100);
  $(".sidebar-wrapper").style.display = "none";
}

//functions (util)
function $(query) {
  return document.querySelector(query);
}

async function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function replaceNode(original, newNode) {
  original.parentNode.replaceChild(newNode, original);
}

/**
 * Parses HTML contained in a string to a HTML Node
 *
 * @param   htmlString  String containing HTML to parse
 * @returns NodeElement of parsed HTML string
 */
function strToHTML(htmlString) {
  const parser = new DOMParser();
  const parsedHTML = parser.parseFromString(htmlString, "text/html");
  return parsedHTML.body.firstChild;
}
