const cssNamespace = "learn-issues-extension--";
let currentIssuesUrl

function renderIssues(issues) {
  let contentElement = createContentElement(issues)

  contentElement.appendChild(createIssueTitleElement(issues));
  issues.forEach(issue => {
    contentElement.appendChild(createIssueElement(issue));
  });

  mainBodyElement = document.getElementById('js--region-body-content');

  prevContentElement = document.getElementsByClassName(`${cssNamespace}content`)[0]
  if (!prevContentElement) {
    mainBodyElement.firstChild.prepend(contentElement);
  } else {
    prevContentElement = contentElement
  }
}

function createContentElement(issues) {
  let element = document.createElement("div");
  let classes = [`${cssNamespace}content`];

  if (issues.length === 0) { classes.push(`${cssNamespace}has-no-issues`); }
  else if (issues.length < 5) { classes.push(`${cssNamespace}has-few-issues`); }
  else { classes.push(`${cssNamespace}has-many-issues`); }

  element.className = classes.join(' ')
  return element
}

function createIssueTitleElement(issues) {
  let element = document.createElement("h3");
  element.className = `${cssNamespace}title`;

  if (hasIssues(issues)) {
    element.innerHTML = `${issues.length} open issue${issues.length > 1 ? "s" : ""}`;
  } else {
    element.innerHTML = `No open issues`;
  }

  return element
}

function createIssueElement(issue) {
  let element = document.createElement('a');
  element.className = `${cssNamespace}issue`;
  element.innerHTML = issue.title;
  element.href = issue.html_url;
  return element
}

const hasIssues = issues => issues.length > 0;

function getIssues() {
  const baseUrl = "https://api.github.com/repos/learn-co-curriculum/";
  const ContentElementExists = !!document.getElementsByClassName(`${cssNamespace}content`)[0]
  const issueElement = document.querySelector('[title="Raise an Issue"]')
  
  // if you cant find the new issue element the page is probably still loading
  // try again in a 100 ms
  if (!issueElement) {return setTimeout(getIssues, 100)}

  const repo = issueElement.firstChild.href.split("/").reverse()[2];
  const IssuesUrl = baseUrl + repo + "/issues";

  if (ContentElementExists || (IssuesUrl === currentIssuesUrl)) { return }
  else { currentIssuesUrl = IssuesUrl }
  
  console.log("Getting issues...");
  fetch(currentIssuesUrl)
    .then(response => response.json())
    .catch(err => { debugger })
    .then(issues => issues.filter(issue => !issue.pull_request))
    .then(issues => renderIssues(issues));
}

getIssues();

chrome.runtime.onMessage.addListener(
  function (request) {
    if (request.message === "page_changed") {
      getIssues();
    }
  }
);
