cd scripts
node availability-orthophotos-ign-50cm-and-hr.js "http://professionnels.ign.fr/bdortho-50cm-par-departements#tab-3"
node availability-orthophotos-ign-50cm-and-hr.js "http://professionnels.ign.fr/orthohr-par-departements#tab-3"
node availability-ign-ortho-5m.js
wget "https://wxs-telechargement.ign.fr/x02uy2aiwjo9bm8ce5plwqmr/telechargement/prepackage/ADMINEXPRESS-COG-PACK_2017-07-07\$ADMIN-EXPRESS-COG_1-0__SHP__FRA_2017-06-19/file/ADMIN-EXPRESS-COG_1-0__SHP__FRA_2017-06-19.7z"
unp ADMIN-EXPRESS-COG_1-0__SHP__FRA_2017-06-19.7z
cp ADMIN-EXPRESS-COG_1-0__SHP__FRA_2017-06-19/ADMIN-EXPRESS-COG/1_DONNEES_LIVRAISON_2017-06-19/ADE-COG_1-0_SHP_LAMB93_FR/DEPARTEMENT.* .
ogr2ogr -t_srs epsg:4326 DEPARTEMENT_4326.shp DEPARTEMENT.shp
mapshaper DEPARTEMENT_4326.shp -simplify 1% visvalingam keep-shapes -o format=topojson precision=0.0001 departements.topojson
mapshaper DEPARTEMENT_4326.shp -simplify 1% visvalingam keep-shapes -o format=geojson precision=0.0001 departements.geojson
rm -rf ADMIN-EXPRESS-COG_1-0__SHP__FRA_2017-06-19*
cd ..