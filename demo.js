'use strict';
const inspector = require('inspector');
const http = require('http');
const query = require('querystring');
const fs = require('fs');

inspector.Session.prototype.postAsync = function(...args) {
  let session = this;
  return new Promise(
    function(resolve, reject) {
      session.post(...args,
        function(error, result) {
          if (error !== null) {
            reject(error);
          } else if (result.exceptionDetails !== undefined) {
            reject(result.exceptionDetails.exception.description);
          } else {
            resolve(result);
          }
        });
    });
};

async function ReadFile(file_name) {
  return new Promise(
    function(resolve, reject) {
      fs.readFile(file_name, "utf8", function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
}

// Reformat string for HTML.
function Escape(string) {
  return [
    ["&", "&amp;"],
    [" ", "&nbsp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ["\r\n", "<br/>"],
    ["\n", "<br/>"],
    ["\"", "&quot;"],
  ].reduce(
    function(string, [pattern, replacement]) {
      return string.replace(new RegExp(pattern, "g"), replacement);
    }, string);
}

async function CollectTypeProfile(source) {
  // Open a new inspector session.
  const session = new inspector.Session();
  let typeProfile = "";
  try {
    session.connect();
    // Enable relevant inspector domains.
    await session.postAsync('Runtime.enable');
    await session.postAsync('Profiler.enable');
    await session.postAsync('Profiler.startTypeProfile');
    console.log("Waiting for TP");
    // Compile script.
    let { scriptId } = await session.postAsync('Runtime.compileScript', {
      expression: source,
      sourceURL: "test",
      persistScript: true
    });
    // Collect console log during execution.
    // session.on('Runtime.consoleAPICalled',
    // message => messages.push(message));
    // Execute script.
    await session.postAsync('Runtime.runScript', { scriptId });
    // await session.postAsync('HeapProfiler.collectGarbage');
    let { result } = await session.postAsync('Profiler.takeTypeProfile');
    // console.log(result);
    [{ entries: typeProfile }] = result.filter(x => x.scriptId == scriptId);
  } finally {
    // Close session and return.
    session.disconnect();
  }
  return typeProfile;
}

function MarkUpCode(entries, source) {
  // Sort in reverse order so we can replace entries without invalidating
  // the other offsets.
  entries = entries.sort((a, b) => b.offset - a.offset);

  for (let entry of entries) {
    source = source.slice(0, entry.offset) + typeAnnotation(entry.types) +
      source.slice(entry.offset);
  }
  return source;

  function typeAnnotation(types) {
    return `<b>/*${types.map(t => t.name).join(', ')}*/</b>`;
  }
}

async function GetPostBody(request) {
  return new Promise(function(resolve) {
    let body = "";
    request.on('data', data => body += data);
    request.on('end', end => resolve(query.parse(body)));
  });
}

async function Server(request, response) {
  let script = "";
  let result = "";
  let message_log = "";
  let detailed = false;
  let count = false;
  if (request.method == 'POST') {
    // Collect type profile on the script from input form.
    try {
      let post = await GetPostBody(request);
      script = post.script;
      //console.log(script);
      let typeProfile = await CollectTypeProfile(script);
      console.log("Type Profile result:");
      console.log(typeProfile);
      result = MarkUpCode(typeProfile, script);
    } catch (e) {
      message_log = Escape(e.toString());
    }
  } else {
    // Use example file.
    script = await ReadFile("example.js");
  }
  let template = await ReadFile("template.html");
  let html = [
    ["SCRIPT", script],
    ["RESULT", result],
    ["CONSOLE", message_log],
  ].reduce(function(template, [pattern, replacement]) {
    return template.replace(pattern, replacement);
  }, template);
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.end(html);
}

http.createServer(Server).listen(8080);

