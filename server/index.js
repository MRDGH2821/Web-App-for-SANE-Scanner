const path = require('path');
const express = require('express');
const { exec } = require('child_process');
const port = process.env.PORT || 3000;

const app = express();
const sitePath = path.join(__dirname, '../site');

function toTimeString(date = new Date()) {
  let pad = function (num) {
    return (num < 10 ? '0' : '') + num;
  };

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    '_' +
    pad(date.getMinutes()) +
    '_' +
    pad(date.getSeconds())
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(sitePath, { extensions: ['html'] }));

app.listen(port, () => {
  console.log(`Server is up and running on PORT ${port}.`);
});

app.post('/scan', (req, res) => {
  const body = req.body;
  //res.send('Scanning image');
  const scanName = toTimeString();
  const filePath = `./scans/${scanName}.${body.format}`;
  exec(
    `scanimage --format ${body.format} --resolution ${body.scan_resolution} --mode ${body.scan_mode} > ${filePath}`,
    (err) => {
      if (err) {
        res.status({ status: 500 }).json({ message: 'Internal server error', raw: err });
      } else {
        res.download(filePath);
      }
    },
  );
});

app.use(function (req, res) {
  res.status(404).sendFile(sitePath + '/404.html');
});
