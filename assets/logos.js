/* Justdoo, outil de maquette : les pistes de logo (2026-11-26).

   Ce fichier dessine les trois logos (l'interrupteur actuel, les trois cercles, le ruban), applique celui qui est
   choisi à l'en-tête et au pied de page, et tient la page « Pistes de logo » qu'ouvre le bouton du pied de page.
   Il sert aux deux langues et ne contient aucun texte. À retirer avec l'outil, avant la mise en ligne définitive.

   Choix retenu par le navigateur (clé « justdoo-logo »), commun aux deux langues. Adresse : ?logo=cercles ou ?logo=ruban.
   Page des logos : #logos.

   Les tracés viennent des planches du dossier logos/ (dessins.js), avec des mesures figées ici, en millièmes de cadratin :
   - trois cercles : mot en Outfit 600 ; cercles de 504 de diamètre, centrés à 241,5 au-dessus de la ligne de base ;
     fût de 132 sur 723 ; cercle du « d » à 86 % du fût, cercles suivants à 54 % et 25 % du premier ; le dernier est en accent ;
   - ruban : mot en Red Hat Display 800 ; boucles de 536 de diamètre, centrées à 260,5 ; trait de 130 ; la couleur suit le ruban.
   Les couleurs viennent de la page et suivent donc la palette : --logo-encre, --logo-milieu, --logo-accent. */
