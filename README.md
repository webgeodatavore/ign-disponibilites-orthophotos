# Disponibilités Orthophotos IGN

## Contexte

Il existe différentes données raster mises à disposition par l'IGN

* [La BD ORTHO® HR (Haute-Résolution, 20cm)](http://professionnels.ign.fr/orthohr-par-departements#tab-3)
* [La BD ORTHO® 50cm m](http://professionnels.ign.fr/bdortho-50cm-par-departements#tab-3)
* [La BD ORTHO® 5 m](http://professionnels.ign.fr/bdortho-5m#tab-3)

Généralement, elles sont mises à disposition par l'IGN car l'acquisition a été cofinancées par des collectivités en faisant appel à des fonds Europe. Elles sont ainsi avec une licence libre dite ["licence ouverte"](https://www.etalab.gouv.fr/licence-ouverte-open-licence)

**Comme les pages ne permettent pas de visualiser sous forme cartographique les disponibilités, nous avons fait une démo.**

## Démo disponible

[Visiter la démo](https://rawgit.com/webgeodatavore/ign-disponibilites-orthophotos/master/index.html)


## Roadmap

Permettre d'interroger pour avoir les liens de téléchargements. C'est un peu moins simple que sur le papier car on a parfois plusieurs fichiers pour un département (pour des raisons de taille) et plusieurs années pour un même département.

## Données

### Principe

Il s'agit en fait de métadonnées générées en faisant du scrapping.
On fait cela avec Node.js en utilisant un package nommé [puppeteer](https://github.com/GoogleChrome/puppeteer) pour "piloter" Chrome.

### Commande à lancer pour récupérer les données

Si vous voulez récupérer les infos et jouer de votre côté avec.

`./get_ign_data.sh` la première fois

Les fois suivantes, il faut faire

```
cd scripts;
node availability-orthophotos-ign-50cm-and-hr.js "http://professionnels.ign.fr/bdortho-50cm-par-departements#tab-3"
node availability-orthophotos-ign-50cm-and-hr.js "http://professionnels.ign.fr/orthohr-par-departements#tab-3"
node availability-ign-ortho-5m.js
cd ..
```

Vous pouvez potentiellement avoir besoin de faire `cd scripts; node keep_only_recent.js;cd ..` dans le cas où vous souhaiteriez mettre à jour les fichiers intermédiaires de la démo.

## Dévelopeurs

Pour ouvrir la démo en local

```
git clone http://github.com/webgeodatavore/ign-disponibilites-orthophotos.git
cd ign-disponibilites-orthophotos
npm install
http-server
```

Puis ouvrez http://localhost:8080 (si le port n'est pas déjà occupé)
