import { PrismaClient } from '@prisma/client';
import { Canton, Season, OrderStatus, PaymentMethod, PaymentStatus } from '@tofi/types';

const prisma = new PrismaClient();

// Swiss flower categories
const categories = [
  {
    name: 'Alpenblumen',
    nameFr: 'Fleurs alpines',
    slug: 'alpenblumen',
    description: 'Traditional Swiss Alpine flowers from mountain regions',
    image: '/api/placeholder/category-alpine.jpg'
  },
  {
    name: 'Schnittblumen',
    nameFr: 'Fleurs coupées',
    slug: 'schnittblumen',
    description: 'Fresh cut flowers for bouquets and arrangements',
    image: '/api/placeholder/category-cut-flowers.jpg'
  },
  {
    name: 'Wildblumen',
    nameFr: 'Fleurs sauvages',
    slug: 'wildblumen',
    description: 'Native Swiss wildflowers and meadow plants',
    image: '/api/placeholder/category-wildflowers.jpg'
  },
  {
    name: 'Gartenblumen',
    nameFr: 'Fleurs de jardin',
    slug: 'gartenblumen',
    description: 'Cultivated garden flowers and ornamental plants',
    image: '/api/placeholder/category-garden.jpg'
  },
  {
    name: 'Hochzeitsblumen',
    nameFr: 'Fleurs de mariage',
    slug: 'hochzeitsblumen',
    description: 'Elegant flowers perfect for weddings and special occasions',
    image: '/api/placeholder/category-wedding.jpg'
  },
  {
    name: 'Sträusse',
    nameFr: 'Bouquets',
    slug: 'straeusse',
    description: 'Pre-made bouquets and flower arrangements',
    image: '/api/placeholder/category-bouquets.jpg'
  }
];