(function () {
  'use strict';

  var CLE = 'justdoo-logo';
  var NOMS = ['actuel', 'cercles', 'ruban'];
  var ENCRE = 'var(--logo-encre)', MILIEU = 'var(--logo-milieu)', ACCENT = 'var(--logo-accent)';
  var racine = document.documentElement;
  var marques = document.querySelectorAll('.logo__mot');
  var origine = marques.length ? marques[0].innerHTML : '';   /* le logo actuel, tel qu'il est écrit dans la page */
  var compteur = 0;

  function a2(n) { return Math.round(n * 100) / 100; }

  /* Le dessin se pose sur la ligne de base du mot : sa boîte monte de 760 et s'arrête à la ligne de base. */
  function dessin(largeur, contenu) {
    return '<svg viewBox="0 -760 ' + a2(largeur) + ' 760" style="width:' + a2(largeur / 1000) + 'em" aria-hidden="true" focusable="false">' + contenu + '</svg>';
  }

  /* ---------- Piste A : trois cercles identiques, au trait de plus en plus fin ; le « d » est un cercle et un fût ---------- */

  function cercles() {
    return 'just' + dessin(1673.5,
      '<circle cx="279.5" cy="-241.5" r="195.24" fill="none" stroke="currentColor" stroke-width="113.52"/>' +
      '<rect x="417.98" y="-723" width="132" height="723" fill="currentColor"/>' +
      '<circle cx="865.48" cy="-241.5" r="221.35" fill="none" stroke="currentColor" stroke-width="61.3"/>' +
      '<circle cx="1401.48" cy="-241.5" r="237.81" fill="none" stroke-width="28.38" style="stroke:' + ACCENT + '"/>');
  }

  /* ---------- Piste B : le ruban. Deux boucles rondes, deux droites tangentes qui se croisent ; la couleur suit le tracé ---------- */

  function melange(vers, depuis, part) {
    var p = Math.round(part * 100);
    return p <= 0 ? depuis : p >= 100 ? vers : 'color-mix(in srgb,' + vers + ' ' + p + '%,' + depuis + ')';
  }
  /* Couleur à la position u du ruban (0 au départ, 1 à l'arrivée) : l'encre du mot, puis la teinte de milieu, puis l'accent. */
  function couleur(u) {
    if (u <= 0.24) return ENCRE;
    if (u < 0.56) return melange(MILIEU, ENCRE, (u - 0.24) / 0.32);
    if (u < 0.92) return melange(ACCENT, MILIEU, (u - 0.56) / 0.36);
    return ACCENT;
  }

  function ruban() {
    var id = 'logo-jour-' + (++compteur);
    var R = 268, cy = -260.5, trait = 130, k = 1.27, depart = 32, jour = 32, pas = 16;
    var r = R - trait / 2, a = k * r, sin = r / a, cos = Math.sqrt(1 - sin * sin), theta = Math.asin(sin);
    var xg = depart + R, xd = xg + 2 * a, xm = xg + a;          /* centres des deux boucles, croisement */
    var gx = xg + r * sin, dx = xd - r * sin, h = r * cos;      /* points où les droites quittent les boucles */
    var largeur = xd + R + 30;
    var points = [], troncons = [];

    /* Deux tronçons voisins partagent leur point de raccord : le tracé est continu d'un bout à l'autre. */
    function ajouter(couche, liste) {
      var debut = points.length ? points.length - 1 : 0;
      points = points.concat(points.length ? liste.slice(1) : liste);
      troncons.push({ couche: couche, debut: debut, fin: points.length - 1 });
    }
    function droite(x0, y0, x1, y1) {
      var n = Math.max(2, Math.ceil(Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) / pas)), liste = [];
      for (var i = 0; i <= n; i++) liste.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]);
      return liste;
    }
    function arc(cx, angle, balayage) {
      var n = Math.max(8, Math.ceil(Math.abs(balayage) * r / pas)), liste = [];
      for (var i = 0; i <= n; i++) { var t = angle + balayage * i / n; liste.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
      return liste;
    }

    /* Parcours : on part du croisement par le brin du dessous, on fait le tour de la boucle de gauche, on passe par le brin
       du dessus, on fait le tour de la boucle de droite et on revient sous le croisement. Le début et la fin sont cachés. */
    var haut = -(Math.PI / 2 - theta), bas = Math.PI / 2 - theta, grand = 2 * Math.PI - (bas - haut);
    ajouter('dessous', droite(xm, cy, gx, cy - h));
    ajouter('boucle', arc(xg, haut, -grand));
    ajouter('dessus', droite(gx, cy + h, dx, cy - h));
    ajouter('boucle', arc(xd, Math.PI + bas, grand));
    ajouter('dessous', droite(dx, cy + h, xm, cy));

    /* Un morceau par couleur ; chaque morceau déborde d'un pas sur le suivant, pour ne laisser aucun filet aux raccords. */
    var couches = { dessous: '', boucle: '', dessus: '' }, n = points.length;
    function point(i) { return a2(points[i][0]) + ' ' + a2(points[i][1]); }
    troncons.forEach(function (tr) {
      var j = tr.debut;
      while (j < tr.fin) {
        var teinte = couleur(j / (n - 1)), fin = j + 1;
        while (fin < tr.fin && couleur(fin / (n - 1)) === teinte) fin++;
        var d = 'M' + point(j);
        for (var i = j + 1; i <= Math.min(fin + 1, n - 1); i++) d += 'L' + point(i);
        couches[tr.couche] += '<path d="' + d + '" style="stroke:' + teinte + '"/>';
        j = fin;
      }
    });

    /* Le brin qui monte passe dessus : le masque ouvre un jour de chaque côté, seulement autour du croisement. */
    var angle = 2 * theta;
    var demi = Math.min(a * cos - 4, (trait / 2) / Math.sin(angle) + (trait / 2 + jour) * Math.abs(1 / Math.tan(angle)) + 10);
    var court = 'M' + a2(xm - cos * demi) + ' ' + a2(cy + sin * demi) + 'L' + a2(xm + cos * demi) + ' ' + a2(cy - sin * demi);
    var entier = 'M' + a2(gx) + ' ' + a2(cy + h) + 'L' + a2(dx) + ' ' + a2(cy - h);
    var cadre = 'x="-60" y="-900" width="' + a2(largeur + 120) + '" height="1100"';
    var masque = '<mask id="' + id + '" maskUnits="userSpaceOnUse" ' + cadre + '><rect ' + cadre + ' fill="#fff"/>' +
      '<path d="' + court + '" fill="none" stroke="#000" stroke-width="' + (trait + 2 * jour) + '"/>' +
      '<path d="' + entier + '" fill="none" stroke="#fff" stroke-width="' + (trait + 1) + '"/></mask>';

    return 'justd' + dessin(largeur, '<defs>' + masque + '</defs>' +
      '<g fill="none" stroke-width="' + trait + '" stroke-linejoin="round"><g mask="url(#' + id + ')">' + couches.dessous + '</g>' + couches.boucle + couches.dessus + '</g>');
  }

  /* ---------- Choisir un logo et l'appliquer ---------- */

  function balisage(nom) { return nom === 'cercles' ? cercles() : nom === 'ruban' ? ruban() : origine; }

  function poser(element, nom) {
    element.setAttribute('data-logo', nom);
    element.innerHTML = balisage(nom);
  }

  /* Le mot des trois cercles est en Outfit : la police n'est chargée que s'il le faut, réduite aux quatre lettres utiles. */
  function police(nom) {
    if (nom !== 'cercles' || document.getElementById('police-logo')) return;
    var lien = document.createElement('link');
    lien.id = 'police-logo';
    lien.rel = 'stylesheet';
    lien.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@600&text=just&display=swap';
    document.head.appendChild(lien);
  }

  function choisi() {
    var voulu = null;
    try { voulu = (/[?&]logo=([a-z]+)/.exec(window.location.search) || [])[1] || window.localStorage.getItem(CLE); } catch (e) { /* stockage indisponible */ }
    return NOMS.indexOf(voulu) >= 0 ? voulu : 'actuel';
  }

  function appliquer(nom) {
    police(nom);
    for (var i = 0; i < marques.length; i++) poser(marques[i], nom);
    racine.setAttribute('data-logo', nom);
    var boutons = document.querySelectorAll('.logo-choix');
    for (var j = 0; j < boutons.length; j++) boutons[j].setAttribute('aria-pressed', String(boutons[j].getAttribute('data-choix') === nom));
  }

  function choisir(nom) {
    if (NOMS.indexOf(nom) < 0) return;
    try { window.localStorage.setItem(CLE, nom); } catch (e) { /* le choix vaudra pour cette page seulement */ }
    appliquer(nom);
  }

  /* ---------- La page « Pistes de logo » : ouverte par #logos, elle laisse l'en-tête et l'outil des couleurs en service ---------- */

  var page = document.getElementById('logos');
  var entete = document.getElementById('entete');
  var fonds = [document.getElementById('contenu'), document.querySelector('.pied')];
  var declencheur = document.querySelector('.outil-logos');

  function caler() {
    if (page && !page.hidden && entete) page.style.top = Math.max(0, Math.round(entete.getBoundingClientRect().bottom)) + 'px';
  }

  function ouvrir() {
    if (!page || !page.hidden) return;
    police('cercles');
    page.hidden = false;
    page.scrollTop = 0;
    caler();
    for (var i = 0; i < fonds.length; i++) if (fonds[i]) fonds[i].inert = true;
    racine.classList.add('logos-ouverts');
    var titre = page.querySelector('h2');
    if (titre) titre.focus({ preventScroll: true });
  }

  function fermer() {
    if (!page || page.hidden) return;
    page.hidden = true;
    for (var i = 0; i < fonds.length; i++) if (fonds[i]) fonds[i].inert = false;
    racine.classList.remove('logos-ouverts');
    if (declencheur) declencheur.focus({ preventScroll: true });   /* le focus revient au bouton du pied de page */
  }

  function suivreAdresse() { if (window.location.hash === '#logos') ouvrir(); else fermer(); }

  /* Quitter : on retire #logos de l'adresse sans faire défiler la page, qui reste où elle était. */
  function quitter(evt) {
    if (evt) evt.preventDefault();
    if (window.location.hash === '#logos') window.history.replaceState(null, '', window.location.pathname + window.location.search);
    fermer();
  }

  if (page) {
    var cases = page.querySelectorAll('.lgo[data-logo]');
    for (var c = 0; c < cases.length; c++) poser(cases[c], cases[c].getAttribute('data-logo'));
    page.addEventListener('click', function (evt) {
      var bouton = evt.target.closest ? evt.target.closest('.logo-choix') : null;
      if (bouton) choisir(bouton.getAttribute('data-choix'));
      else if (evt.target.closest && evt.target.closest('[data-logos-quitter]')) quitter(evt);
    });
    document.addEventListener('keydown', function (evt) { if (evt.key === 'Escape' && !page.hidden) quitter(); });
    window.addEventListener('hashchange', suivreAdresse);
    window.addEventListener('resize', caler);
    window.addEventListener('scroll', caler, { passive: true });
  }

  appliquer(choisi());
  if (page) suivreAdresse();

  window.JustdooLogos = { choisir: choisir, choisi: choisi, balisage: balisage };
})();
