const connection = require("./connection");

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    employeeList() {
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, " + 
            "CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id " + 
            "LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;");
    }

    potentialManagerList() {
        return this.connection.query("SELECT first_name, last_name FROM employee");
    }

    createEmployee(employee) {
        return this.connection.query("INSERT INTO employee SET ?", employee);
    }

    updateEmployeeRole(employeeID, roleID) {
        return this.connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, employeeID]);
    }

    roleList() {
        return this.connection.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role " + 
        "LEFT JOIN department on role.department_id = department.id;")
    }

    createRole(role) {
        return this.connection.query("INSERT INTO role SET ?", role);
    }

    departmentList() {
        return this.connection.query(
          "SELECT department.id, department.name FROM department" //, SUM(role.salary) AS utilized_budget FROM employee " + 
          //"LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
        );
    }

    createDepartment(department) {
        return this.connection.query("INSERT INTO department SET ?", department);
    }
}

module.exports = new DB(connection);