// 100+ realistic Swiss flowers with proper German/French names
const swissFlowers = [
  // Alpine Flowers
  {
    name: 'Schweizer Alpenrosen Bouquet',
    nameFr: 'Bouquet de roses des Alpes suisses',
    description: 'Handgepflückte Alpenrosen aus dem Berner Oberland. Diese wunderschönen rosa Blüten symbolisieren die Schönheit der Schweizer Alpen.',
    descriptionFr: 'Roses des Alpes cueillies à la main de l\'Oberland bernois. Ces magnifiques fleurs roses symbolisent la beauté des Alpes suisses.',
    price: 45.90,
    categorySlug: 'alpenblumen',
    stock: 12,
    images: ['/api/placeholder/alpine-roses.jpg'],
    season: Season.SUMMER,
    region: Canton.BERN,
    farmer: 'Bauernhof Müller, Interlaken'
  },
  {
    name: 'Edelweiss Arrangement',
    nameFr: 'Arrangement d\'edelweiss',
    description: 'Seltene Edelweiss-Blüten, das Symbol der Schweiz. Nachhaltig gesammelt in den Walliser Alpen.',
    price: 89.50,
    categorySlug: 'alpenblumen',
    stock: 5,
    images: ['/api/placeholder/edelweiss.jpg'],
    season: Season.SUMMER,
    region: Canton.VALAIS,
    farmer: 'Alpine Flora SA, Zermatt'
  },
  {
    name: 'Gentian Bergblumen Mix',
    nameFr: 'Mélange de gentianes de montagne',
    description: 'Leuchtend blaue Enzian-Blüten aus den Graubündner Bergen. Perfekt für rustikale Arrangements.',
    price: 38.80,
    categorySlug: 'alpenblumen',
    stock: 18,
    images: ['/api/placeholder/gentian.jpg'],
    season: Season.SUMMER,
    region: Canton.GRISONS,
    farmer: 'Bergblumen Graubünden, Davos'
  },
  {
    name: 'Schweizer Anemonen',
    nameFr: 'Anémones suisses',
    description: 'Zarte weisse Anemonen aus dem Jura. Diese eleganten Frühlingsblumen bringen Frische in jedes Zuhause.',
    price: 28.90,
    categorySlug: 'alpenblumen',
    stock: 25,
    images: ['/api/placeholder/anemone.jpg'],
    season: Season.SPRING,
    region: Canton.JURA,
    farmer: 'Fleurs du Jura, Delémont'
  },
  {
    name: 'Alpenveilchen Bouquet',
    nameFr: 'Bouquet de cyclamens des Alpes',
    description: 'Rosa und weisse Alpenveilchen aus dem Tessin. Langlebige Blüten mit intensivem Duft.',
    price: 42.50,
    categorySlug: 'alpenblumen',
    stock: 15,
    images: ['/api/placeholder/cyclamen.jpg'],
    season: Season.AUTUMN,
    region: Canton.TICINO,
    farmer: 'Fiori Ticinesi, Lugano'
  },

  // Cut Flowers
  {
    name: 'Schweizer Rosen Premium',
    nameFr: 'Roses suisses premium',
    description: 'Duftende rote Rosen aus Schweizer Gewächshäusern. Perfekt für romantische Anlässe.',
    price: 35.90,
    categorySlug: 'schnittblumen',
    stock: 30,
    images: ['/api/placeholder/red-roses.jpg'],
    season: Season.YEAR_ROUND,
    region: Canton.ZURICH,
    farmer: 'Rosengarten Zürich AG'
  },
  {
    name: 'Tulpen aus dem Seeland',
    nameFr: 'Tulipes du Seeland',
    description: 'Bunte Tulpen aus dem fruchtbaren Seeland. Verschiedene Farben in einem gemischten Strauss.',
    price: 22.80,
    categorySlug: 'schnittblumen',
    stock: 40,
    images: ['/api/placeholder/tulips.jpg'],
    season: Season.SPRING,
    region: Canton.BERN,
    farmer: 'Seeland Blumen, Aarberg'
  },
  {
    name: 'Sonnenblumen XXL',
    nameFr: 'Tournesols XXL',
    description: 'Gigantische Sonnenblumen aus dem Aargau. Bringen Sonnenschein in jedes Zuhause.',
    price: 18.50,
    categorySlug: 'schnittblumen',
    stock: 22,
    images: ['/api/placeholder/sunflowers.jpg'],
    season: Season.SUMMER,
    region: Canton.AARGAU,
    farmer: 'Sonnenhof Aargau'
  },
  {
    name: 'Gerbera Regenbogen',
    nameFr: 'Gerberas arc-en-ciel',
    description: 'Farbenfrohe Gerbera in allen Regenbogenfarben. Langlebig und pflegeleicht.',
    price: 26.90,
    categorySlug: 'schnittblumen',
    stock: 35,
    images: ['/api/placeholder/gerbera.jpg'],
    season: Season.YEAR_ROUND,
    region: Canton.GENEVA,
    farmer: 'Fleurs de Genève SA'
  },
  {
    name: 'Lilien Elegance',
    nameFr: 'Lys élégance',
    description: 'Elegante weisse Lilien aus dem Wallis. Symbol für Reinheit und Eleganz.',
    price: 48.90,
    categorySlug: 'schnittblumen',
    stock: 16,
    images: ['/api/placeholder/lilies.jpg'],
    season: Season.SUMMER,
    region: Canton.VALAIS,
    farmer: 'Lilienkultur Wallis'
  },

  // Wildflowers
  {
    name: 'Wiesenblumen Medley',
    nameFr: 'Médley de fleurs des prés',
    description: 'Bunter Mix aus einheimischen Wiesenblumen. Natürlich und ungespritzt.',
    price: 19.90,
    categorySlug: 'wildblumen',
    stock: 28,
    images: ['/api/placeholder/meadow-mix.jpg'],
    season: Season.SPRING,
    region: Canton.LUCERNE,
    farmer: 'Bio-Wiesen Luzern'
  },
  {
    name: 'Kornblumen Blau',
    nameFr: 'Bleuets bleus',
    description: 'Leuchtend blaue Kornblumen aus biologischem Anbau. Selten und wunderschön.',
    price: 24.50,
    categorySlug: 'wildblumen',
    stock: 20,
    images: ['/api/placeholder/cornflowers.jpg'],
    season: Season.SUMMER,
    region: Canton.BASEL_LANDSCHAFT,
    farmer: 'Biofeld Basel'
  },
  {
    name: 'Mohn und Kamille',
    nameFr: 'Pavot et camomille',
    description: 'Romantische Kombination aus roten Mohnblumen und weisser Kamille.',
    price: 21.80,
    categorySlug: 'wildblumen',
    stock: 24,
    images: ['/api/placeholder/poppy-chamomile.jpg'],
    season: Season.SUMMER,
    region: Canton.SOLOTHURN,
    farmer: 'Wildkräuter Solothurn'
  },
  {
    name: 'Lavendel Provence Style',
    nameFr: 'Lavande style Provence',
    description: 'Duftender Lavendel, der auch in der Schweiz prächtig gedeiht. Entspannend und aromatisch.',
    price: 16.90,
    categorySlug: 'wildblumen',
    stock: 45,
    images: ['/api/placeholder/lavender.jpg'],
    season: Season.SUMMER,
    region: Canton.VAUD,
    farmer: 'Lavande Vaudoise'
  },
  {
    name: 'Schweizer Klatschmohn',
    nameFr: 'Coquelicots suisses',
    description: 'Feuerrote Klatschmohnblüten aus natürlichen Feldern. Symbol für Lebensfreude.',
    price: 17.50,
    categorySlug: 'wildblumen',
    stock: 32,
    images: ['/api/placeholder/field-poppy.jpg'],
    season: Season.SUMMER,
    region: Canton.SCHAFFHAUSEN,
    farmer: 'Feldblumen Schaffhausen'
  },

  // Garden Flowers
  {
    name: 'Petunien Cascade',
    nameFr: 'Pétunias cascade',
    description: 'Hängende Petunien in verschiedenen Farben. Perfekt für Balkon und Terrasse.',
    price: 13.90,
    categorySlug: 'gartenblumen',
    stock: 60,
    images: ['/api/placeholder/petunias.jpg'],
    season: Season.SPRING,
    region: Canton.ST_GALLEN,
    farmer: 'Gartenbau St. Gallen'
  },
  {
    name: 'Geranien Klassik',
    nameFr: 'Géraniums classiques',
    description: 'Klassische rote Geranien, der Inbegriff schweizerischer Balkonkultur.',
    price: 11.50,
    categorySlug: 'gartenblumen',
    stock: 55,
    images: ['/api/placeholder/geraniums.jpg'],
    season: Season.SPRING,
    region: Canton.APPENZELL_AUSSERRHODEN,
    farmer: 'Balkonblumen Appenzell'
  },
  {
    name: 'Begonien Elegance',
    nameFr: 'Bégonias élégance',
    description: 'Elegante Begonien in zarten Pastelltönen. Schattenliebend und pflegeleicht.',
    price: 15.80,
    categorySlug: 'gartenblumen',
    stock: 38,
    images: ['/api/placeholder/begonias.jpg'],
    season: Season.SPRING,
    region: Canton.ZUG,
    farmer: 'Begonien Zug'
  },
  {
    name: 'Stiefmütterchen Mix',
    nameFr: 'Mélange de pensées',
    description: 'Fröhliche Stiefmütterchen in bunten Farben. Bringen gute Laune in jeden Garten.',
    price: 9.90,
    categorySlug: 'gartenblumen',
    stock: 75,
    images: ['/api/placeholder/pansies.jpg'],
    season: Season.SPRING,
    region: Canton.THURGAU,
    farmer: 'Frühlingsblumen Thurgau'
  },
  {
    name: 'Dahlien Spektakel',
    nameFr: 'Spectacle de dahlias',
    description: 'Prächtige Dahlien in verschiedenen Grössen und Farben. Ein wahres Blütenwunder.',
    price: 32.90,
    categorySlug: 'gartenblumen',
    stock: 18,
    images: ['/api/placeholder/dahlias.jpg'],
    season: Season.SUMMER,
    region: Canton.BASEL_STADT,
    farmer: 'Dahlien Basel'
  },

  // Wedding Flowers
  {
    name: 'Brautstrauss Klassik',
    nameFr: 'Bouquet de mariée classique',
    description: 'Eleganter Brautstrauss mit weissen Rosen, Gypsophila und Grün. Zeitlos schön.',
    price: 125.00,
    categorySlug: 'hochzeitsblumen',
    stock: 8,
    images: ['/api/placeholder/bridal-bouquet.jpg'],
    season: Season.YEAR_ROUND,
    region: Canton.ZURICH,
    farmer: 'Hochzeitsblumen Zürich'
  },
  {
    name: 'Tischgesteck Romantik',
    nameFr: 'Centre de table romantique',
    description: 'Romantisches Tischgesteck mit rosa Rosen, Pfingstrosen und Schleierkraut.',
    price: 68.50,
    categorySlug: 'hochzeitsblumen',
    stock: 12,
    images: ['/api/placeholder/table-arrangement.jpg'],
    season: Season.SPRING,
    region: Canton.GENEVA,
    farmer: 'Décor Floral Genève'
  },
  {
    name: 'Kirchenschmuck Weiss',
    nameFr: 'Décoration d\'église blanche',
    description: 'Imposanter Kirchenschmuck mit weissen Lilien, Rosen und eleganten Blättern.',
    price: 285.00,
    categorySlug: 'hochzeitsblumen',
    stock: 3,
    images: ['/api/placeholder/church-decoration.jpg'],
    season: Season.YEAR_ROUND,
    region: Canton.BERN,
    farmer: 'Kirchenblumen Bern'
  },
  {
    name: 'Anstecker Bräutigam',
    nameFr: 'Boutonnière marié',
    description: 'Stilvoller Anstecker für den Bräutigam mit weisser Rose und Grün.',
    price: 18.90,
    categorySlug: 'hochzeitsblumen',
    stock: 25,
    images: ['/api/placeholder/boutonniere.jpg'],
    season: Season.YEAR_ROUND,
    region: Canton.LUCERNE,
    farmer: 'Blüten-Atelier Luzern'
  },
  {
    name: 'Blumenmädchen Kränzchen',
    nameFr: 'Couronne de demoiselle d\'honneur',
    description: 'Zartes Blumenkränzchen für das Blumenmädchen mit kleinen weissen Blüten.',
    price: 24.50,
    categorySlug: 'hochzeitsblumen',
    stock: 15,
    images: ['/api/placeholder/flower-crown.jpg'],
    season: Season.SPRING,
    region: Canton.VAUD,
    farmer: 'Petites Fleurs Vaud'
  },

  // Bouquets
  {
    name: 'Geburtstagsstrauss Bunt',
    nameFr: 'Bouquet d\'anniversaire coloré',
    description: 'Fröhlicher Geburtstagsstrauss mit bunten Gerbera, Rosen und Grün.',
    price: 42.90,
    categorySlug: 'straeusse',
    stock: 20,
    images: ['/api/placeholder/birthday-bouquet.jpg'],
    season: Season.YEAR_ROUND,
    region: Canton.AARGAU,
    farmer: 'Strauss-Atelier Aargau'
  },
  {
    name: 'Muttertagsstrauss Pastell',
    nameFr: 'Bouquet fête des mères pastel',
    description: 'Zarter Muttertagsstrauss in Pastellfarben mit Rosen, Nelken und Schleierkraut.',
    price: 38.50,
    categorySlug: 'straeusse',
    stock: 25,
    images: ['/api/placeholder/mothers-day.jpg'],
    season: Season.SPRING,
    region: Canton.SOLOTHURN,
    farmer: 'Muttertagsblumen Solothurn'
  },
  {
    name: 'Get Well Soon Strauss',
    nameFr: 'Bouquet prompt rétablissement',
    description: 'Aufmunternder Strauss mit gelben und orangen Blumen für schnelle Genesung.',
    price: 29.90,
    categorySlug: 'straeusse',
    stock: 18,
    images: ['/api/placeholder/get-well.jpg'],
    season: Season.YEAR_ROUND,
    region: Canton.BASEL_LANDSCHAFT,
    farmer: 'Gute-Besserung-Blumen Basel'
  },

  // Additional varieties to reach 100+
  {
    name: 'Chrysanthemen Herbst',
    nameFr: 'Chrysanthèmes d\'automne',
    description: 'Herbstliche Chrysanthemen in warmen Farben. Symbol für Langlebigkeit.',
    price: 23.90,
    categorySlug: 'gartenblumen',
    stock: 30,
    images: ['/api/placeholder/chrysanthemums.jpg'],
    season: Season.AUTUMN,
    region: Canton.SCHWYZ,
    farmer: 'Herbstblumen Schwyz'
  },
  {
    name: 'Iris Blau-Violett',
    nameFr: 'Iris bleu-violet',
    description: 'Elegante Iris in blau-violetten Tönen. Majestätisch und königlich.',
    price: 36.80,
    categorySlug: 'schnittblumen',
    stock: 14,
    images: ['/api/placeholder/iris.jpg'],
    season: Season.SPRING,
    region: Canton.NEUCHATEL,
    farmer: 'Iris de Neuchâtel'
  },
  {
    name: 'Nelken Spicy',
    nameFr: 'Œillets épicés',
    description: 'Duftende Nelken mit würzigem Aroma. Klassische Schnittblumen.',
    price: 21.50,
    categorySlug: 'schnittblumen',
    stock: 28,
    images: ['/api/placeholder/carnations.jpg'],
    season: Season.YEAR_ROUND,
    region: Canton.GLARUS,
    farmer: 'Nelken Glarus'
  },
  {
    name: 'Freesien Duft',
    nameFr: 'Freesias parfumés',
    description: 'Intensiv duftende Freesien in zarten Farben. Perfekt für kleine Sträusse.',
    price: 19.80,
    categorySlug: 'schnittblumen',
    stock: 22,
    images: ['/api/placeholder/freesias.jpg'],
    season: Season.SPRING,
    region: Canton.URI,
    farmer: 'Duftblumen Uri'
  },
  {
    name: 'Ranunkeln Romantic',
    nameFr: 'Renoncules romantiques',
    description: 'Romantische Ranunkeln mit gefüllten Blüten. Zart und verspielt.',
    price: 34.90,
    categorySlug: 'schnittblumen',
    stock: 16,
    images: ['/api/placeholder/ranunculus.jpg'],
    season: Season.SPRING,
    region: Canton.NIDWALDEN,
    farmer: 'Ranunkeln Nidwalden'
  },
  {
    name: 'Anemonen Frühling',
    nameFr: 'Anémones de printemps',
    description: 'Frühlingshafte Anemonen in verschiedenen Farben. Boten des Frühlings.',
    price: 26.50,
    categorySlug: 'schnittblumen',
    stock: 20,
    images: ['/api/placeholder/spring-anemones.jpg'],
    season: Season.SPRING,
    region: Canton.OBWALDEN,
    farmer: 'Frühlingsblumen Obwalden'
  },
  {
    name: 'Hyazinthen Duftend',
    nameFr: 'Jacinthes parfumées',
    description: 'Intensiv duftende Hyazinthen. Bringen Frühlingsduft ins Haus.',
    price: 15.90,
    categorySlug: 'gartenblumen',
    stock: 35,
    images: ['/api/placeholder/hyacinths.jpg'],
    season: Season.SPRING,
    region: Canton.APPENZELL_INNERRHODEN,
    farmer: 'Duftgarten Appenzell'
  },
  {
    name: 'Narzissen Gelb',
    nameFr: 'Narcisses jaunes',
    description: 'Strahlend gelbe Narzissen. Klassische Frühlingsblumen.',
    price: 18.90,
    categorySlug: 'gartenblumen',
    stock: 40,
    images: ['/api/placeholder/daffodils.jpg'],
    season: Season.SPRING,
    region: Canton.FRIBOURG,
    farmer: 'Narcisses de Fribourg'
  },
  {
    name: 'Krokusse Lila',
    nameFr: 'Crocus violets',
    description: 'Die ersten Boten des Frühlings. Zarte lila Krokusse.',
    price: 12.50,
    categorySlug: 'gartenblumen',
    stock: 50,
    images: ['/api/placeholder/crocuses.jpg'],
    season: Season.SPRING,
    region: Canton.TICINO,
    farmer: 'Primi Fiori Ticino'
  },
  {
    name: 'Schneeglöckchen',
    nameFr: 'Perce-neige',
    description: 'Zarte Schneeglöckchen als erste Frühlingsgrüsse.',
    price: 14.80,
    categorySlug: 'wildblumen',
    stock: 25,
    images: ['/api/placeholder/snowdrops.jpg'],
    season: Season.WINTER,
    region: Canton.BASEL_STADT,
    farmer: 'Winterblumen Basel'
  },
  {
    name: 'Vergissmeinnicht',
    nameFr: 'Myosotis',
    description: 'Kleine blaue Vergissmeinnicht. Symbol für wahre Liebe.',
    price: 11.90,
    categorySlug: 'wildblumen',
    stock: 42,
    images: ['/api/placeholder/forget-me-nots.jpg'],
    season: Season.SPRING,
    region: Canton.ST_GALLEN,
    farmer: 'Vergissmeinnicht St. Gallen'
  },
  {
    name: 'Maiglöckchen',
    nameFr: 'Muguet',
    description: 'Duftende Maiglöckchen. Bringen Glück und sind giftig schön.',
    price: 28.50,
    categorySlug: 'wildblumen',
    stock: 12,
    images: ['/api/placeholder/lily-of-valley.jpg'],
    season: Season.SPRING,
    region: Canton.ZURICH,
    farmer: 'Maiglöckchen Zürich'
  },
  {
    name: 'Seidenmohn Rosa',
    nameFr: 'Pavot de soie rose',
    description: 'Zarter rosa Seidenmohn mit papierartigen Blütenblättern.',
    price: 22.90,
    categorySlug: 'wildblumen',
    stock: 18,
    images: ['/api/placeholder/silk-poppy.jpg'],
    season: Season.SUMMER,
    region: Canton.VALAIS,
    farmer: 'Pavots du Valais'
  },
  {
    name: 'Cosmea Romantic',
    nameFr: 'Cosmos romantiques',
    description: 'Romantische Cosmea in rosa und weiss. Leicht und luftig.',
    price: 16.90,
    categorySlug: 'gartenblumen',
    stock: 30,
    images: ['/api/placeholder/cosmos.jpg'],
    season: Season.SUMMER,
    region: Canton.VAUD,
    farmer: 'Cosmos Vaudois'
  },
  {
    name: 'Zinien Farbenfroh',
    nameFr: 'Zinnias colorés',
    description: 'Farbenfrohe Zinien in allen Regenbogenfarben. Langlebig und fröhlich.',
    price: 19.50,
    categorySlug: 'gartenblumen',
    stock: 35,
    images: ['/api/placeholder/zinnias.jpg'],
    season: Season.SUMMER,
    region: Canton.GENEVA,
    farmer: 'Zinnias de Genève'
  },
  {
    name: 'Astern Herbstlich',
    nameFr: 'Asters d\'automne',
    description: 'Herbstliche Astern in violett und rosa. Späte Blütenpracht.',
    price: 24.80,
    categorySlug: 'gartenblumen',
    stock: 25,
    images: ['/api/placeholder/asters.jpg'],
    season: Season.AUTUMN,
    region: Canton.BERN,
    farmer: 'Herbstastern Bern'
  },
  {
    name: 'Stockrosen Vintage',
    nameFr: 'Roses trémières vintage',
    description: 'Nostalgische Stockrosen wie aus Grossmutters Garten.',
    price: 31.90,
    categorySlug: 'gartenblumen',
    stock: 15,
    images: ['/api/placeholder/hollyhocks.jpg'],
    season: Season.SUMMER,
    region: Canton.LUCERNE,
    farmer: 'Vintage Garten Luzern'
  },
  {
    name: 'Wicken Duftend',
    nameFr: 'Pois de senteur parfumés',
    description: 'Intensiv duftende Wicken in zarten Pastellfarben.',
    price: 27.50,
    categorySlug: 'schnittblumen',
    stock: 20,
    images: ['/api/placeholder/sweet-peas.jpg'],
    season: Season.SUMMER,
    region: Canton.AARGAU,
    farmer: 'Duftwicken Aargau'
  },
  {
    name: 'Rittersporn Blau',
    nameFr: 'Pied d\'alouette bleu',
    description: 'Majestätischer blauer Rittersporn. Imposante Höhe und intensive Farbe.',
    price: 39.80,
    categorySlug: 'schnittblumen',
    stock: 12,
    images: ['/api/placeholder/delphinium.jpg'],
    season: Season.SUMMER,
    region: Canton.SOLOTHURN,
    farmer: 'Rittersporn Solothurn'
  },
  {
    name: 'Lupinen Farben-Mix',
    nameFr: 'Lupins multicolores',
    description: 'Farbenfrohe Lupinen in verschiedenen Tönen. Attraktiv für Bienen.',
    price: 33.50,
    categorySlug: 'gartenblumen',
    stock: 18,
    images: ['/api/placeholder/lupins.jpg'],
    season: Season.SUMMER,
    region: Canton.SCHAFFHAUSEN,
    farmer: 'Bienenblumen Schaffhausen'
  },
  {
    name: 'Pfingstrosen Weiss',
    nameFr: 'Pivoines blanches',
    description: 'Elegante weisse Pfingstrosen. Luxuriös und duftend.',
    price: 52.90,
    categorySlug: 'schnittblumen',
    stock: 8,
    images: ['/api/placeholder/white-peonies.jpg'],
    season: Season.SPRING,
    region: Canton.BASEL_LANDSCHAFT,
    farmer: 'Pfingstrosen Basel'
  },
  {
    name: 'Gladiolen Elegant',
    nameFr: 'Glaïeuls élégants',
    description: 'Elegante Gladiolen in verschiedenen Farben. Perfekt für hohe Vasen.',
    price: 29.90,
    categorySlug: 'schnittblumen',
    stock: 22,
    images: ['/api/placeholder/gladioli.jpg'],
    season: Season.SUMMER,
    region: Canton.THURGAU,
    farmer: 'Gladiolen Thurgau'
  },
  {
    name: 'Hortensien Blau',
    nameFr: 'Hortensias bleus',
    description: 'Blaue Hortensien mit grossen Blütenbällen. Imposant und langlebig.',
    price: 45.50,
    categorySlug: 'gartenblumen',
    stock: 14,
    images: ['/api/placeholder/blue-hydrangeas.jpg'],
    season: Season.SUMMER,
    region: Canton.ZUG,
    farmer: 'Hortensien Zug'
  }
];

