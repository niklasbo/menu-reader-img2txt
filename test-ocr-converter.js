const test = require('ava')
const { Meal, Week, Day } = require("./models")
const { ocrResultsToWeekDayMeal } = require('./ocr-converter')

test('day', t => {
    t.deepEqual(ocrResultsToWeekDayMeal(50, test_data_one_day),
        new Week(50, [
            new Day('Montag', '13.12.2021',
                [
                    new Meal('Aus der Kokotte Hackfleisch-Kartoffel-Auflauf mit Mozzarella', '4,50€', ['aw', 'uw', 'am', '23', 'bc'], ['Rind', 'Schwein']),
                    new Meal('Caponata di melanzane mit Auberginen-Tomatensauce mit Kapern, Rosinen, Oliven, Pinienkerne, Couscous & Joghurt', '4,00€ 2,40€', ['aw', 'uw', '2', '23', 'am', 'au'], ['Vegetarisch']),
                ]),
        ])
    )
});

test('day-closing-parenthesis-missing', t => {
    t.deepEqual(ocrResultsToWeekDayMeal(50, test_data_one_day_broken_closing_parenthesis),
        new Week(50, [
            new Day('Montag', '13.12.2021',
                [
                    new Meal('Aus der Kokotte Hackfleisch-Kartoffel-Auflauf mit Mozzarella', '4,50€', ['aw', 'uw', 'am', '23', 'bc'], ['Rind', 'Schwein']),
                    new Meal('Caponata di melanzane mit Auberginen-Tomatensauce mit Kapern, Rosinen, Oliven, Pinienkerne, Couscous & Joghurt', '4,00€ 2,40€', ['aw', 'uw', '2', '23', 'am', 'au'], ['Vegetarisch']),
                ]),
        ])
    )
});

test('day-opening-parenthesis-missing', t => {
    t.deepEqual(ocrResultsToWeekDayMeal(50, test_data_one_day_broken_opening_parenthesis),
        new Week(50, [
            new Day('Montag', '13.12.2021',
                [
                    new Meal('Aus der Kokotte Hackfleisch-Kartoffel-Auflauf mit Mozzarella', '4,50€', ['aw', 'uw', 'am', '23', 'bc'], ['Rind', 'Schwein']),
                    new Meal('Caponata di melanzane mit Auberginen-Tomatensauce mit Kapern, Rosinen, Oliven, Pinienkerne, Couscous & Joghurt', '4,00€ 2,40€', ['aw', 'uw', '2', '23', 'am', 'au'], ['Vegetarisch']),
                ]),
        ])
    )
});

test('week', async t => {
    t.deepEqual(ocrResultsToWeekDayMeal(50, test_data_week),
        new Week(50, [
            new Day('Montag', '13.12.2021',
                [
                    new Meal(
                        'Aus der Kokotte Hackfleisch-Kartoffel-Auflauf mit Mozzarella',
                        '4,50€',
                        ['aw', 'uw', 'am', '23', 'bc'],
                        ['Rind', 'Schwein']
                    ),
                    new Meal(
                        'Caponata di melanzane mit Auberginen-Tomatensauce mit Kapern, Rosinen, Oliven, Pinienkerne, Couscous & Joghurt',
                        '4,00€ 2,40€',
                        ['aw', 'uw', '2', '23', 'am', 'au'],
                        ['Vegetarisch']
                    )]),
            new Day('Dienstag', '14.12.2021', [
                new Meal(
                    'Kartoffel-Lauch-Gulasch mit Ei frischem Lauch, Möhren, Kartoffeln und roten Zwiebeln',
                    '4,00€ 2,40€',
                    ['am', '23', 'bc'],
                    ['Vegetarisch']
                ),
                new Meal(
                    'Paniertes Seelachsfilet mit hausgemachtem Kartoffelpüree, Linsen-Brokkoligemüse & Joghurtdip',
                    '5,80€',
                    ['aw', 'uw', 'af', 'am', 'bm'],
                    ['Fisch']
                )]),
            new Day('Mittwoch', '15.12.2021', [
                new Meal(
                    'Wildgulasch im Pilzrahmsauce dazu hausgemachter Apfelrotkohl und Spätzle',
                    '8,50€',
                    ['am', 'au', '2'],
                    ['Anderes Fleisch']
                ),
                new Meal(
                    'Vegane Mexikanische Chili-Linsen mit Paprika, Mais, Zwiebeln, schwarzen Bohnen und Vollkornreis',
                    '4,00€ 2,40€',
                    ['2', '23', 'bc'],
                    ['Vegan']
                )]),
            new Day('Donnerstag', '16.12.2021', [
                new Meal(
                    'Gebratenes Putenschnitzel an Erbsen & Möhren in Petersilienrahm dazu Dampfkartoffeln',
                    '5,60€ 3,40€',
                    ['am', 'aw', 'uw'],
                    ['Geflügel']
                ),
                new Meal(
                    'Bunte Gnocchipfanne an fruchtiger Tomatensauce, Rucola, Kirschtomaten und Parmesan',
                    '4,50€',
                    ['am', 'ae', '2', 'aw', 'uw'],
                    ['Vegetarisch']
                )]),
            new Day('Freitag', '17.12.2021', [
                new Meal(
                    'Gebratene Currywurst mit Pommes frites',
                    '3,50€ 2,10€',
                    [],
                    ['Schwein']
                ),
                new Meal(
                    'Farfalle an frischer Champignonsahnesauce, Parmesan und Salatbeilage',
                    '4,00€ 2,40€',
                    ['am', 'ae', '2', 'au'],
                    ['Vegetarisch']
                )]),
        ]
        )
    )
});

