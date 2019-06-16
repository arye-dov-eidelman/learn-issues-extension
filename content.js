console.log("content script loaded")


function renderIssues(issues) {
  if (issues.length === 0) { return }

  issuesElement = document.createElement('div')
  issuesElement.className = 'issues'

  issuesElement.style.setProperty('margin', '0px 42px');

  issuesElement.appendChild(createIssueTitleElement(issues))
  issues.forEach(issue => {
    issuesElement.appendChild(createIssueElement(issue))
  });

  mainBodyElement = document.getElementById('js--region-body-content')
  mainBodyElement.firstChild.prepend(issuesElement)
}

function createIssueElement(issue) {
  element = document.createElement('a')
  element.className = 'issue'
  element.innerHTML = issue.title
  element.href = issue.html_url

  element.style.setProperty('display', 'flex');
  element.style.setProperty('align-items', 'center');
  element.style.setProperty('width', '100%');
  element.style.setProperty('height', '25px');
  element.style.setProperty('padding', '10px');
  element.style.setProperty('background-color', 'red');
  element.style.setProperty('color', 'black');
  return element
}

function createIssueTitleElement(issues) {
  element = document.createElement("h3")
  element.className = 'issue-title'
  element.innerHTML = `${issues.length} issues on this repo right now`

  element.style.setProperty('display', 'flex');
  element.style.setProperty('align-items', 'center');
  element.style.setProperty('width', '100%');
  element.style.setProperty('height', '25px');
  element.style.setProperty('padding', '10px');
  element.style.setProperty('background-color', 'red');
  element.style.setProperty('color', 'black');
  return element
}

function getIssues() {
  const baseUrl = "https://api.github.com/repos/learn-co-curriculum/"
  const repo = document.querySelector('[title="Raise an Issue"]').firstChild
    .href.split("/").reverse()[2]
  const issueUrl = baseUrl + repo + "/issues"
  console.log(issueUrl)

  fetch(issueUrl)
    .then(response => {
      return response.json();
    })
    .then(issues => {
      return issues.filter(issue => issue.state === "open");
    })
    .then(issues => {
      console.log(issues)
      return renderIssues(issues);
    })
}

getIssues()