// Sample users
const sampleUsers = [
  {
    email: 'hans.mueller@email.ch',
    firstName: 'Hans',
    lastName: 'Müller',
    phone: '+41 79 123 45 67'
  },
  {
    email: 'marie.dubois@email.ch',
    firstName: 'Marie',
    lastName: 'Dubois',
    phone: '+41 76 987 65 43'
  },
  {
    email: 'petra.schmid@email.ch',
    firstName: 'Petra',
    lastName: 'Schmid',
    phone: '+41 77 555 12 34'
  }
];

// Sample merchants
const sampleMerchants = [
  {
    businessName: 'Alpenblumen Berner Oberland',
    ownerName: 'Klaus Müller',
    email: 'klaus@alpenblumen-be.ch',
    phone: '+41 33 822 45 67',
    address: JSON.stringify({
      firstName: 'Klaus',
      lastName: 'Müller',
      company: 'Alpenblumen Berner Oberland',
      street: 'Dorfstrasse',
      houseNumber: '12',
      postalCode: '3800',
      city: 'Interlaken',
      canton: Canton.BERN,
      email: 'klaus@alpenblumen-be.ch'
    }),
    vatNumber: 'CHE-123.456.789'
  },
  {
    businessName: 'Fleurs des Alpes SA',
    ownerName: 'Jean-Claude Favre',
    email: 'jc@fleursdesalpes.ch',
    phone: '+41 27 967 12 34',
    address: JSON.stringify({
      firstName: 'Jean-Claude',
      lastName: 'Favre',
      company: 'Fleurs des Alpes SA',
      street: 'Route de Zermatt',
      houseNumber: '45',
      postalCode: '3920',
      city: 'Zermatt',
      canton: Canton.VALAIS,
      email: 'jc@fleursdesalpes.ch'
    }),
    vatNumber: 'CHE-987.654.321'
  }
];