const test_data_one_day = [
    'Gutes aus der Region\nAus der Kokotte Hackfleisch-\nKartoffel-Auflauf mit Mozzarella\n(R,S,aw,uw,am,23,bc)\n4,50€\nCaponata di melanzane mit\nAuberginen-Tomatensauce mit\nKapern , Rosinen, Oliven,\nPinienkerne ,Couscous & Joghurt\n(V,aw,uw,2,23,am,au)\n4,00 € 2,40€\n',
]

const test_data_one_day_broken_closing_parenthesis = [
    'Gutes aus der Region\nAus der Kokotte Hackfleisch-\nKartoffel-Auflauf mit Mozzarella\n(R,S,aw,uw,am,23,bc\n4,50€\nCaponata di melanzane mit\nAuberginen-Tomatensauce mit\nKapern , Rosinen, Oliven,\nPinienkerne ,Couscous & Joghurt\n(V,aw,uw,2,23,am,au)\n4,00 € 2,40€\n',
]

const test_data_one_day_broken_opening_parenthesis = [
    'Gutes aus der Region\nAus der Kokotte Hackfleisch-\nKartoffel-Auflauf mit Mozzarella\nR,S,aw,uw,am,23,bc)\n4,50€\nCaponata di melanzane mit\nAuberginen-Tomatensauce mit\nKapern , Rosinen, Oliven,\nPinienkerne ,Couscous & Joghurt\n(V,aw,uw,2,23,am,au)\n4,00 € 2,40€\n',
]

const test_data_week = [
    'Gutes aus der Region\n' +
    'Aus der Kokotte Hackfleisch-\n' +
    'Kartoffel-Auflauf mit Mozzarella\n' +
    '(R,S,aw,uw,am,23,bc)\n' +
    '4,50€\n' +
    'Caponata di melanzane mit\n' +
    'Auberginen-Tomatensauce mit\n' +
    'Kapern , Rosinen, Oliven,\n' +
    'Pinienkerne ,Couscous & Joghurt\n' +
    '(V,aw,uw,2,23,am,au)\n' +
    '4,00 € 2,40€\n',
    '0,00 €\n' +
    'Kartoffel-Lauch-Gulasch mit Ei\n' +
    'frischem Lauch, Möhren, Kartoffeln\n' +
    'und roten Zwiebeln (V,am,23,bc)\n' +
    '\n' +
    '4,00 € 2,40 €\n' +
    'Paniertes Seelachsfilet\n' +
    'mit hausgemachtem Kartoffelpüree,\n' +
    'Linsen-\n' +
    'Brokkoligemüse & Joghurtdip (F,\n' +
    'aw, uw, af, am, bm)\n' +
    '5,80 € 0,00 €\n',
    'Gutes aus der Region\n' +
    'Wildgulasch im Pilzrahmsauce dazu\n' +
    'hausgemachter Apfelrotkohl und\n' +
    'Spätzle (X,am,au,2))\n' +
    '\n' +
    '8,50€ 0,00 €\n' +
    'Vegane Mexikanische Chili-Linsen\n' +
    'mit Paprika, Mais, Zwiebeln,\n' +
    'schwarzen Bohnen und Vollkornreis\n' +
    '(VN,2,23,bc)\n' +
    '4,00€ 2,40€\n',
    'Gutes aus der Region\n' +
    'Gebratenes Putenschnitzel an\n' +
    'Erbsen & Möhren in Petersilienrahm\n' +
    'dazu Dampfkartoffeln(G,am,aw,uw)\n' +
    '\n' +
    '5,60€ 3,40€\n' +
    'Bunte Gnocchipfanne an fruchtiger\n' +
    'Tomatensauce, Rucola,\n' +
    'Kirschtomaten und Parmesan\n' +
    '(V,am,ae,2,aw,uw)\n' +
    '4,50€ 0,00 €\n',
    'Gebratene Currywurst mit\n' +
    'Pommes frites (S)\n' +
    '3,50€ 2,10€\n' +
    'Farfalle an frischer\n' +
    'Champignonsahnesauce,\n' +
    'Parmesan und Salatbeilage\n' +
    '(V,am,ae,2,au)\n' +
    '4,00 € 2,40€\n'
]
