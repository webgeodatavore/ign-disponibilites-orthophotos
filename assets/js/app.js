// default zoom, center and rotation
var zoom = 6;
var center = [-2.3, 48.1];

var osm_source = new ol.source.Stamen({
  layer: 'toner-lite'
});

var layerOsm = new ol.layer.Tile({
  id: 'osmfr',
  title: 'OpenStreetMap France',
  type: 'base',
  visible: true,
  source: osm_source
});

var ignOrtho5m = new ol.layer.Vector({
  id: 'ortho5m',
  title: 'Orthophotos 5m',
  visible: false,
  source: new ol.source.Vector()
  // ,style: new ol.style.Style({
  //   stroke: new ol.style.Stroke({
  //     color: 'red',
  //     lineDash: [4],
  //     width: 1
  //   }),
  //   fill: new ol.style.Fill({
  //     color: 'rgba(0, 0, 255, 0.1)'
  //   })
  // })
});

var ignOrtho50cm = new ol.layer.Vector({
  id: 'ortho50cm',
  title: 'Orthophotos 50cm',
  visible: false,
  source: new ol.source.Vector()
});

var ignOrthoHr = new ol.layer.Vector({
  id: 'orthohr',
  title: 'Orthophotos HR',
  visible: true,
  source: new ol.source.Vector()
});

// var selectSingleClick = new ol.interaction.Select();

var orthohrLegend, orthohrYearsColors, ortho50cmLegend, ortho50cmYearsColors;

function attachLegend(legendList) {
  var attachedLegend = document.querySelector('#legend-panel-content');
  var legend_lines = legendList.slice(0).reverse().map(el => {
    return '<li><span style="background:' + el.color + ';"></span>' + el.year + '</li>';
  }).join('');
  attachedLegend.innerHTML = '<ul>' + legend_lines + '</ul>';
}

var legends = {};

Promise.all([
  'to-join-orthohr.json',
  'to-join-ortho50cm.json',
  'to-join-ortho5m.json',
  'departements.geojson'
].map(file => fetch('data/' + file).then(response => response.json()))
).then(function(result) {

  abc = result;
  var orthohrUniques = [
    ...new Set(result[0].map(el => {
      return el.year;
    }))
  ].slice(0).sort();

  var orthohrByIdentifier = result[0].reduce((acc, curr, index) => {
    acc[curr.identifier] = curr;
    return acc;
  }, {});

  var ortho50cmUniques = [
    ...new Set(result[1].map(el => {
      return el.year;
    }))
  ].slice(0).sort();

  var ortho50cmByIdentifier = result[1].reduce((acc, curr, index) => {
    acc[curr.identifier] = curr;
    return acc;
  }, {});

  var ortho5mUniques = [
    ...new Set(result[1].map(el => {
      return el.year;
    }))
  ].slice(0).sort();

  var ortho5mByIdentifier = result[1].reduce((acc, curr, index) => {
    acc[curr.identifier] = curr;
    return acc;
  }, {});

  // Ortho HR
  orthohrLegend = valuesColorsLegend(orthohrUniques, getColorBrewerRamp('Greens', orthohrUniques.length));
  orthohrYearsColors = dictZip(orthohrUniques, getColorBrewerRamp('Greens', orthohrUniques.length));
  orthohrYearsStyles = Object.keys(orthohrYearsColors).reduce((acc, curr, index) => {
    acc[curr] = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#e0e0e0',
        lineDash: [4],
        width: 0.5
      }),
      fill: new ol.style.Fill({
        color: orthohrYearsColors[curr]
      })
    });
    return acc;
  }, {});

  // Ortho 50 cm
  ortho50cmLegend = valuesColorsLegend(ortho50cmUniques, getColorBrewerRamp('Blues', ortho50cmUniques.length));
  ortho50cmYearsColors = dictZip(ortho50cmUniques, getColorBrewerRamp('Blues', ortho50cmUniques.length));
  ortho50cmYearsStyles = Object.keys(ortho50cmYearsColors).reduce((acc, curr, index) => {
    acc[curr] = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#e0e0e0',
        lineDash: [4],
        width: 0.5
      }),
      fill: new ol.style.Fill({
        color: ortho50cmYearsColors[curr]
      })
    });
    return acc;
  }, {});

  // Ortho 5m
  ortho5mLegend = valuesColorsLegend(ortho5mUniques, getColorBrewerRamp('Reds', ortho5mUniques.length));
  ortho5mYearsColors = dictZip(ortho5mUniques, getColorBrewerRamp('Reds', ortho5mUniques.length));
  ortho5mYearsStyles = Object.keys(ortho5mYearsColors).reduce((acc, curr, index) => {
    acc[curr] = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#e0e0e0',
        lineDash: [4],
        width: 0.5
      }),
      fill: new ol.style.Fill({
        color: ortho5mYearsColors[curr]
      })
    });
    return acc;
  }, {});

  var departements = {
    type: "FeatureCollection",
    features: result[3].features.map(feat => {
      if (orthohrByIdentifier[feat.properties.INSEE_DEP]) {
        feat.properties.year_hr = orthohrByIdentifier[feat.properties.INSEE_DEP].year;
        feat.properties.years_hr = orthohrByIdentifier[feat.properties.INSEE_DEP].years;
        feat.properties.urls_hr = orthohrByIdentifier[feat.properties.INSEE_DEP].urls;
      }
      if (ortho50cmByIdentifier[feat.properties.INSEE_DEP]) {
        feat.properties.year_ortho50cm = ortho50cmByIdentifier[feat.properties.INSEE_DEP].year;
        feat.properties.years_ortho50cm = ortho50cmByIdentifier[feat.properties.INSEE_DEP].years;
        feat.properties.urls_ortho50cm = ortho50cmByIdentifier[feat.properties.INSEE_DEP].urls;
      }
      if (ortho5mByIdentifier[feat.properties.INSEE_DEP]) {
        feat.properties.year_ortho5m = ortho5mByIdentifier[feat.properties.INSEE_DEP].year;
        feat.properties.years_ortho5m = ortho5mByIdentifier[feat.properties.INSEE_DEP].years;
        feat.properties.urls_ortho5m = ortho5mByIdentifier[feat.properties.INSEE_DEP].urls;
      }
      return feat;
    })
  }

  ignOrthoHr.getSource().addFeatures((new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(departements));
  ignOrthoHr.setStyle(function(feat, resolution) {
    if (feat.getProperties()['year_hr']) {
      return orthohrYearsStyles[feat.getProperties()['year_hr']]
    } else {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#e0e0e0',
          lineDash: [4],
          width: 0.5
        }),
        fill: null
      });
    }
  });

  ignOrtho50cm.getSource().addFeatures((new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(departements));
  ignOrtho50cm.setStyle(function(feat, resolution) {
    if (feat.getProperties()['year_ortho50cm']) {
      return ortho50cmYearsStyles[feat.getProperties()['year_ortho50cm']]
    } else {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#e0e0e0',
          lineDash: [4],
          width: 0.5
        }),
        fill: null
      });
    }
  });

  ignOrtho5m.getSource().addFeatures((new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(departements));
  ignOrtho5m.setStyle(function(feat, resolution) {
    if (feat.getProperties()['year_ortho5m']) {
      return ortho5mYearsStyles[feat.getProperties()['year_ortho5m']]
    } else {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#e0e0e0',
          lineDash: [4],
          width: 0.5
        }),
        fill: null
      });
    }
  });

  legends['orthohr'] = orthohrLegend;
  legends['ortho50cm'] = ortho50cmLegend;
  legends['ortho5m'] = ortho5mLegend;
  attachLegend(orthohrLegend);
});

