const db = require("../db_connection");
const levenshtein = require('fast-levenshtein');

exports.searchName = (req, res) => {
    const name = req.query.name;
    const current = req.query.current;

    let words = name.split(" ");
    if (words.length === 0) {
        return res.status(400).send({
            status: "error",
            message: "Please enter a name"
        })
    }

    let sql = `SELECT employees.emp_no, first_name, last_name, titles.title, departments.dept_name FROM employees \
    JOIN titles ON titles.emp_no = employees.emp_no \
    JOIN dept_emp ON dept_emp.emp_no = employees.emp_no \
    JOIN departments ON departments.dept_no = dept_emp.dept_no \
    WHERE `;

    for (let i = 0; i < words.length; i++) {
        if (i === words.length - 1) {
            sql += `first_name LIKE '%${words[i]}%' OR last_name LIKE '%${words[i]}%'`
        } else {
            sql += `first_name LIKE '%${words[i]}%' OR last_name LIKE '%${words[i]}%' OR `
        }
    }

    if (current) {
        sql += ` AND dept_emp.to_date = '9999-01-01'`
    }

    sql += " GROUP BY employees.emp_no LIMIT 10000" // LIMIT 10000 to prevent server from crashing
   
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(401).send({
                status: "error",
                message: err
            })
        }
        if (results.length === 0) {
            return res.status(401).send({
                status: "error",
                message: "No results found"
            })
        }

        let message = "success";
        if (results.length === 10000) {
            message = "Returned more than 10,000 results. Please refine your search for more accurate results."
        }

        //use levenshtein distance to find closest match to original search
        let searchResults = results
            .map((result) => {
                return {
                    ...result,
                    distance: levenshtein.get(name, result.first_name + " " + result.last_name)
                }
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 100); // only return top 100 results

        return res.status(200).send({
            status: message,
            results: searchResults
        })
    }
    )
};

exports.searchNameAdvanced = (req, res) => {

    const name = req.query.name;
    const title = req.query.title;
    const dept_no = req.query.dept_no;
    const current = req.query.current;

    let words = name.split(" ");
    if (words.length === 0) {
        return res.status(400).send({
            status: "error",
            message: "Please enter a name"
        })
    }

    let sql = `SELECT employees.emp_no, first_name, last_name, titles.title, departments.dept_name FROM employees \
    JOIN titles ON titles.emp_no = employees.emp_no \
    JOIN dept_emp ON dept_emp.emp_no = employees.emp_no \
    JOIN departments ON departments.dept_no = dept_emp.dept_no \
    WHERE `;

    sql += '('

    for (let i = 0; i < words.length; i++) {
        if (i === words.length - 1) {
            sql += `first_name LIKE '%${words[i]}%' OR last_name LIKE '%${words[i]}%'`
        } else {
            sql += `first_name LIKE '%${words[i]}%' OR last_name LIKE '%${words[i]}%' OR `
        }
    }

    sql += ')'

    if (title) {
        sql += ` AND titles.title = '${title}'`
 
    }
    if (dept_no) {
        sql += `AND departments.dept_no = '${dept_no}'`
    }

    if (current) {
        sql += ` AND dept_emp.to_date = '9999-01-01'`
    }

    sql += " GROUP BY employees.emp_no LIMIT 10000" // LIMIT 10000 to prevent server from crashing
   
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(401).send({
                status: "error",
                message: err
            })
        }
        if (results.length === 0) {
            return res.status(401).send({
                status: "error",
                message: "No results found"
            })
        }

        let message = "success";
        if (results.length === 10000) {
            message = "Returned more than 10,000 results. Please refine your search for more accurate results."
        }

        //use levenshtein distance to find closest match to original search
        let searchResults = results
            .map((result) => {
                return {
                    ...result,
                    distance: levenshtein.get(name, result.first_name + " " + result.last_name)
                }
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 100); // only return top 100 results

        return res.status(200).send({
            status: message,
            results: searchResults
        })
    }
    )
};