# Exercice : manipulation de fichiers

Le fichier `input.csv` contient une liste de personnes fictives avec leur date de naissance.

L'objectif est de lire le contenu de ce fichier et de calculer, pour chacune de ces personnes, leur âge, et de le stocker dans un fichier de sortie aux en-têtes suivants : `nom`, `prénom`, `date de naissance`, `âge`.

Exemple :
```csv
nom,prénom,date de naissance,âge
Dupont,Jean,12/06/1992,28
Duval,Marine,10/12/2001,19
Smith,John,06/11/1995,25
Ramond,Anabelle,06/02/1991,30
```

Essayez d'utiliser les formes "promesses" des fonctions.

> Astuce : les fonctions en version "promesses" des fonctions de `fs` peuvent être importées avec `const { writeFile, readFile } = require('fs').promises;`.