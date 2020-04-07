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
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR)
          fs.writeFile(outputPath, render(members), (err) => {
            if (err) console.log(err)
            else console.log("Write Success.", outputPath)
          })
        }
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
    })
    .catch((error) => console.log(error))
}