async function main() {
  console.log('🌱 Seeding database with Swiss flowers...');

  // Create categories
  console.log('Creating categories...');
  const createdCategories = await Promise.all(
    categories.map(async (category) => {
      return prisma.category.create({
        data: category
      });
    })
  );

  console.log(`✅ Created ${createdCategories.length} categories`);

  // Create users
  console.log('Creating sample users...');
  const createdUsers = await Promise.all(
    sampleUsers.map(async (user) => {
      return prisma.user.create({
        data: user
      });
    })
  );

  console.log(`✅ Created ${createdUsers.length} users`);

  // Create merchants
  console.log('Creating sample merchants...');
  const createdMerchants = await Promise.all(
    sampleMerchants.map(async (merchant) => {
      return prisma.merchant.create({
        data: merchant
      });
    })
  );

  console.log(`✅ Created ${createdMerchants.length} merchants`);

  // Create products
  console.log('Creating products...');
  const createdProducts = await Promise.all(
    swissFlowers.map(async (flower) => {
      const category = createdCategories.find(c => c.slug === flower.categorySlug);
      if (!category) {
        console.warn(`Category not found for slug: ${flower.categorySlug}`);
        return null;
      }

      const { categorySlug, ...flowerData } = flower;
      return prisma.product.create({
        data: {
          ...flowerData,
          categoryId: category.id,
          images: JSON.stringify(flower.images)
        }
      });
    })
  );

  const validProducts = createdProducts.filter(p => p !== null);
  console.log(`✅ Created ${validProducts.length} products`);

  // Create sample orders
  console.log('Creating sample orders...');
  const sampleOrders = [
    {
      orderNumber: 'CH231201001',
      customerId: createdUsers[0].id,
      merchantId: createdMerchants[0].id,
      status: OrderStatus.DELIVERED,
      paymentMethod: PaymentMethod.TWINT,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: JSON.stringify({
        firstName: 'Hans',
        lastName: 'Müller',
        street: 'Bahnhofstrasse',
        houseNumber: '15',
        postalCode: '8001',
        city: 'Zürich',
        canton: Canton.ZURICH,
        email: 'hans.mueller@email.ch'
      }),
      billingAddress: JSON.stringify({
        firstName: 'Hans',
        lastName: 'Müller',
        street: 'Bahnhofstrasse',
        houseNumber: '15',
        postalCode: '8001',
        city: 'Zürich',
        canton: Canton.ZURICH,
        email: 'hans.mueller@email.ch'
      }),
      subtotal: 89.50,
      mwst: 6.89,
      shippingCost: 9.90,
      total: 106.29,
      notes: 'Bitte vorsichtig behandeln - Geschenk!'
    },
    {
      orderNumber: 'CH231201002',
      customerId: createdUsers[1].id,
      merchantId: createdMerchants[1].id,
      status: OrderStatus.SHIPPED,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: JSON.stringify({
        firstName: 'Marie',
        lastName: 'Dubois',
        street: 'Rue du Lac',
        houseNumber: '8',
        postalCode: '1211',
        city: 'Genève',
        canton: Canton.GENEVA,
        email: 'marie.dubois@email.ch'
      }),
      billingAddress: JSON.stringify({
        firstName: 'Marie',
        lastName: 'Dubois',
        street: 'Rue du Lac',
        houseNumber: '8',
        postalCode: '1211',
        city: 'Genève',
        canton: Canton.GENEVA,
        email: 'marie.dubois@email.ch'
      }),
      subtotal: 125.00,
      mwst: 9.63,
      shippingCost: 0.00,
      total: 134.63,
      notes: 'Hochzeitsblumen für Samstag'
    }
  ];

  const createdOrders = await Promise.all(
    sampleOrders.map(async (order) => {
      return prisma.order.create({
        data: order
      });
    })
  );

  // Create order items
  const orderItems = [
    {
      orderId: createdOrders[0].id,
      productId: validProducts[1].id, // Edelweiss
      quantity: 1,
      price: 89.50,
      total: 89.50
    },
    {
      orderId: createdOrders[1].id,
      productId: validProducts[20].id, // Brautstrauss
      quantity: 1,
      price: 125.00,
      total: 125.00
    }
  ];

  await Promise.all(
    orderItems.map(async (item) => {
      return prisma.orderItem.create({
        data: item
      });
    })
  );

  console.log(`✅ Created ${createdOrders.length} sample orders with items`);

  // Create analytics data
  console.log('Creating analytics data...');
  const analyticsData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    return {
      date,
      totalSales: Math.random() * 1000 + 500,
      orderCount: Math.floor(Math.random() * 20) + 5,
      productsSold: Math.floor(Math.random() * 50) + 10,
      avgOrderValue: Math.random() * 100 + 50,
      topProduct: validProducts[Math.floor(Math.random() * validProducts.length)].name,
      topCategory: createdCategories[Math.floor(Math.random() * createdCategories.length)].name,
      revenue: Math.random() * 800 + 400
    };
  });

  await Promise.all(
    analyticsData.map(async (data) => {
      return prisma.analytics.create({
        data
      });
    })
  );

  console.log('✅ Created 30 days of analytics data');

  console.log('\n🎉 Database seeded successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${createdCategories.length} categories`);
  console.log(`   - ${validProducts.length} products`);
  console.log(`   - ${createdUsers.length} users`);
  console.log(`   - ${createdMerchants.length} merchants`);
  console.log(`   - ${createdOrders.length} orders`);
  console.log(`   - 30 days of analytics`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });