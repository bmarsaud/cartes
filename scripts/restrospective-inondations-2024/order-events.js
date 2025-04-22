import fs from 'fs';

let data = fs.readFileSync('../../public/data/retrospective-inondations-2024/events.json', 'utf8');
let events = JSON.parse(data);

events = events.sort((a, b) => new Date(a.date) - new Date(b.date));

fs.writeFileSync('../../public/data/retrospective-inondations-2024/events-sorted.json', JSON.stringify(events, undefined, 2));
