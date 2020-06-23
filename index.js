const fs = require('fs');
const path = require("path");
const inquirer = require("inquirer");
const api = require('./utils/api');
const generateReadMeFile = require("./utils/generateMarkdown");



// all of the questions asked in a function
const questions = [
    {
        type: "input",
        name: "github",
        message: "What is your GitHub username?"
      },
      {
        type: "input",
        name: "title",
        message: "What is your project's name?"
      },
      {
        type: "input",
        name: "description",
        message: "Please write a short description of your project"
      },
      {
        type: "list",
        name: "license",
        message: "What kind of license should your project have?",
        choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"]
      },
      {
        type: "input",
        name: "installation",
        message: "What command should be run to install dependencies?",
        default: "npm install"
      },
      {
        type: "input",
        name: "test",
        message: "What command should be run to run tests?",
        default: "npm test"
      },
      {
        type: "input",
        name: "usage",
        message: "What does the user need to know about using the repo?",
      },
      {
        type: "input",
        name: "contributing",
        message: "What does the user need to know about contributing to the repo?",
      }
];




function init() {

    //ask questions in the console
    // .then stores the response in the terminal
    inquirer.prompt(questions).then((answers) => {
        console.log("User Answer Object", answers)

      // calls the api and passes the github login from the user.
      api.getUser(answers.github).then((githubData) => { 
        // this allows us to only get the data in the githubdata
        var githubProfile = githubData.data;
        // Combining all of our data. "..." allows us to add it to one
        var allData = {...answers, ...githubProfile}
        
        var readmetext = generateMarkdown(allData);
        writeToFile("ReadMeFile.md", readmetext)

       })
   

    });



};


init();


//1- watch node tutorial 
//2- axio tutorial
//3- inquirer 
// path tells you to put it in a folder
function writeToFile(fileName, data) {
  return fs.writeFileSync(path.join(fileName), data);
}


function generateMarkdown(data) {

  const projectTitle = data.title.toLowerCase().split(" ").join("-");
  let projectUrl = `https://github.com/${data.github}/${projectTitle}`;
  let license ='';
  let licenseBadge ='';
 
  if (data.license !== "None") {
    licenseBadge =  `[![GitHub license](https://img.shields.io/badge/license-${data.license}-blue.svg)](${projectUrl})`;
    license =   `## License

    This project is licensed under the ${license} license.`

  }

  return `
# ${data.title}
${licenseBadge}

## Description

${data.description}

## Table of Contents 

* [Installation](#installation)

* [Usage](#usage)

* [License](#license)

* [Contributing](#contributing)

* [Tests](#tests)

* [Questions](#questions)

## Installation

To install necessary dependencies, run the following command:

\`\`\`
${data.installation}
\`\`\`

## Usage

${data.usage}

${license}
  
## Contributing

${data.contributing}

## Tests

To run tests, run the following command:

\`\`\`
${data.test}
\`\`\`

## Questions

<img src="${data.avatar_url}" alt="avatar" style="border-radius: 16px" width="30" />

If you have any questions about the repo, open an issue or contact [${data.github}](${data.url}) directly at ${data.email}.

`;
}


