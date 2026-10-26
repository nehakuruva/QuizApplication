
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Quiz questions organized by topic and difficulty.
const quizData = {
  JavaScript: {
    Easy: [
      { question: "Which keyword declares a block-scoped variable?", options: ["var", "let", "print", "echo"], answer: 1 },
      { question: "Which symbol is used for strict equality?", options: ["=", "==", "===", "!="], answer: 2 },
      { question: "Which method converts JSON text into a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"], answer: 0 },
      { question: "Which value represents an intentional absence of a value?", options: ["true", "null", "1", "NaN"], answer: 1 },
      { question: "Which keyword declares a constant?", options: ["let", "var", "const", "static"], answer: 2 }
    ],
    Medium: [
      { question: "Which array method creates a new array by transforming each element?", options: ["filter()", "map()", "find()", "push()"], answer: 1 },
      { question: "What does typeof [] return in JavaScript?", options: ["array", "list", "object", "undefined"], answer: 2 },
      { question: "Which method adds an element to the end of an array?", options: ["pop()", "shift()", "unshift()", "push()"], answer: 3 },
      { question: "Which keyword is commonly used to pause inside an async function until a promise settles?", options: ["wait", "await", "pause", "defer"], answer: 1 },
      { question: "Which array method returns elements that pass a test?", options: ["filter()", "map()", "join()", "reduceRight()"], answer: 0 }
    ],
    Hard: [
      { question: "Which feature lets a function retain access to its outer lexical scope?", options: ["Prototype", "Closure", "Hoisting", "Casting"], answer: 1 },
      { question: "Which method creates a shallow copy of an array?", options: ["slice()", "splice()", "sort()", "reverse()"], answer: 0 },
      { question: "What does Promise.all() do if one input promise rejects?", options: ["Ignores the rejection", "Waits forever", "Rejects the combined promise", "Converts it to null"], answer: 2 },
      { question: "Which operator provides a fallback only when the left value is null or undefined?", options: ["||", "??", "&&", "==="], answer: 1 },
      { question: "Which statement about JavaScript classes is correct?", options: ["They cannot have methods", "They replace objects entirely", "They are syntax built on prototypes", "They only work in browsers"], answer: 2 }
    ]
  },

  Java: {
    Easy: [
      { question: "Which keyword declares a class in Java?", options: ["define", "class", "struct", "object"], answer: 1 },
      { question: "Which method is the usual entry point of a Java application?", options: ["start()", "run()", "main()", "init()"], answer: 2 },
      { question: "Which type stores true or false?", options: ["int", "String", "char", "boolean"], answer: 3 },
      { question: "Which keyword creates an object?", options: ["new", "make", "create", "object"], answer: 0 },
      { question: "Which symbol ends most Java statements?", options: [":", ".", ";", ","], answer: 2 }
    ],
    Medium: [
      { question: "Which collection does not allow duplicate elements?", options: ["ArrayList", "HashSet", "LinkedList", "Vector"], answer: 1 },
      { question: "Which keyword is used to inherit a class?", options: ["implements", "inherits", "extends", "superclass"], answer: 2 },
      { question: "Which exception category must generally be caught or declared?", options: ["Checked exceptions", "All runtime exceptions", "Errors only", "No exceptions"], answer: 0 },
      { question: "Which interface represents a key-value mapping?", options: ["List", "Queue", "Set", "Map"], answer: 3 },
      { question: "Which keyword prevents a method from being overridden?", options: ["static", "final", "private", "volatile"], answer: 1 }
    ],
    Hard: [
      { question: "Which Java feature allows one generic type to accept different reference types safely?", options: ["Generics", "Packages", "Annotations", "Labels"], answer: 0 },
      { question: "Which keyword ensures a field's updates are visible across threads?", options: ["transient", "native", "volatile", "strictfp"], answer: 2 },
      { question: "Which interface is commonly used to define a task that returns a result?", options: ["Runnable", "Serializable", "Comparable", "Callable"], answer: 3 },
      { question: "What does the try-with-resources statement do?", options: ["Repeats a block", "Automatically closes eligible resources", "Creates a new thread", "Suppresses every exception"], answer: 1 },
      { question: "Which Java type is immutable?", options: ["String", "StringBuilder", "ArrayList", "HashMap"], answer: 0 }
    ]
  },

  Python: {
    Easy: [
      { question: "Which symbol starts a comment in Python?", options: ["//", "#", "<!--", "/*"], answer: 1 },
      { question: "Which type stores an ordered, changeable collection?", options: ["tuple", "str", "list", "bool"], answer: 2 },
      { question: "Which function displays output?", options: ["print()", "show()", "echo()", "writeLine()"], answer: 0 },
      { question: "Which keyword defines a function?", options: ["func", "function", "define", "def"], answer: 3 },
      { question: "Which value represents no value in Python?", options: ["undefined", "None", "null", "void"], answer: 1 }
    ],
    Medium: [
      { question: "Which syntax creates a list comprehension?", options: ["{x for x in items}", "[x for x in items]", "(x: items)", "<x in items>"], answer: 1 },
      { question: "Which keyword handles an exception?", options: ["catch", "error", "except", "rescue"], answer: 2 },
      { question: "What does len([4, 5, 6]) return?", options: ["2", "4", "6", "3"], answer: 3 },
      { question: "Which built-in type is immutable?", options: ["tuple", "list", "dict", "set"], answer: 0 },
      { question: "Which keyword creates an anonymous function?", options: ["def", "lambda", "anon", "yield"], answer: 1 }
    ],
    Hard: [
      { question: "Which method is called when an iterator produces its next value?", options: ["next()", "iterate()", "__next__()", "__iter__()"], answer: 2 },
      { question: "Which keyword allows a generator to produce a value?", options: ["return", "pass", "break", "yield"], answer: 3 },
      { question: "Which module provides tools for working with paths and directories?", options: ["pathlib", "random", "statistics", "calendar"], answer: 0 },
      { question: "What does a decorator commonly do?", options: ["Deletes a function", "Wraps or modifies callable behavior", "Converts Python to Java", "Creates a database"], answer: 1 },
      { question: "Which structure is commonly used to ensure cleanup after a managed operation?", options: ["if block", "for loop", "with statement", "match statement"], answer: 2 }
    ]
  },

  HTML: {
    Easy: [
      { question: "Which tag creates a hyperlink?", options: ["<img>", "<p>", "<a>", "<div>"], answer: 2 },
      { question: "Which tag displays an image?", options: ["<image>", "<img>", "<picture-text>", "<src>"], answer: 1 },
      { question: "Which tag creates the largest standard heading?", options: ["<h6>", "<head>", "<heading>", "<h1>"], answer: 3 },
      { question: "Which declaration identifies an HTML5 document?", options: ["<!DOCTYPE html>", "<html5>", "<doctype>", "<document>"], answer: 0 },
      { question: "Which element creates a numbered list?", options: ["<ul>", "<dl>", "<ol>", "<li>"], answer: 2 }
    ],
    Medium: [
      { question: "Which attribute provides alternative text for an image?", options: ["title", "alt", "href", "name"], answer: 1 },
      { question: "Which element is used for a table row?", options: ["<td>", "<th>", "<table-row>", "<tr>"], answer: 3 },
      { question: "Which element represents introductory content for a page or section?", options: ["<header>", "<footer>", "<aside>", "<summary>"], answer: 0 },
      { question: "Which attribute connects a label to a form control's id?", options: ["name", "value", "for", "target"], answer: 2 },
      { question: "Which element embeds another webpage?", options: ["<embedpage>", "<iframe>", "<web>", "<frameurl>"], answer: 1 }
    ],
    Hard: [
      { question: "Which attribute helps associate a form control with a form when it is outside that form?", options: ["action", "method", "target", "form"], answer: 3 },
      { question: "Which attribute makes a form field value mandatory?", options: ["required", "validate", "must", "needed"], answer: 0 },
      { question: "Which element provides a caption for a figure?", options: ["<caption>", "<label>", "<figcaption>", "<legend>"], answer: 2 },
      { question: "Which attribute specifies that a script should execute after HTML parsing?", options: ["async-only", "defer", "wait", "late"], answer: 1 },
      { question: "Which attribute can provide a regular-expression pattern for input validation?", options: ["validate", "regex", "match", "pattern"], answer: 3 }
    ]
  },

  CSS: {
    Easy: [
      { question: "Which property changes text color?", options: ["font-size", "background", "color", "margin"], answer: 2 },
      { question: "Which selector targets an element by id?", options: [".header", "#header", "*header", "@header"], answer: 1 },
      { question: "Which property sets space inside an element's border?", options: ["margin", "gap", "outline", "padding"], answer: 3 },
      { question: "Which property changes text size?", options: ["font-size", "text-style", "size", "font-weight"], answer: 0 },
      { question: "Which value makes a flex container?", options: ["position: flex", "display: flex", "float: flex", "flex: display"], answer: 1 }
    ],
    Medium: [
      { question: "Which declaration creates a two-column CSS Grid with equal flexible widths?", options: ["grid-template-columns: 2", "grid-columns: auto", "grid-template-columns: 1fr 1fr", "columns: grid"], answer: 2 },
      { question: "Which pseudo-class selects an element when a pointer hovers over it?", options: [":focus", ":active", "::hover", ":hover"], answer: 3 },
      { question: "Which property controls stacking order of positioned elements?", options: ["z-index", "layer", "stack-order", "position-index"], answer: 0 },
      { question: "Which unit is relative to the root element's font size?", options: ["em", "rem", "vw", "px"], answer: 1 },
      { question: "Which property controls whether overflowing content is clipped or scrollable?", options: ["visibility", "display", "overflow", "clip-path"], answer: 2 }
    ],
    Hard: [
      { question: "Which selector has the highest specificity?", options: ["div", ".card", "#main", "*"], answer: 2 },
      { question: "Which at-rule defines keyframes for CSS animations?", options: ["@media", "@import", "@supports", "@keyframes"], answer: 3 },
      { question: "Which property changes the stacking context of an element when its value is not 1?", options: ["opacity", "margin", "font-family", "letter-spacing"], answer: 0 },
      { question: "Which function is commonly used to clamp a responsive value between a minimum and maximum?", options: ["limit()", "clamp()", "bound()", "range()"], answer: 1 },
      { question: "Which property defines how a grid item's content aligns along its block axis inside its area?", options: ["justify-items", "align-content", "align-self", "grid-flow"], answer: 2 }
    ]
  },

  Angular: {
    Easy: [
      { question: "Which language is primarily used to write Angular applications?", options: ["PHP", "TypeScript", "Ruby", "SQL"], answer: 1 },
      { question: "Which decorator declares an Angular component?", options: ["@NgModuleOnly", "@Service", "@Component", "@Page"], answer: 2 },
      { question: "Which template syntax binds a DOM event?", options: ["[click]", "{{click}}", "#click", "(click)"], answer: 3 },
      { question: "Which file commonly contains the root component class in a modern Angular CLI app?", options: ["app.ts", "index.css", "package-lock.json", "angular.json"], answer: 0 },
      { question: "Which syntax displays a component property in a template?", options: ["(name)", "{{ name }}", "[[name]]", "<%= name %>"], answer: 1 }
    ],
    Medium: [
      { question: "Which Angular feature is commonly used to request data from an HTTP API?", options: ["RouterOutlet", "Title", "HttpClient", "ElementRef"], answer: 2 },
      { question: "Which syntax passes a value into an input property?", options: ["(value)", "{{value}}", "#value", "[value]"], answer: 3 },
      { question: "Which directive conditionally displays content in older Angular template syntax?", options: ["*ngIf", "*ngFor", "*ngClassOnly", "*ngStyleOnly"], answer: 0 },
      { question: "Which service is commonly used to navigate between routes programmatically?", options: ["HttpClient", "Router", "Renderer2", "ChangeDetectorRef"], answer: 1 },
      { question: "Which file commonly defines standalone app providers in an Angular CLI project?", options: ["app.css", "index.html", "app.config.ts", "package.json"], answer: 2 }
    ],
    Hard: [
      { question: "Which Angular mechanism helps manage subscriptions when a component is destroyed?", options: ["ngOnInit only", "Template reference variables", "CSS encapsulation", "takeUntilDestroyed"], answer: 3 },
      { question: "Which change detection strategy checks a component when Angular's normal triggers apply and its inputs or events require it?", options: ["OnPush", "ManualOnly", "Never", "Static"], answer: 0 },
      { question: "What does an Angular route guard help decide?", options: ["CSS color", "Whether navigation is allowed", "Database table size", "HTTP port number"], answer: 1 },
      { question: "Which feature allows a standalone component to declare its template dependencies?", options: ["providers only", "styles only", "imports", "scripts"], answer: 2 },
      { question: "Which RxJS operator switches to a new inner observable and unsubscribes from the previous one?", options: ["map", "filter", "tap", "switchMap"], answer: 3 }
    ]
  },

  SQL: {
    Easy: [
      { question: "Which SQL command retrieves rows?", options: ["SELECT", "INSERT", "UPDATE", "DELETE"], answer: 0 },
      { question: "Which clause filters rows?", options: ["ORDER BY", "WHERE", "GROUP BY", "FROM"], answer: 1 },
      { question: "Which command adds new rows?", options: ["ALTER", "SELECT", "INSERT", "DROP"], answer: 2 },
      { question: "Which keyword sorts query results?", options: ["SORT", "ARRANGE", "GROUP BY", "ORDER BY"], answer: 3 },
      { question: "Which function counts rows?", options: ["COUNT()", "SUMTEXT()", "NUMBER()", "ROWSIZE()"], answer: 0 }
    ],
    Medium: [
      { question: "Which join returns rows with matching values in both tables?", options: ["LEFT JOIN", "INNER JOIN", "CROSS JOIN", "FULL OUTER JOIN"], answer: 1 },
      { question: "Which clause filters grouped results?", options: ["WHERE", "ORDER BY", "HAVING", "LIMIT"], answer: 2 },
      { question: "Which constraint uniquely identifies each row and does not allow NULL?", options: ["DEFAULT", "CHECK", "FOREIGN KEY", "PRIMARY KEY"], answer: 3 },
      { question: "Which command changes existing rows?", options: ["UPDATE", "CREATE", "INSERT", "SELECT"], answer: 0 },
      { question: "Which aggregate calculates the average of numeric values?", options: ["SUM()", "AVG()", "COUNT()", "MAX()"], answer: 1 }
    ],
    Hard: [
      { question: "Which database property means a transaction is all-or-nothing?", options: ["Consistency", "Isolation", "Atomicity", "Durability"], answer: 2 },
      { question: "Which index structure is commonly used by relational databases for ordered lookup?", options: ["Stack", "Queue", "Linked list only", "B-tree or B+ tree"], answer: 3 },
      { question: "Which command usually removes all rows while retaining a table's structure?", options: ["TRUNCATE TABLE", "DROP DATABASE", "REMOVE COLUMN", "DELETE DATABASE"], answer: 0 },
      { question: "Which normal form specifically removes partial dependency on part of a composite candidate key?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1 },
      { question: "What does COMMIT do?", options: ["Undo the transaction", "Delete the database", "Make transaction changes permanent", "Create a view"], answer: 2 }
    ]
  },

  "General Knowledge": {
    Easy: [
      { question: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Hyderabad", "Chennai"], answer: 1 },
      { question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Mercury"], answer: 2 },
      { question: "How many days are in a standard non-leap year?", options: ["364", "360", "366", "365"], answer: 3 },
      { question: "Which is the largest ocean on Earth?", options: ["Pacific Ocean", "Indian Ocean", "Arctic Ocean", "Atlantic Ocean"], answer: 0 },
      { question: "Which gas do plants absorb during photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], answer: 1 }
    ],
    Medium: [
      { question: "Which instrument measures atmospheric pressure?", options: ["Thermometer", "Hygrometer", "Barometer", "Anemometer"], answer: 2 },
      { question: "Which is the chemical symbol for gold?", options: ["Ag", "Gd", "Go", "Au"], answer: 3 },
      { question: "Which organ pumps blood through the human body?", options: ["Heart", "Liver", "Lung", "Kidney"], answer: 0 },
      { question: "Which continent contains the Sahara Desert?", options: ["Asia", "Africa", "Europe", "South America"], answer: 1 },
      { question: "Which force keeps planets in orbit around the Sun?", options: ["Friction", "Magnetism", "Gravity", "Buoyancy"], answer: 2 }
    ],
    Hard: [
      { question: "Which scientist formulated the three classical laws of motion?", options: ["Galileo Galilei", "Albert Einstein", "Michael Faraday", "Isaac Newton"], answer: 3 },
      { question: "Which layer of Earth's atmosphere contains most weather phenomena?", options: ["Troposphere", "Mesosphere", "Thermosphere", "Exosphere"], answer: 0 },
      { question: "Which treaty formally established the European Union?", options: ["Treaty of Versailles", "Maastricht Treaty", "Treaty of Paris (1919)", "Treaty of Tordesillas"], answer: 1 },
      { question: "Which is the SI unit of electric resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], answer: 2 },
      { question: "Which part of a cell contains most of its genetic material in human cells?", options: ["Ribosome", "Cell membrane", "Golgi apparatus", "Nucleus"], answer: 3 }
    ]
  },

  Aptitude: {
    Easy: [
      { question: "What is 15 + 27?", options: ["40", "41", "42", "43"], answer: 2 },
      { question: "What is half of 86?", options: ["42", "43", "44", "46"], answer: 1 },
      { question: "If a pen costs ₹10, what do 3 pens cost?", options: ["₹20", "₹25", "₹35", "₹30"], answer: 3 },
      { question: "What is 20% of 100?", options: ["20", "10", "25", "50"], answer: 0 },
      { question: "What number comes next: 2, 4, 6, 8, ...?", options: ["9", "10", "12", "14"], answer: 1 }
    ],
    Medium: [
      { question: "A car travels 120 km in 2 hours. What is its average speed?", options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], answer: 2 },
      { question: "What is 25% of 240?", options: ["40", "50", "55", "60"], answer: 3 },
      { question: "What is the simple interest on ₹1,000 at 10% per year for 2 years?", options: ["₹200", "₹100", "₹250", "₹300"], answer: 0 },
      { question: "The ratio 12:18 in simplest form is:", options: ["3:4", "2:3", "4:5", "6:9"], answer: 1 },
      { question: "What is the mean of 4, 8, and 12?", options: ["6", "7", "8", "9"], answer: 2 }
    ],
    Hard: [
      { question: "A product costs ₹800 and its price increases by 15%. What is the new price?", options: ["₹880", "₹900", "₹910", "₹920"], answer: 3 },
      { question: "A can finish a job in 6 days and B in 3 days. Working together at constant rates, how long do they take?", options: ["2 days", "3 days", "4 days", "4.5 days"], answer: 0 },
      { question: "A fair six-sided die is rolled once. What is the probability of rolling an even number?", options: ["1/3", "1/2", "2/3", "5/6"], answer: 1 },
      { question: "A number increases from 80 to 100. What is the percentage increase?", options: ["20%", "22.5%", "25%", "30%"], answer: 2 },
      { question: "If 3x + 7 = 25, what is x?", options: ["4", "5", "7", "6"], answer: 3 }
    ]
  }
};

// List available quiz topics.
app.get("/api/topics", (req, res) => {
  res.json(
    Object.keys(quizData).map((topic) => ({
      name: topic,
      difficulties: ["Easy", "Medium", "Hard"]
    }))
  );
});

// List available difficulty levels.
app.get("/api/difficulties", (req, res) => {
  res.json(["Easy", "Medium", "Hard"]);
});

// Get quiz questions.
// Example: /api/questions?topic=Python&difficulty=Medium&count=10
app.get("/api/questions", (req, res) => {
  const topic = req.query.topic || "JavaScript";
  const difficulty = req.query.difficulty || "Easy";
  const requestedCount = Number.parseInt(req.query.count, 10) || 5;

  if (!quizData[topic]) {
    return res.status(400).json({ message: "Unknown quiz topic." });
  }

  if (!quizData[topic][difficulty]) {
    return res.status(400).json({ message: "Unknown difficulty level." });
  }

  if (![5, 10, 20].includes(requestedCount)) {
    return res.status(400).json({ message: "Question count must be 5, 10, or 20." });
  }

  const availableQuestions = quizData[topic][difficulty];

  // The current question bank has five questions per topic and difficulty.
  // Repeat the pool if a longer quiz is requested, then shuffle it.
  const selectedQuestions = [];
  while (selectedQuestions.length < Math.min(requestedCount, 20)) {
    selectedQuestions.push(...availableQuestions);
  }

     const selectedQuizQuestions = selectedQuestions
    .slice(0, requestedCount)
    .map((question, index) => ({
      id: index + 1,
      category: topic,
      difficulty,
      question: question.question,
      options: question.options
    }));

  res.json(selectedQuizQuestions);
});

// Score a submitted quiz using the selected topic and difficulty.
app.post("/api/submit", (req, res) => {
  const { answers, topic = "JavaScript", difficulty = "Easy", count } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ message: "Answers must be an array." });
  }

  if (!quizData[topic] || !quizData[topic][difficulty]) {
    return res.status(400).json({ message: "Unknown quiz topic or difficulty." });
  }

  const requestedCount = Number.parseInt(count, 10) || 5;

  if (![5, 10, 20].includes(requestedCount) || answers.length !== requestedCount) {
    return res.status(400).json({ message: "Answers must match the selected quiz length." });
  }

  const availableQuestions = quizData[topic][difficulty];
  let score = 0;

  answers.forEach((answer, index) => {
    const question = availableQuestions[index % availableQuestions.length];
    if (answer === question.answer) {
      score++;
    }
  });

  const percentage = Math.round((score / answers.length) * 100);

  res.json({
    totalQuestions: answers.length,
    score,
    percentage,
    message: percentage >= 80
      ? "Excellent work!"
      : percentage >= 60
        ? "Great job!"
        : "Keep practicing!"
  });
});

app.listen(PORT, () => {
  console.log(`Quiz backend running at http://localhost:${PORT}`);
});