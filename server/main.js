const tm = require('markdown-it-texmath');
const md = require('markdown-it')({html: true})
    .use(tm, {
        engine: require('katex'),
        delimiters: 'dollars',
        katexOptions: {macros: {"\\RR": "\\mathbb{R}"}}
    });
const fs = require('fs');
const bodyParser = require('body-parser')

const express = require('express')
var readlines = require('n-readlines');
const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
const port = 8085

var nQuestions = fs.readdirSync('../data').length / 2

// const CACHE_CLEAR_DELTA_MS = 10000
const useCache = false
var cache = {}

// setTimeout(() => cache = {}, CACHE_CLEAR_DELTA_MS);

function parseFile(file) {
    if (useCache && file in cache) {
        // todo, reload if more than 5min has passed or something, so we reload new stuff
        return cache[file]
    }
    var liner = new readlines(file);
    var next;
    var lines = []
    while (line = liner.next()) {
        lines.push(line.toString('ascii'))
    }
    rows = parse(lines)
    cache[file] = rows
    return rows
}


function parse(lines) {
    const rows = []
    var txt = ""
    var lastKey = ""
    for (line of lines) {
        if (line[0] === '%' && line[1] === '%' && line[2] === '%') {
            var split = line.split("%%%")
            const key = split[1]
            console.log(`txt="${txt}"`)
            if (txt !== "" && txt !== '\n' && txt !== "\n\n") {
                rows.push([lastKey === "solution", md.render(txt)])
            }
            lastKey = key
            txt = ""
        } else {
            txt += '\n' + line
        }
    }
    rows.push([lastKey === "solution", md.render(txt)])
    console.log(rows)
    return rows
}

try {
    app.get('/', function (req, res) {
        res.redirect(`/random`)
    })

    app.get('/add', function (req, res) {
        res.render('add',);
    })

    app.post('/submit', function (req, res) {
        console.log("Submit new question")
        fs.writeFileSync(`../data/${nQuestions}.md`, req.body.md)
        fs.writeFileSync(`../data/${nQuestions}.json`, `
        {
        \"labels\": [\"default\"],
        \n\"authors\": [\"default author\"],
        \n\"title\": \"question ${nQuestions}\"\n
        }`)
        var x = nQuestions
        nQuestions += 1
        res.json({"url": `/questions/${x}`});
    })


    app.post('/compile', function (req, res) {
        console.log("compile")
        console.log(req.body)
        rows = parse(req.body.md.split('\n'))
        console.log(rows)
        res.json({"rows": rows});
    })

    app.get('/random', function (req, res) {
        res.redirect(`/questions/${Math.floor(Math.random() * nQuestions)}`)
    })

    app.get('/questions/:questionId', function (req, res) {
        console.log(req.params)
        const rows = parseFile(`../data/${req.params.questionId}.md`)
        let metadata = JSON.parse(fs.readFileSync(`../data/${req.params.questionId}.json`));
        var data = {
            "rows": rows,
            "metadata": metadata
        }
        res.render('template', {user: "John", data: data});
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
} catch (err) {
    console.error(err);
}



