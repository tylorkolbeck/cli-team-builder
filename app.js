const Manager = require("./lib/Manager")
const Engineer = require("./lib/Engineer")
const Intern = require("./lib/Intern")
const inquirer = require("inquirer")
const path = require("path")
const fs = require("fs")

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html")

const render = require("./lib/htmlRenderer")

let members = []

init()

function init() {
  askMemberQuestions().then(() => {
    askToExit()
  })
}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

function askToExit() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "exit",
        message: "Enter another member?",
      },
    ])
    .then((ans) => {
      if (!ans.exit) {
        fs.writeFile(outputPath, render(members), (err) => {
          if (err) console.log(err)
          else console.log("Write Success.", outputPath)
        })
        // console.log(render(members))
      } else {
        init()
      }
    })
    .catch((err) => console.log(err))
}

function askMemberQuestions() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Members Name: ",
      },
      {
        type: "number",
        name: "id",
        message: "Members Id: ",
      },
      {
        type: "list",
        name: "role",
        message: "Members role: ",
        choices: ["Manager", "Intern", "Engineer"],
      },
      {
        type: "input",
        name: "email",
        message: "Members email: ",
      },
      {
        type: "input",
        name: "officeNumber",
        message: "Office Number: ",
        when: (ans) => ans.role === "Manager",
      },
      {
        type: "input",
        name: "school",
        message: "School: ",
        when: (ans) => ans.role === "Intern",
      },
      {
        type: "input",
        name: "github",
        message: "Github Username",
        when: (ans) => ans.role === "Engineer",
      },
      /* Pass your questions in here */
    ])
    .then((ans) => {
      switch (ans.role) {
        case "Manager":
          members.push(
            new Manager(ans.name, ans.id, ans.email, ans.officeNumber)
          )
          return
        case "Engineer":
          members.push(new Engineer(ans.name, ans.id, ans.email, ans.github))
          return
        case "Intern":
          members.push(new Intern(ans.name, ans.id, ans.email, ans.school))
          return
      }
      // Use user feedback for... whatever!!
    })
    .catch((error) => console.log(error))
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
