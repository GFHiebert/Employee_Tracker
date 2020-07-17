const inquirer = require("inquirer");
const util = require("util");
const db = require("./db");


function runPrompt() {
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What operation would you like to perform?",
        choices: [
            "Add employee",
            "Add department",
            "Add role",
            "View employees",
            "View departments",
            "View roles",
            "Update role",
            "Quit"
        ]
    }).then(function (answer) {
        switch (answer.choice) {
            case "Add employee":
                addEmployee();
                break;

            case "Add department":
                addDepartment();
                break;

            case "Add role":
                addRole();
                break;

            case "View employees":
                viewEmployees();
                break;

            case "View departments":
                viewDepartments();
                break;

            case "View roles":
                viewRoles();
                break;

            case "Update role":
                updateRole();
                break;

            case "Quit":
                quit();
        }
    });
}

async function addEmployee() {
    const roleList = await db.roleList();
    console.log(roleList);
    const employeeList = await db.employeeList();

    const employee = await inquirer.prompt([{
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?"
    }, {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?"
    }]);

    const roleChoices = roleList.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleID } = await inquirer.prompt({
        name: "roleID",
        type: "list",
        message: "What is the employee's role?",
        choices: roleChoices
    });

    employee.role_id = roleID;

    const managerChoices = employeeList.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    managerChoices.unshift({ name: "None", value: null });

    const { managerID } = await inquirer.prompt({
        name: "manager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: managerChoices
    })

    employee.manager_id = managerID;

    await db.createEmployee(employee);

    console.log(`Added ${employee.first_name} ${employee.last_name} to the database`);

    runPrompt();
};

async function addDepartment() {
    const department = await inquirer.prompt([{
        name: "name",
        type: "input",
        message: "What is the name of the department?"
    }]);
    await db.createDepartment(department);

    console.log(`Added ${department.name} to the database`);

    runPrompt();
};

async function addRole() {
    const departments = await db.departmentList();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const role = await inquirer.prompt([{
        name: "title",
        type: "input",
        message: "What is the title of the role?"
    },{
        name: "salary",
        type: "input",
        message: "What is the salary for this role?"
    },{
        name: "department_id",
        type: "list",
        message: "In which department does the role exist?",
        choices: departmentChoices
    }]);

    await db.createRole(role);

    console.log(`Created ${role.title} as new role`);

    runPrompt();

}

async function viewEmployees() {
    const employees = await db.employeeList();

    console.log("\n");
    console.table(employees);

    runPrompt();
}

async function viewDepartments() {
    const departments = await db.departmentList();

    console.log("\n");
    console.table(departments);

    runPrompt();
} 

async function viewRoles() {
    const roles = await db.roleList();

    console.log("\n");
    console.table(roles);

    runPrompt();
}

async function updateRole() {
    const employees = await db.employeeList();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await inquirer.prompt([
        {
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to change?",
        choices: employeeChoices
        }
    ]);

    const roles = await db.roleList();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await inquirer.prompt([
        {
        type: "list",
        name: "roleId",
        message: "Which role do you want to assign the this employee?",
        choices: roleChoices
        }
    ]);

    await db.updateEmployeeRole(employeeId, roleId);

    console.log("Updated employee's role");

    runPrompt();
}

function quit() {
    console.log("Powering down...");
    process.exit();
}

runPrompt();

