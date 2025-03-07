const fs = require('fs');

function writeDataToFile(filename, content) {
  try {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2), 'utf8');
  } catch (err) {
    console.log(`🚨 Error writing to file: ${err.message}`);
  }
}

function getPostData(req) {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
    });
  }
  
  module.exports = { writeDataToFile, getPostData };
