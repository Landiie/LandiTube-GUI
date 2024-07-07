//globals
const html = (strings, ...values) => String.raw({ raw: strings }, ...values); //allows html tagging for template literals
let mData = {};
let sammiDir = '';
const editor = {
  current_model: null,
  current_transition: null,
  current_emotion: null,
};

const subpages = {
  editor: {
    active: null,
    default: "models",
  },
  settings: {
    active: null,
    default: "models",
  },
};

const contextMenu = {
  type: null,
  data: null,
};

let activePage = null;

startup();

async function startup() {
  await loadLandiTubeModels();
  console.log(mData);
  loadModelCaro();

  //initial page startup
  changePage("editor");
}

//event listeners
document.addEventListener("click", e => {
  hideContextMenu();
});

$(".context-menu ul").addEventListener("click", e => {
  e.stopPropagation();
  const menuOption = e.target.dataset.menuOption;
  if (menuOption === undefined) return;
  switch (menuOption) {
    case "edit_emotions":
      editor.current_model = contextMenu.data.model_id;
      changeSubPage("emotions");
      break;

    default:
      break;
  }
  hideContextMenu();
});

$(".breadcrumb.editor button").addEventListener("click", e => {
  editorBackArrow();
});

$(".carousel.models").addEventListener("click", e => {
  const target = e.target;
  const isDelete = target.classList.contains("danger");
  const isEdit = target.classList.contains("carousel-item-image");

  if (isEdit) {
    e.stopPropagation();
    const modelId = target.closest("[data-model-id]").dataset.modelId;
    showContextMenu("model", { model_id: modelId }, e);
    //editor.current_model = modelId;
    //changeSubPage("emotions");
  }

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
function changeSubPage(subpage) {
  const currentSubpage = subpages[activePage].active;
  if (currentSubpage !== null) {
    $(
      `[data-page="${activePage}"] [data-subpage="${currentSubpage}"]`
    ).style.display = "";
  }
  subpages[activePage].active = subpage;
  $(`[data-page="${activePage}"] [data-subpage="${subpage}"]`).style.display =
    "block";

  //page specific behaviors
  switch (activePage) {
    case "editor":
      updateBreadcrumbs();
      switch (subpage) {
        case "models":
          $(".subpage-header").innerText = "Models";
          $(".subpage-caption").innerText = "Choose a model to edit!";
          break;
        case "emotions":
          $(".subpage-header").innerText = "Emotions";
          $(".subpage-caption").innerText = "Pick an emotion to edit!";
          break;
        case "emotions":
          $(".subpage-header").innerText = "Emotions";
          $(".subpage-caption").innerText = "Pick an emotion to edit!";
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
}

function showContextMenu(type, data, e) {
  $(".context-menu ul").innerHTML = "";
  switch (type) {
    case "model":
      $(".context-menu ul").appendChild(
        strToHTML(`
          <li data-menu-option="edit_emotions">
            <div class="icon">😊</div>
            <div>Edit Emotions</div>
          </li>
        `)
      );
      $(".context-menu ul").appendChild(
        strToHTML(`
          <li data-menu-option="edit_transitions_global">
            <div class="icon"><i class="bi bi-car-front-fill"></i></div>
            <div>Edit Transitions (Global)</div>
          </li>
        `)
      );
      $(".context-menu ul").appendChild(
        strToHTML(`
          <li data-menu-option="properties">
            <div class="icon"><i class="bi bi-pencil-fill"></i></div>
            <div>Edit Properties</div>
          </li>
        `)
      );
      $(".context-menu ul").appendChild(
        strToHTML(`
          <li class="danger" data-menu-option="properties">
            <i class="bi bi-trash-fill" style="margin-right: 0.2rem"></i>Delete
          </li>
        `)
      );
      break;

    default:
      return;
  }
  contextMenu.type = type;
  contextMenu.data = data;
  $(".context-menu").dataset.type = type;
  $(".context-menu").style.display = "block";
  $(".context-menu").style.left = e.pageX + 10 + "px";
  $(".context-menu").style.top = e.pageY + 10 + "px";
}

function hideContextMenu() {
  contextMenu.type = null;
  contextMenu.data = null;
  $(".context-menu").style.display = "none";
}

function changePage(page) {
  //hide current page
  if (activePage !== null) {
    $(`[data-page="${activePage}"]`).style.display = "none";
    $(`.sidebar ul [data-option="${activePage}"]`).removeAttribute("active");
  }

  $(`[data-page="${page}"]`).style.display = "block";
  $(`.sidebar ul [data-option="${page}"]`).setAttribute("active", true);
  activePage = page;

  updateHeader(page);

  //change subpage to default if none is set
  if (activePage !== null && subpages[activePage].active === null) {
    changeSubPage(subpages[activePage].default);
  }

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
  $(".header h1").innerHTML = innerHeaderHtml;
}

function editorBackArrow() {
  //todo change a lot of stuff here
  if (
    editor.current_model !== null &&
    editor.current_emotion === null &&
    editor.current_transition === null
  ) {
    //exiting the menu where you pick a model's emotions or transitions to edit
    editor.current_model = null;
    changeSubPage("models");
  }
}

function updateBreadcrumbs() {
  const breadcrumbs = strToHTML(`
      <div>
        <div>📦</div>
      </div>
    `);
  let currentModel;
  let currentTransition;
  let currentEmotion;

  if (editor.current_model !== null) {
    currentModel = document.createElement("p");
    currentModel.innerText = getModelName(editor.current_model);
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

  replaceNode($(".breadcrumb.editor div"), breadcrumbs);
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

async function loadModelCaro() {
  const modelIds = Object.keys(mData);
  $('.carousel.models').innerHTML = ''
  for (let i = 0; i < modelIds.length; i++) {
    const modelId = modelIds[i];
    const model = mData[modelId];
    console.log(model)
    const mdlCaroItem = await genModelCaroItem(modelId, getModelName(modelId), getModelPreview(modelId), false);
    console.log(mdlCaroItem)
    $('.carousel.models').appendChild(mdlCaroItem)
    console.log(model);
  }
}

function getModelName(modelId) {
  if (mData[modelId]?.name === undefined) return "???"
  return mData[modelId].name
}

function getModelImg(modelId) {
  if (mData[modelId]?.icon === undefined) return relativeImg(mData[modelId].emos['emo-1'].idles[0].path)
    return relativeImg(mData[modelId].icon);
}

function getModelPreview(modelId) {
  if (mData[modelId]?.icon !== undefined) return relativeImg(mData[modelId].icon);
  if (mData[modelId]?.emos['emo-1'] && mData[modelId].emos['emo-1'].idles.length > 0) return relativeImg(mData[modelId].emos['emo-1'].idles[0].path)
  return ''
}

function relativeImg(str) {
  return str.replace(sammiDir, '')
}

async function genModelCaroItem(id, name, imgPath, temporary) {
  if (temporary) return; //todo this is to queue for a "save changes" button
  const template = html`
    <li data-model-id="?">
      <div class="carousel-item-container">
        <div
          class="carousel-item-image"
          style=""
        ></div>
        <h2 class="carousel-item-caption">Lil guy</h2>
        <div class="carousel-item-options">
        </div>
      </div>
    </li>
  `;
  const caroItem = strToHTML(template);
  caroItem.dataset.modelId = id;
  caroItem.querySelector('.carousel-item-caption').innerText = name
  caroItem.querySelector('.carousel-item-image').style.backgroundImage = `url(${imgPath})`
  console.log(caroItem.querySelector('.carousel-item-image').style.backgroundImage)
  return caroItem
}

async function loadLandiTubeModels() {
  const res = await fetch("simulated.json");
  const json = await res.json();
  mData = json.mdls;
  sammiDir = json.sammiDir
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