var map = new ol.Map({
  target: 'map',
  layers: [
      new ol.layer.Group({
          'title': 'Fond de plan',
          layers: [layerOsm]
      }),
      new ol.layer.Group({
          title: 'Surcouches',
          layers: [
            ignOrtho5m,
            ignOrtho50cm,
            ignOrthoHr
          ]
      })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat(center),
    zoom: zoom,
    maxZoom: 8
  }),
  controls: ol.control.defaults({
    // Set to display OSM attributions on the bottom right control
    attributionOptions:  {
      collapsed: false
    }
  }).extend([
    new ol.control.ScaleLine() // Add scale line to the defaults controls
  ])
  // ,interactions: ol.interaction.defaults().extend([
  //   selectSingleClick
  // ])
});


// Popup for onclick event on GeoJSON source
var popup = new ol.Overlay.Popup({
  panMapIfOutOfView: false
});
map.addOverlay(popup);


// Manage click on the map to display/hide popup
map.on('click', function(e) {
  var info = [];
  map.forEachFeatureAtPixel(e.pixel, function (feature) {
    info.push(feature.get('NOM_DEP') + ' (' + feature.get('INSEE_DEP') + ')');
  }, {
    layerFilter: function (layer) {
      if (layer.getVisible() && ['orthohr', 'ortho5m', 'ortho50cm'].indexOf(layer.get('id')) !== -1) {
        return true
      }
    }
  });
  if (info.length > 0) {
    // debugger;
    popup.show(e.coordinate, info.join(','));
  } else {
    popup.hide();
  }
});

document.querySelector('#legend-panel').addEventListener('click', function(e) {
  if (e.target && e.target.type === 'radio') {
    ['orthohr', 'ortho50cm', 'ortho5m'].forEach(id => {
      if (id === e.target.value) {
        map.getLayers().getArray()[1].getLayers().getArray().find(layer => {
          return (layer.get('id') == id);
        }).setVisible(true);
        if (legends[id]) {
          attachLegend(legends[id]);
        } else {
          document.querySelector('#legend-panel-content').innerHTML = '';
        }
      } else {
        map.getLayers().getArray()[1].getLayers().getArray().filter(layer => {
          return (layer.get('id') == id);
        })[0].setVisible(false);
      }
    })
  }
});