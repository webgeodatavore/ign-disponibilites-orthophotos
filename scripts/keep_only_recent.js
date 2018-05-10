const fs = require('fs');
const orthohr = require('../data/orthohr-par-departements.json');
const ortho50cm = require('../data/bdortho-50cm-par-departements.json');
const ortho5m = require('../data/bdortho-5m.json');

[
  [orthohr, 'orthohr'],
  [ortho50cm, 'ortho50cm'],
  [ortho5m, 'ortho5m']
].forEach(el => {
  generateAssociatedFiles(...el);
})

function generateAssociatedFiles(json, name) {

  var result = json.slice(0).reverse().reduce((acc, current , index) => {
    if (!acc[current.identifier]) {
      acc[current.identifier] = [];
    }
    acc[current.identifier].push(current);
    return acc;
  }, {});

  var attributes = Object.keys(result).reduce((acc, current , index) => {
    // console.log(result[current]);
    acc[result[current][0].identifier] = result[current].reduce((acc1, current1 , index1) => {
      // console.log(current1);
      if (!acc1[current1.year]) {
        acc1[current1.year] = [];
      }
      acc1[current1.year] = current1.urls;
      return acc1;
    }, {});

    return acc;
  }, {});

  fs.writeFile('../data/' + 'attributes-' + name + '.json', JSON.stringify(attributes, null, ' '), function(err) {
    if(err) throw err;
  })

  var to_join = Object.keys(JSON.parse(JSON.stringify(result))).map(el => {
    result[el][0]['length'] = result[el].length;
    result[el][0]['years'] = result[el].map(el => el.year);
    return result[el][0];
  });

  fs.writeFile('../data/' + 'to-join-' + name + '.json', JSON.stringify(to_join, null, ' '), function(err) {
    if(err) throw err;
  })
}

// for (const i in result) {
//   thematic.contentresult[i].map(el => el.year))
// }

// Date la plus récente
// Multi-disponibilité ?

// console.log(result);