// Remember to update dataPoints in StorageManager.js

let statCategories = [
  {name: 'Weight', note: '', totalEntries: 4},
  {name: 'Gym', note: 'This is a note', totalEntries: 17},
];

// All of the _ are actually - in storage

let CategoryName_statTypes = [
  {name: 'Weight', unit: 'kg'},
  {name: 'Pull-ups', unit: ''},
];
let CategoryName_entries = [
  {
    id: 1,
    stats: [
      {
        name: 'Weight',
        value: '85',
      },
      {
        name: 'Weight',
        value: '84',
      },
    ],
    comment: 'Hard',
    date: {
      day: 14,
      month: 5,
      year: 2022,
      text: '14/05/2022',
    },
  },
];
let CategoryName_lastId = 1;
