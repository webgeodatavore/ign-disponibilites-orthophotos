// Equivalent to python dict(zip(['AB', 'CD', 'EF', 'GH'],[1, 2, 3, 4])) in javascript
function dictZip(key_array, val_array) {
  if (key_array.length === val_array.length) {
    return key_array.reduce((acc, curr, index) => {
      acc[curr] = val_array[index];
      return acc;
    }, {});
  } else {
    console.error("Wrong length");
  }
}

function valuesColorsLegend(years, colors) {
  if (years.length === colors.length) {
    return years.reduce((acc, curr, index) => {
      acc.push({
        year: curr,
        color: colors[index]
      });
      return acc;
    }, []);
  } else {
    console.error("Wrong length");
  }
}

function getColorBrewerRamp(colorCode, number) {
  const colors = {
    "Blues": {
      "3": ["#deebf7", "#9ecae1", "#3182bd"],
      "4": ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"],
      "5": ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
      "6": ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"],
      "7": ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
      "8": ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
      "9": ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
    },
    "Greens": {
      "3": ["#e5f5e0", "#a1d99b", "#31a354"],
      "4": ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
      "5": ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
      "6": ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
      "7": ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
      "8": ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
      "9": ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]
    },
    "Reds":{
      "3": ["#fee0d2","#fc9272","#de2d26"],
      "4": ["#fee5d9","#fcae91","#fb6a4a","#cb181d"],
      "5":["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],
      "6":["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],
      "7":["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
      "8":["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
      "9":["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]
    }
  }
  return colors[colorCode][String(number)];
}