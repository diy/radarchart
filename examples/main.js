var radarchart = require('../');

var target = document.getElementById('passions-chart');

var data = [
    {
        color: '#ccc',
        html: 'Hey there!',
        value: 1
    },
    {
        color: '#999',
        html: 'Hey there darker!',
        value: 3
    },
    {
        color: '#666',
        html: 'Hey there even darker!',
        value: 5
    },
    {
        color: '#333',
        html: 'Hey there the darkest!',
        value: 7
    }
];

radarchart(target, data, { size: 240 });
