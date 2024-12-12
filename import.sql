-- Création de la base de données et du schéma
-- DROP DATABASE shiftingpact_db;
-- CREATE DATABASE shiftingpact_db;
DROP SCHEMA IF EXISTS shiftingpact_db CASCADE;
CREATE SCHEMA shiftingpact_db;

CREATE TABLE shiftingpact_db.enjeux (
    id_enjeu SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    enjeu_parent INT REFERENCES shiftingpact_db.enjeux(id_enjeu) NULL
);

CREATE TABLE shiftingpact_db.templates (
    id_template SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

CREATE TABLE shiftingpact_db.admin (
    id_admin SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mdp VARCHAR(255) NOT NULL,
    role VARCHAR(255) NULL
);

CREATE TABLE shiftingpact_db.clients (
    id_client SERIAL PRIMARY KEY,
    prenom VARCHAR(255) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    fonction VARCHAR(255) NOT NULL,
    nom_entreprise VARCHAR(255) NOT NULL,
    numero_tva VARCHAR(255) NOT NULL,
    forme_juridique VARCHAR(5000) NOT NULL,
    adresse_siege_social VARCHAR(5000) NOT NULL,
    adresse_site_web VARCHAR(5000) NOT NULL,
    code_nace_activite_principal VARCHAR(255) NOT NULL,
    chiffre_affaire_du_dernier_exercice_fiscal INT NOT NULL,
    franchise BOOLEAN NOT NULL,
    nombre_travailleurs INT NOT NULL,
    raison_refus VARCHAR(5000) NULL,
    litige_respect_loi_social_environnemental BOOLEAN NOT NULL,
    honnete BOOLEAN NOT NULL,
    soumission_demande_de_subside_pour_le_label BOOLEAN NOT NULL,
    partenaire_introduction VARCHAR(255) NOT NULL,
    ajouter_autre_chose BOOLEAN NOT NULL,
    remarque_commentaire_precision VARCHAR(5000) NULL,
    date_de_soumission DATE NOT NULL DEFAULT CURRENT_DATE,
    est_valide VARCHAR(255) CHECK (clients.est_valide IN ('validée', 'refusée', 'N/D')) NOT NULL DEFAULT 'N/D',
    mdp VARCHAR(5000) NULL
);

CREATE TABLE shiftingpact_db.questions_onboarding (
    id_questions_onboarding SERIAL PRIMARY KEY,
    question VARCHAR(5000) NOT NULL
);

CREATE TABLE shiftingpact_db.questions (
    id_question SERIAL PRIMARY KEY,
    sujet VARCHAR(500) NOT NULL,
    statut CHAR(1) CHECK (statut IN ('A', 'E', 'C')) NOT NULL,
    id_enjeu INT REFERENCES shiftingpact_db.enjeux(id_enjeu) NOT NULL,
    type VARCHAR(255) CHECK (type IN ('radio', 'checkbox', 'libre')) NOT NULL
);

CREATE TABLE shiftingpact_db.reponses (
    id_reponse SERIAL PRIMARY KEY,
    id_question INT REFERENCES shiftingpact_db.questions(id_question) NOT NULL,
    texte VARCHAR(50000) NULL,
    score_individuel INT NOT NULL,
    id_template INT REFERENCES shiftingpact_db.templates(id_template) NOT NULL,
    champ_libre BOOLEAN NOT NULL,
    score_engagement INT NOT NULL
);


CREATE TABLE shiftingpact_db.engagements (
    id_engagement SERIAL PRIMARY KEY,
    id_enjeu INT REFERENCES shiftingpact_db.enjeux(id_enjeu) NOT NULL,
    engagement VARCHAR(50000) NOT NULL,
    commentaire VARCHAR(50000) NULL,
    id_Admin INT REFERENCES shiftingpact_db.admin(id_admin) NOT NULL,
    KPIS VARCHAR(255) NULL,
    date DATE NOT NULL
);

CREATE TABLE shiftingpact_db.reponse_client (
    id_reponse_client SERIAL PRIMARY KEY,
    id_client INT REFERENCES shiftingpact_db.clients(id_client) NOT NULL,
    id_reponse INT REFERENCES shiftingpact_db.reponses(id_reponse) NOT NULL,
    commentaire VARCHAR(5000) NULL,
    est_un_engagement BOOLEAN NOT NULL,
    score_final INT NOT NULL,
    sa_reponse VARCHAR(255) NULL,
    id_engagement INT REFERENCES shiftingpact_db.engagements(id_engagement) NULL,
    UNIQUE (id_reponse, id_client)
);

CREATE TABLE shiftingpact_db.verifications (
    id_reponse_client INT PRIMARY KEY REFERENCES shiftingpact_db.reponse_client(id_reponse_client) NOT NULL,
    est_valide BOOLEAN NOT NULL default FALSE,
    id_admin INT REFERENCES shiftingpact_db.admin(id_admin) NOT NULL
);

CREATE TABLE shiftingpact_db.glossaires (
    id_glossaire SERIAL PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    definition VARCHAR(5000000) NOT NULL,
    remarque VARCHAR(5000000) NULL,
    plus_information VARCHAR(5000000) NULL
);

CREATE TABLE shiftingpact_db.recaps (
    id_recap SERIAL PRIMARY KEY,
    id_enjeu INT REFERENCES shiftingpact_db.enjeux(id_enjeu) NOT NULL,
    id_client INT REFERENCES shiftingpact_db.clients(id_client) UNIQUE NOT NULL,
    est_metrique BOOLEAN NOT NULL,
    est_formalisation BOOLEAN NOT NULL,
    est_pratique BOOLEAN NOT NULL,
    est_sensible BOOLEAN NOT NULL,
    est_reporting BOOLEAN NOT NULL
);

CREATE TABLE shiftingpact_db.standards (
    id_standard SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    presentation VARCHAR(50000) NOT NULL,
    plus_info VARCHAR(50000) NULL

);

CREATE TABLE shiftingpact_db.templates_clients (
    id SERIAL PRIMARY KEY,
    id_template INT REFERENCES shiftingpact_db.templates(id_template) NOT NULL,
    id_client INT REFERENCES shiftingpact_db.clients(id_client) NOT NULL,
    UNIQUE (id_template, id_client)
);


--------------------------------------------------------------------------------------------
--INSERT


-- Insertion des enjeux
INSERT INTO shiftingpact_db.enjeux (nom, enjeu_parent) VALUES

('ENERGIE & CARBONE', NULL),--1
-- Sous-enjeux pour "ENERGIE & CARBONE"
('Gestion de l énergie', 1),
('Empreinte carbone', 1),



('EAU, MATIERES PREMIERES ET FOURNITURES', NULL),--4
-- Sous-enjeux pour "EAU, MATIERES PREMIERES ET FOURNITURES"
('Eau', 4),
('Matière premières et fournitures', 4),


('GESTION DE DÉCHETS', NULL),--7
-- Sous-enjeux pour "GESTION DE DÉCHETS"
('Déchets', 7),


('ECOSYSTEMES & BIODIVERSITE', NULL),--9
('ecosystèmes et biodiversité',9),

('DIVERSITE, INCLUSION & EQUITE', NULL),--11
('inclusion et équité',11),
('diversité',11),


('SECURITE, SANTE & BIEN-ETRE', NULL),--14
-- Sous-enjeux pour "SECURITE, SANTE & BIEN-ETRE"
('Sécurité au travail', 14),
('Santé & Bien-être', 14),


('EMPOI ET PRATIQUES DE TRAVAIL', NULL),--17
-- Sous-enjeux pour "EMPLOI ET PRATIQUES DE TRAVAIL"
('Développement des compétences', 17),
('Engagement et satisfaction', 17),


('ENGAGEMENT CIVIQUE', NULL),--20
-- Sous-enjeux pour "ENGAGEMENT CIVIQUE"
('Engagement social', 20),
('Philanthropie', 20),


('CONDUITE DES AFFAIRES', NULL),--23
-- Sous-enjeux pour "CONDUITE DES AFFAIRES"
('Structure de gouvernance', 23),
('Intégration des parties prenantes', 23),
('Gestion durable', 23),
('Transparence', 23),


('ETHIQUE DES AFFAIRES', NULL),--28
-- Sous-enjeux pour "ETHIQUE DES AFFAIRES"
('Formalisation des pratiques', 28),
('Lutte contre la corruption financière', 28),
('Divulgation des litiges', 28),


('PROTECTION DES DONNEES', NULL),--32
-- Sous-enjeux pour "PROTECTION DES DONNEES"
('Sécurité des données', 32),
('Protection de la vie privée', 32),


('CERTIFICATIONS', NULL),--35
-- Sous-enjeux pour "CERTIFICATIONS"
('Certifications d un produit, d un service ou d une pratique', 35),
('Certifications de l entreprise', 35);



--template
INSERT INTO shiftingpact_db.templates (nom) VALUES
('ALL'),
('OWNED FACILITY'),
('FACILITY'),
('WORKERS'),
('PRODUITS');




-- Insertion des questions pour l'enjeu "GESTION DE L'ENERGIE"
INSERT INTO shiftingpact_db.questions (sujet, statut, id_enjeu,type) VALUES

('Suivez-vous la consommation d''énergie de XXX ?', 'A', 2,'radio'),
('Si vous la suivez, veuillez indiquer votre consommation d''énergie totale des 12 derniers mois (en kWh)', 'A', 2,'libre'),
('Avez-vous un contrat vert avec votre fournisseur d''énergie ?', 'A', 2,'radio'),
('Produisez-vous de l''électricité sur site (par exemple, avec des panneaux solaires) ?', 'A', 2,'radio');

-- Insertion des données dans la table glossaires
INSERT INTO shiftingpact_db.glossaires (nom, definition, remarque, plus_information) VALUES

('Analyse de Double Matérialité',
 'L Analyse de Double Matérialité, dans le cadre de la directive CSRD (Corporate Sustainability Reporting Directive) ' ||
 'de l Union européenne, est une approche qui aide les entreprises à évaluer et à communiquer les impacts de leurs activités ' ||
 'en matière de durabilité de manière plus complète. Elle repose sur deux dimensions principales :\n\nMatérialité financière :\n\n' ||
 'Évaluer comment les questions environnementales, sociales et de gouvernance (ESG) affectent les performances financières de l entreprise. ' ||
 'Il s agit de déterminer les risques et opportunités ESG qui peuvent influencer les résultats financiers de l entreprise et la valeur pour les actionnaires.' ||
 '\n\nMatérialité environnementale et sociale :\n\nÉvaluer comment les activités de l entreprise impactent l environnement et la société. ' ||
 'Cela inclut l empreinte écologique, les impacts sociaux et les effets sur les parties prenantes, comme les communautés locales, les employés, ' ||
 'les clients et les fournisseurs.\n\nL Analyse de Double Matérialité permet ainsi aux entreprises de prendre en compte à la fois les impacts financiers des enjeux ESG et les impacts de leurs activités sur ces mêmes enjeux. ' ||
 'Cette approche favorise une prise de décision plus équilibrée et transparente, alignée avec les attentes des régulateurs, des investisseurs et des autres parties prenantes.',
 NULL,
 NULL),
('Biodiversité',
 'La biodiversité désigne la variété et la variabilité des formes de vie sur Terre, en ce compris la diversité des espèces, ' ||
 'la diversité génétique et la diversité des écosystèmes au sein des organismes vivants et des écosystèmes et entre eux. Elle englobe la richesse et l abondance ' ||
 'des différentes espèces de plantes, d animaux, de champignons et de micro-organismes, ainsi que les interactions et les processus écologiques ' ||
 'qui entretiennent la vie sur notre planète.\n\nLa biodiversité est essentielle au fonctionnement des écosystèmes et fournit de nombreux services écosystémiques ' ||
 'qui contribuent au bien-être des humains, tels que la pureté de l air et de l eau, la fertilité des sols, la pollinisation des cultures, la régulation du climat ' ||
 'et la régulation des maladies. Elle joue également un rôle crucial dans le maintien de la résilience des écosystèmes face aux changements et aux perturbations ' ||
 'de l environnement.\n\nLa préservation de la biodiversité est donc essentielle pour la conservation des écosystèmes, la durabilité des ressources naturelles ' ||
 'et la résilience des écosystèmes aux changements environnementaux. La protection et la conservation de la biodiversité constituent une priorité mondiale ' ||
 'et nécessitent des efforts coordonnés aux niveaux local, national et international pour faire face aux menaces telles que la destruction des habitats, ' ||
 'la surexploitation des ressources naturelles, la pollution, les espèces envahissantes et le changement climatique.',
 NULL,
 NULL),
('Cadre',
 'Un cadre est chargé de mettre en œuvre les plans et les politiques de l entreprise et est généralement directement responsable devant les propriétaires et/ou le conseil d administration (exemple : CFO, etc.)',
 NULL,
 NULL),
('Certifications',
 'Les certifications durables font référence à des certifications ou attestations de tiers qui reconnaissent et valident l engagement d une entreprise ' ||
 'en faveur de pratiques durables, de la gestion de l environnement, de la responsabilité sociale et de la conduite commerciale éthique. ' ||
 'Ces certifications sont attribuées par des organisations indépendantes ou des organismes de réglementation sur la base de critères, de normes ' ||
 'et d indicateurs de performance spécifiques liés au développement durable.\n\nElles renforcent la crédibilité et la confiance, différencient l entreprise sur le marché, ' ||
 'donnent accès à certains marchés, atténuent les risques, améliorent la réputation de la marque, favorisent l amélioration continue, encouragent ' ||
 'l engagement des parties prenantes et la transparence, et offrent une reconnaissance mondiale et un alignement sur les normes de développement durable.',
 NULL,
 NULL),
('Chaîne de valeur en amont',
 'La chaîne de valeur en amont fait référence à la série d activités impliquées dans la production, l approvisionnement et la fourniture de matières premières, ' ||
 'de composants et d intrants essentiels à la création d un produit ou d un service. Elle englobe toutes les étapes qui précèdent le processus de fabrication ou d assemblage ' ||
 'et comprend des activités telles que l extraction des matières premières, la transformation, le transport et la distribution.\n\nDans une chaîne de valeur classique, ' ||
 'la partie amont se situe au début du processus, là où les matériaux sont obtenus et préparés en vue d une transformation ultérieure. Il peut s agir d activités telles ' ||
 'que l extraction de minéraux, l agriculture, la récolte de bois ou l extraction de combustibles fossiles. Ces matières premières sont ensuite traitées, raffinées ou ' ||
 'transformées en produits intermédiaires ou en composants qui peuvent être utilisés dans la fabrication.\n\nLa chaîne de valeur en amont est essentielle pour garantir ' ||
 'la disponibilité, la qualité et la fiabilité des intrants pour les activités en aval. Elle implique souvent des réseaux mondiaux complexes de fournisseurs, de producteurs ' ||
 'et de distributeurs et joue un rôle important dans la détermination de la durabilité, du coût et de la compétitivité du produit final.\n\nComprendre et gérer la chaîne de valeur ' ||
 'en amont est essentiel pour les organisations afin de garantir un approvisionnement sûr et résistant en matériaux, de minimiser les risques liés à l approvisionnement et ' ||
 'à la fourniture, et d identifier les possibilités d amélioration de l efficacité, d innovation et de pratiques durables.',
 NULL,
 NULL),
('Code NACE',
 'Le code NACE (Nomenclature des Activités Économiques dans la Communauté Européenne), également connu sous le nom de classification NACE ou NACE Rév. 2, est un système utilisé pour classer les activités économiques à différents niveaux de granularité à des fins statistiques et administratives au sein de l''Union européenne (UE) et d''autres pays qui adoptent la classification. ' ||
 'Il s''agit d''une nomenclature à quatre chiffres qui fournit un cadre pour la collecte et la production d''un large éventail de données statistiques relatives aux activités économiques dans le domaine des statistiques économiques (par exemple, la production, l''emploi et les comptes nationaux) et d''autres domaines du système statistique européen (SSE).',
 NULL,
 'https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=fr'),
('Diversité & Inclusion',
 'La diversité englobe un large éventail de caractéristiques humaines au sein de la main-d''œuvre, y compris les différences de race, d''ethnicité, de sexe, d''âge, d''orientation sexuelle, de handicap, de religion, d''origine socio-économique et de nationalité. ' ||
 'L''inclusion, quant à elle, implique la création d''un environnement de travail où chaque individu se sent valorisé, respecté et inclus, allant au-delà de la simple représentation de la diversité pour favoriser un sentiment d''appartenance et d''équité pour tous·tes les travailleur·euses. ' ||
 'Les lieux de travail inclusifs favorisent la collaboration, la communication ouverte et la possibilité pour tous les individus d''apporter leurs idées, leurs talents et leurs points de vue. ' ||
 'Il s''agit de sujets importants dans le contexte d''une entreprise, car ils contribuent à l''innovation, à l''engagement des travailleur·euses, à l''attraction des talents, à la pertinence du marché et aux pratiques commerciales éthiques. Les entreprises qui accordent la priorité à la diversité et à l''inclusion sont mieux placées pour réussir dans l''environnement commercial dynamique et interconnecté d''aujourd''hui.',
 NULL,
 NULL),
('Ecosystèmes & Biodiversité',
 'Les écosystèmes désignent des communautés interconnectées d''organismes vivants et leur environnement physique, fonctionnant ensemble comme un système complexe et dynamique. ' ||
 'La biodiversité, quant à elle, désigne la variété des formes de vie au sein des écosystèmes, y compris la diversité des espèces, la diversité génétique et la diversité des écosystèmes. ' ||
 'Elle fournit des services essentiels au bien-être des humains et aux activités économiques, et constitue la source de nombreuses ressources naturelles indispensables au fonctionnement des entreprises. ' ||
 'En outre, des écosystèmes sains et la biodiversité contribuent à la gestion des risques en renforçant la résilience face aux menaces environnementales telles que le changement climatique et les épidémies.',
 NULL,
 NULL),
('EFRAG',
 'Le European Financial Reporting Advisory Group (EFRAG) est une association privée créée en 2001 par les principales fédérations et instituts comptables européens. ' ||
 'Le rôle principal de l''EFRAG est de fournir une expertise technique et des conseils à la Commission européenne sur les questions liées à l''information financière et aux normes comptables. ' ||
 'L''EFRAG joue un rôle essentiel dans le processus d''approbation des International Financial Reporting Standards (IFRS) au sein de l''Union européenne (UE). ' ||
 'Plus récemment, l''EFRAG a fourni une expertise technique et des conseils sur les normes d''information sur le développement durable et les exigences relatives aux European Sustainability Reporting Standards (ESRS). Ces normes visent à renforcer les exigences en matière d''information sur le développement durable pour les entreprises opérant au sein de l''UE. Elles visent à améliorer la qualité, la comparabilité et la fiabilité des informations sur le développement durable publiées par les entreprises, permettant ainsi aux investisseurs, aux parties prenantes et aux décideurs politiques de prendre des décisions mieux informées.',
 NULL,
 'https://www.efrag.org/'),
('Empreinte carbone',
 'L''empreinte carbone fait référence à la quantité totale de gaz à effet de serre, en particulier le dioxyde de carbone (CO2) et d''autres émissions telles que le méthane (CH4) et l''oxyde nitreux (N2O), rejetés directement ou indirectement par les activités humaines. ' ||
 'Il s''agit d''activités telles que la conduite de véhicules, la fabrication de biens et la production d''aliments. ' ||
 'L''empreinte carbone est généralement mesurée en équivalents de dioxyde de carbone (CO2e) et est souvent utilisée comme indicateur de l''impact d''une organisation sur le changement climatique. ' ||
 'Au final, l''objectif de la mesure et de la réduction de l''empreinte GES est d''atténuer le changement climatique, de minimiser les dommages environnementaux et de promouvoir un avenir plus durable et plus résilient pour la planète.',
 NULL,
 NULL),

('Énergie & GES',
 'La consommation d énergie désigne la quantité d énergie utilisée par une entreprise dans le cadre de ses activités, y compris les processus de fabrication, le transport, le chauffage, la climatisation, l éclairage et d autres activités. ' ||
 'Les émissions de gaz à effet de serre (GES) désignent les rejets de gaz (tels que le dioxyde de carbone et le méthane) dans l atmosphère résultant des activités humaines, notamment les procédés industriels, les transports, l agriculture et la production d énergie. ' ||
 'Ces gaz retiennent la chaleur dans l atmosphère terrestre, ce qui entraîne un réchauffement de la planète et un changement climatique. ' ||
 'Comprendre leur consommation d énergie et leurs émissions de gaz à effet de serre est essentiel pour les entreprises afin de gérer les coûts, d atténuer l impact sur l environnement, de garantir la conformité aux réglementations et de soutenir les efforts en matière de développement durable.',
 NULL,
 NULL),
('Engagement civique',
 'L engagement civique désigne l implication active des entreprises et de leurs travailleur·euses dans la communauté et la société au sens large, par le biais de diverses formes d engagement social, de soutien aux communautés locales et de philanthropie. ' ||
 'Cet engagement vise à traiter les questions sociales, environnementales et économiques, à contribuer au bien-être des communautés et à promouvoir un changement sociétal positif. ' ||
 'Il démontre la citoyenneté de l entreprise, répond aux attentes des parties prenantes, renforce les relations avec la communauté, améliore l engagement et le bien-être des travailleur·euses et conduit à un changement sociétal positif. ' ||
 'En s engageant activement dans des activités civiques, les entreprises peuvent créer de la valeur à la fois pour les actionnaires et pour la société, en contribuant à un avenir plus durable et plus équitable.',
 NULL,
 NULL),
('Engagement et développement des compétences',
 'Les pratiques en matière d emploi et de travail font référence aux politiques, procédures et normes régissant les relations entre les employeur·euses et les travailleur·euses sur le lieu de travail. ' ||
 'Ces pratiques englobent divers aspects de l emploi, notamment le développement des compétences, la rémunération, les conditions de travail, l accès des travailleur·euses au capital et leur satisfaction. ' ||
 'Il s agit de sujets importants pour les entreprises, car ils garantissent la conformité légale, protègent les droits des travailleur·euses, renforcent la satisfaction au travail et le maintien dans l emploi, et améliorent la productivité et les performances. ' ||
 'L adoption de pratiques équitables, éthiques et responsables en matière d emploi est essentielle pour créer un environnement de travail positif et favoriser la réussite à long terme et la durabilité de l entreprise.',
 NULL,
 NULL),
('Éthique des affaires',
 'L éthique commerciale fait référence aux principes, valeurs et normes de conduite qui guident le comportement et la prise de décision des individus et des entreprises dans l environnement des affaires. ' ||
 'Elle englobe divers aspects, notamment le respect des exigences légales et réglementaires, l honnêteté, l intégrité, l équité, la transparence et le respect des parties prenantes. ' ||
 'En adhérant aux principes et valeurs éthiques, les entreprises peuvent établir des relations plus solides avec les parties prenantes, renforcer leur avantage concurrentiel et créer de la valeur pour la société dans son ensemble.',
 NULL,
 NULL),

('Energie & GES',
 'La consommation d énergie désigne la quantité d énergie utilisée par une entreprise dans le cadre de ses activités, y compris les processus de fabrication, le transport, le chauffage, la climatisation, l éclairage et d autres activités. ' ||
 'Les émissions de gaz à effet de serre (GES) désignent les rejets de gaz (tels que le dioxyde de carbone et le méthane) dans l atmosphère résultant des activités humaines, notamment les procédés industriels, les transports, l agriculture et la production d énergie. Ces gaz retiennent la chaleur dans l atmosphère terrestre, ce qui entraîne un réchauffement de la planète et un changement climatique. ' ||
 'Comprendre leur consommation d énergie et leurs émissions de gaz à effet de serre est essentiel pour les entreprises afin de gérer les coûts, d atténuer l impact sur l environnement, de garantir la conformité aux réglementations et de soutenir les efforts en matière de développement durable.',
 NULL,
 NULL),
('ESG',
 'ESG est l acronyme de Environnement, Social et Gouvernance. Il s agit d un ensemble de critères utilisés pour évaluer les performances et l impact d une entreprise dans ces trois domaines.\n\nEnvironnement : il s agit de la manière dont une entreprise gère son impact sur l environnement naturel. Il comprend des facteurs tels que les émissions de carbone, l efficacité énergétique, la gestion des déchets, l utilisation de l eau et la préservation de la biodiversité.\n\nSocial : Il s agit de la manière dont une entreprise interagit et affecte les personnes, les communautés et la société dans son ensemble. Il comprend des facteurs tels que les pratiques de travail, les droits de l homme, la diversité et l intégration, l engagement communautaire et la sécurité des produits.\n\nLa gouvernance : Il s agit de la manière dont une entreprise est gouvernée, gérée et contrôlée. Elle comprend des facteurs tels que la diversité du conseil d administration, la rémunération des dirigeant·es, les droits des actionnaires, la transparence et l éthique.\n\nLes critères ESG sont utilisés par les investisseur·euses, les analystes et les parties prenantes pour évaluer la durabilité, les pratiques éthiques et la viabilité à long terme d une entreprise. Les entreprises qui obtiennent de bons résultats sur les critères ESG sont souvent considérées comme plus résilientes, plus responsables et plus attrayantes pour les investisseur·euses qui accordent la priorité à la durabilité et à l impact social en plus des rendements financiers. L intégration des considérations ESG dans les stratégies d entreprise peut également améliorer la gestion des risques, l efficacité opérationnelle et la confiance des parties prenantes.',
 'Les principaux piliers de l ESG sont les suivants :\n\n- Environnement : ces questions portent sur la manière dont l entreprise gère son impact sur l environnement. Cela comprend la consommation d énergie et les émissions de gaz à effet de serre, l utilisation efficace des ressources, la gestion des déchets et les impacts sur les écosystèmes et la biodiversité.\n\n- Social : Ces questions portent sur la manière dont l entreprise traite ses travailleur·euses, ses relations avec les communautés et son impact sur la société. Les thèmes abordés sont la diversité et l inclusion, la santé et le bien-être des travailleur·euses, les pratiques de travail et l engagement civique.\n\n- Gouvernance : Les questions relatives à la gouvernance évaluent la manière dont l entreprise est gérée et contrôlée. Elles portent notamment sur la composition du conseil d administration, les pratiques commerciales éthiques, ainsi que la protection des données et les certifications.',
 NULL),
('Ethique des affaires',
 'L éthique commerciale fait référence aux principes, valeurs et normes de conduite qui guident le comportement et la prise de décision des individus et des entreprises dans l environnement des affaires. Elle englobe divers aspects, notamment le respect des exigences légales et réglementaires, l honnêteté, l intégrité, l équité, la transparence et le respect des parties prenantes. ' ||
 'En adhérant aux principes et valeurs éthiques, les entreprises peuvent établir des relations plus solides avec les parties prenantes, renforcer leur avantage concurrentiel et créer de la valeur pour la société dans son ensemble.',
 NULL,
 NULL),
('GES - Empreinte carbone',
 'L empreinte carbone fait référence à la quantité totale de gaz à effet de serre, en particulier le dioxyde de carbone (CO2) et d autres émissions telles que le méthane (CH4) et l oxyde nitreux (N2O), rejetés directement ou indirectement par les activités humaines. Il s agit d activités telles que la conduite de véhicules, la fabrication de biens et la production d aliments. L empreinte carbone est généralement mesurée en équivalents de dioxyde de carbone (CO2e) et est souvent utilisée comme indicateur de l impact d une organisation sur le changement climatique. ' ||
 'Au final, l objectif de la mesure et de la réduction de l empreinte GES est d atténuer le changement climatique, de minimiser les dommages environnementaux et de promouvoir un avenir plus durable et plus résilient pour la planète.',
 NULL,
 NULL),
('Gestion des déchets',
 'La gestion des déchets dans le contexte d une entreprise implique la manipulation, le traitement et l élimination appropriés des déchets générés par les différentes activités de l entreprise. Les déchets non dangereux comprennent des matériaux tels que le papier, le carton, les plastiques, les déchets organiques et les matériaux d emballage. Les déchets dangereux sont des déchets qui présentent un risque important pour la santé humaine, la sécurité ou l environnement en raison de leurs propriétés chimiques, physiques ou biologiques. Il peut s agir de matériaux tels que des produits chimiques, des solvants, des piles, des déchets électroniques et des matériaux contaminés. ' ||
 'La gestion des déchets, qu ils soient dangereux ou non, est importante pour une entreprise afin de protéger la santé humaine, de prévenir la pollution de l environnement, de garantir le respect des réglementations, de préserver les ressources et de réduire les coûts.',
 NULL,
 NULL),
('Gestion de la durabilité',
 'La gestion de la durabilité fait référence à l approche stratégique et aux pratiques adoptées par les organisations pour intégrer des considérations environnementales, sociales et économiques dans leurs processus de prise de décision et leurs opérations (dans la gouvernance d entreprise). L objectif de la gestion de la durabilité est de parvenir à la viabilité et à la résilience à long terme en équilibrant les besoins des générations actuelles et futures tout en minimisant les impacts négatifs sur l environnement et la société.\n\nLes principaux aspects de la gestion durable sont les suivants :\n\nLa gestion de l environnement : Mise en œuvre de mesures visant à réduire la consommation de ressources, à minimiser la pollution et à atténuer les incidences sur l environnement dans l ensemble des activités, des produits et des services de l organisation.\n\nLa responsabilité sociale : Promouvoir l équité sociale, la diversité et l inclusion au sein de l organisation et de sa chaîne d approvisionnement, garantir des pratiques de travail équitables, respecter les droits de l homme et s engager auprès des communautés locales.\n\nProspérité économique : Poursuivre la croissance économique et la rentabilité tout en garantissant des pratiques commerciales responsables et éthiques, en encourageant l innovation et en créant de la valeur à long terme pour les parties prenantes.\n\nLa gestion durable implique de fixer des objectifs clairs, de mesurer les performances par rapport à des critères établis et d améliorer en permanence les pratiques pour relever les défis et saisir les opportunités en matière de développement durable. Elle nécessite une collaboration et une transparence entre les entreprises, les gouvernements et les communautés pour réaliser un avenir plus équilibré et plus durable.',
 NULL,
 NULL),

('Gouvernance de l entreprise',
 'Le gouvernance de l entreprise fait reference au cadre de regles, de pratiques et de processus par lesquels une entreprise est dirigee et controlee. Elle implique la repartition des droits et des responsabilites entre les differentes parties prenantes, y compris le conseil d administration, la direction, les actionnaires et les autres parties prenantes. La gouvernance ESG fait reference a l approche et aux pratiques systematiques que les organisations emploient pour integrer les principes et les objectifs de durabilite dans leurs strategies commerciales, leurs operations et leurs processus de prise de decision. Elle implique la prise en compte des facteurs environnementaux, sociaux et economiques afin de creer une valeur a long terme pour l entreprise, ses parties prenantes et la societe dans son ensemble.
Une gestion d entreprise efficace garantit que l entreprise fonctionne de maniere efficiente, ethique et durable, ce qui la place en position de reussite et de creation de valeur a long terme. En integrant les principes de durabilite dans leurs strategies et operations commerciales, les entreprises peuvent creer des impacts positifs pour elles-mêmes, leurs parties prenantes et la societe dans son ensemble, tout en assurant leur propre succes et leur durabilite.',
NULL,
NULL),

('IF PNUE (UNEP FI)',
 'L initiative financiere du Programme des Nations unies pour l environnement (IF PNUE) est un partenariat entre le Programme des Nations unies pour l environnement (PNUE) et le secteur financier mondial. L IF PNUE s efforce de promouvoir la finance durable, en visant a integrer les facteurs environnementaux, sociaux et de gouvernance (ESG) dans les processus de prise de decision financiere.
Creé en 1992, l IF PNUEI sert de plateforme aux institutions financieres, y compris les banques, les assureurs et les investisseurs, pour collaborer et developper des strategies de developpement durable. Ses initiatives comprennent la recherche, la defense des politiques et le developpement d outils et de cadres pour aider les institutions financieres a integrer les principes de durabilite dans leurs operations et leurs strategies d investissement.
L IF PNUE reconnait que divers secteurs et industries peuvent avoir des impacts positifs et negatifs sur l environnement et la societe. Il elabore notamment des lignes directrices ou des cadres sectoriels qui mettent en evidence les impacts negatifs potentiels associes a chaque secteur. Ces lignes directrices peuvent concerner des secteurs tels que l energie, l agriculture, la finance, etc. Elles decrivent les risques environnementaux et sociaux specifiques qui doivent etre pris en compte par les institutions financieres et les investisseurs operant dans ces secteurs.',
NULL,
NULL),

('Label ShiftingPact™',
 'Alignez votre entreprise sur les meilleures normes internationales. ShiftingPact™ est le label des PME en transition. Quelle que soit la maturite de votre entreprise en matiere de durabilite, le label ShiftingPact™ vous permet d activer, de suivre et d ameliorer votre propre strategie d impact, en prenant des engagements concrets. Vous etes guide a travers trois themes principaux, Environnement, Social et Gouvernance, pour identifier vos forces et vos opportunites d amelioration.',
NULL,
NULL),

('Monitoring (Surveillance)',
 'Il s agit du processus continu d observation, d evaluation et de suivi des differents aspects des activites, des operations et des performances de l entreprise afin de prendre des decisions en connaissance de cause, d identifier les possibilites d amelioration, de detecter les problemes, d optimiser les performances, de gerer les risques, etc.',
NULL,
NULL),

('Objectifs',
 'Buts ou objectifs specifiques que l entreprise vise a atteindre en ce qui concerne la mise en oeuvre, la conformite et les performances de sa politique. Les objectifs constituent une reference claire et mesurable permettant d evaluer l efficacite des politiques et des activites de controle, et d orienter les efforts en vue d une amelioration continue.',
NULL,
NULL),


('ODD (SDG)',
 'Les entreprises peuvent utiliser les ODD comme un cadre general pour faconner, orienter, communiquer et rendre compte de leurs strategies, de leurs objectifs et de leurs activites, ce qui leur permet de tirer parti d une serie d avantages, tels que
- Accroitre la valeur de la durabilite de l entreprise
- Renforcer les relations avec les parties prenantes
- Identifier les futures opportunites commerciales
- L utilisation d un langage commun et d un objectif partage
La contribution des entreprises aux objectifs est essentielle a leur realisation, car elle permet d evaluer leur impact, de fixer des objectifs ambitieux et de communiquer les resultats de maniere transparente.
Les entreprises qui comprennent ce defi et agissent auront une longueur d avance.',
NULL,
NULL),

('Pacte d Engagement ShiftingPact®',
 'Votre Pacte d Engagement reprend l ensemble des objectifs que vous vous etes fixes lors du remplissage du module ESG de votre questionnaire ShiftingPact®. Votre entreprise s engage a tout mettre en oeuvre pour atteindre ces objectifs et a pouvoir les demontrer lors de votre recertification. Il est important de fixer des objectifs realistes et pertinents qui ont un impact tangible sur l amelioration de la gestion de votre entreprise et de son impact environnemental et/ou societal.
L objectif du Pacte d Engagement est de vous fournir une feuille de route ESG claire, a partager en interne avec vos equipes. Vous definirez ensemble les moyens de la mettre en oeuvre dans les delais impartis.',
NULL,
NULL),

('Pacte mondial des Nations Unies - UNGC',
 'Le Pacte mondial des Nations unies est une initiative lancee en 2000 par les Nations unies. Il vise a encourager les entreprises a adopter des pratiques commerciales socialement responsables et durables, et a jouer ainsi leur role dans la realisation des objectifs de developpement durable.
Pour ce faire, le Pacte propose un cadre d engagements base sur dix principes universellement acceptes dans les domaines des droits de l homme, du travail, de l environnement et de la lutte contre la corruption. Ces principes decoulent de la Declaration universelle des droits de l homme, de la Declaration de l Organisation internationale du travail relative aux principes et droits fondamentaux au travail, de la Declaration de Rio sur l environnement et le developpement et de la Convention des Nations unies contre la corruption.
Les entreprises qui adherent au Pacte mondial des Nations unies s engagent a integrer ces principes dans leurs strategies et leurs operations, et a rendre compte publiquement des progres accomplis dans la realisation de ces objectifs.
Le Pacte mondial des Nations unies compte des milliers de participants dans plus de 160 pays. Il rassemble des entreprises, des organisations non gouvernementales, des gouvernements et d autres parties prenantes.',
NULL,
NULL),

('PAI',
 'Potential Adverse Impact (PAI) fait reference aux effets negatifs possibles d un investissement sur les facteurs environnementaux, sociaux ou de gouvernance (ESG).
Le PAI est un concept introduit dans le cadre du reglement de l Union europeenne relatif a la divulgation d informations sur la finance durable (SFDR). A partir de janvier 2023, ce reglement exige des acteur·rices des marches financiers qu ils·elles publient des informations sur la maniere dont ils·elles integrent les risques lies au developpement durable dans leurs processus de prise de decision en matiere d investissement. Il s agit notamment de divulguer la maniere dont ils evaluent et gerent les principaux PAI, qui concernent les questions climatiques, environnementales, sociales et de droits de l homme. Le reglement definit 16 indicateurs obligatoires, dont 14 sont applicables aux entreprises et 2 sont specifiquement concus pour les actifs immobiliers.
La divulgation des PAI vise a fournir une transparence aux investisseur·euses concernant les effets negatifs potentiels des investissements sur les facteurs de durabilite, ce qui leur permet de prendre des decisions d investissement plus eclairees qui correspondent a leurs preferences et a leurs objectifs en matiere de durabilite.',
NULL,
NULL),

('Politique',
 'Ensemble de principes, de lignes directrices, de regles ou de protocoles etablis par une entreprise pour regir divers aspects de ses activites. Ces politiques sont generalement elaborees pour garantir le respect des exigences legales, promouvoir les valeurs de l organisation, gerer les risques, maintenir la coherence et l equite au sein de l organisation et, enfin, faire preuve de responsabilite vis-a-vis des parties prenantes, notamment les client·es, les investisseur·euses et les organismes de regulation.',
NULL,
NULL),

('Promotion',
 'Le terme "promotion" dans le contexte du reporting ESG, specifiquement lorsqu il s agit de compter le nombre de personnes ayant recu une promotion en interne, ne se refere pas necessairement a une augmentation de la remuneration. Voici quelques clarifications :
Une promotion interne signifie generalement qu un employe a ete eleve a un poste superieur avec plus de responsabilites. Cela peut inclure un changement de titre, une augmentation des responsabilites, une amelioration de la position hierarchique, etc.
Bien que la promotion soit souvent associee a une augmentation de la remuneration (salaire de base, primes, avantages supplementaires), ce n est pas toujours le cas. Certaines promotions peuvent se concentrer principalement sur le changement de role ou de responsabilites sans modification immediate du salaire. Par exemple, une personne peut etre promue a un role de management ou de leadership sans augmentation salariale immediate, mais avec la promesse d un examen de remuneration a une date ulterieure ou d autres formes de reconnaissance non monetaires.
Les promotions peuvent egalement inclure des avantages non financiers tels que : opportunites de formation et de developpement personnel, acces a des programmes de mentorat, plus grande visibilite au sein de l organisation, opportunites de carriere a long terme et de developpement professionnel.
Dans le reporting ESG, mentionner le nombre de promotions internes est souvent une mesure de la mobilite interne, de la reconnaissance du talent, et de l engagement de l organisation envers le developpement professionnel de ses employes. Cela peut indiquer des pratiques de gestion des talents positives et un environnement de travail dynamique.',
NULL,
NULL),

('Protection des donnees',
 'La protection des donnees fait reference aux pratiques, politiques et mesures mises en œuvre par les organisations pour preserver la confidentialite, l integrite et la disponibilite des informations personnelles et sensibles collectees, traitees, stockees et transmises a l entreprise. La protection des donnees englobe divers aspects, notamment la confidentialite des donnees, la securite, la conformite aux reglementations et la gestion des risques.
Il s agit d un sujet important pour les entreprises car il permet de proteger les informations personnelles, de prevenir les violations de donnees et les cyberattaques, de garantir la conformite avec les lois sur la protection des donnees, de preserver la reputation et la confiance de l entreprise et de soutenir une gouvernance des donnees et une gestion des risques efficaces.',
NULL,
NULL),

('Reporting',
 'Il s agit du processus de documentation et de communication aux parties prenantes des informations relatives a la mise en œuvre, au respect et aux resultats des politiques de l organisation et des activites de suivi. Les rapports jouent un role crucial en assurant la transparence, la responsabilite et la prise de decision au sein de l organisation. Ils aident a comprendre l efficacite des politiques, la realisation des objectifs, les domaines a ameliorer et a prendre des mesures proactives pour attenuer les risques et garantir la conformite.',
NULL,
NULL),

('Ressources',
 'Les ressources font references aux moyens et aux infrastructures en place au sein de l organisation pour mettre en œuvre, appliquer et controler efficacement le respect d une politique et la realisation d objectifs. Les ressources sont, par exemple, une equipe specialisee, des programmes de formation, des investissements, des outils de planification et de gestion du temps, etc.',
NULL,
NULL),

('Sante, securite et bien-etre',
 'La sante, la securite et le bien-etre designent les pratiques, les politiques et les initiatives mises en œuvre par les organisations pour proteger et promouvoir la sante physique, mentale et emotionnelle de leurs travailleur·euses tout en garantissant un environnement de travail sur et securise. Il peut s agir, par exemple, de fournir un acces a des prestations de soins de sante completes, de proceder a des evaluations regulieres des risques afin d identifier les dangers sur le lieu de travail et de mettre en œuvre des mesures de controle appropriees, ou encore de promouvoir l equilibre entre vie professionnelle et vie privee en proposant des modalites de travail flexibles.
Il s agit de sujets importants dans le contexte d une entreprise, car ils contribuent a la satisfaction des travailleur·euses, a la productivite, a la gestion des risques, a l attraction des talents et au respect de la legislation. En accordant la priorite a ces questions, on cree un environnement de travail positif dans lequel les travailleur·euses se sentent valorise·es, soutenu·es et habilite·es a donner le meilleur d eux·elles-memes.',
NULL,
NULL),

('Utilisation des terres',
 'L utilisation des terres fait reference a la maniere dont les terres sont utilisees ou gerees a des fins diverses, notamment agricoles, residuelles, commerciales, industrielles, recreatives ou de conservation. Elle englobe la planification, le developpement et l utilisation des ressources foncieres d une maniere qui tienne compte de la durabilite environnementale, du bien-etre social et de la prosperite economique.
Il est essentiel de comprendre et de traiter les questions d utilisation des sols pour evaluer les risques et les opportunites environnementaux, identifier les impacts sociaux et garantir des pratiques commerciales responsables. Cela peut impliquer la realisation d etudes d impact sur l environnement, la mise en œuvre de mesures de conservation des terres, la promotion de pratiques de gestion durable des terres, l engagement au pres des communautés locales et des parties prenantes, et le respect des reglementations et des normes pertinentes.',
NULL,
NULL),

('Utilisation efficace des ressources',
 'L utilisation efficace des ressources fait reference a l optimisation des ressources, y compris les matieres premieres, l eau et les principes de l economie circulaire.
L utilisation efficace des matieres premieres consiste a utiliser les ressources de maniere a minimiser les dechets et a maximiser leur valeur tout au long du processus de production.
L utilisation rationnelle de l eau consiste a reduire la consommation d eau et a minimiser les dechets d eau dans diverses activites de l entreprise, notamment les processus de fabrication, les systemes de refroidissement, l assainissement et l amenagement paysager.
L economie circulaire est un modele economique qui vise a minimiser les dechets et a maximiser l efficacite des ressources en maintenant les produits, les materiaux et les ressources en usage le plus longtemps possible grace a la reutilisation, au recyclage et a la regeneration.
L efficacite des ressources est importante pour les entreprises car elle permet de realiser des economies, de minimiser l impact sur l environnement en reduisant la destruction des habitats et la pollution, de favoriser la disponibilite des ressources pour les generations futures et d ameliorer la resilience.',
NULL,
NULL),

('Responsabilite Elargie des Producteurs (REP)',
 'La Responsabilite Elargie des Producteurs (REP) est un principe reglementaire selon lequel les fabricants, importateurs ou distributeurs sont tenus responsables de la gestion des dechets issus des produits qu ils mettent sur le marche. Cette responsabilite couvre generalement tout le cycle de vie du produit, y compris sa fin de vie.
Objectifs de la REP :
- Reduire les impacts environnementaux : Encourager les entreprises a concevoir des produits plus durables, reparables et recyclables.
- Financer la gestion des dechets : Les entreprises assument les couts associes au tri, a la collecte et au traitement des dechets.
- Promouvoir une economie circulaire : Reduire les dechets et favoriser le recyclage des materiaux.
Fonctionnement :
Les entreprises concernees doivent :
1. Adherer a un eco-organisme agre a par l Etat. Ces structures gerent les operations de collecte et de traitement des dechets.
2. Payer une contribution financiere : Cette somme est souvent calculee en fonction du type, du poids ou de la quantite de produits mis sur le marche.
3. Respecter des objectifs de recyclage defines par les autorites.',
NULL,
NULL);


-- Insertion d'un client
INSERT INTO shiftingpact_db.clients (prenom, nom, email, fonction, nom_entreprise, numero_tva, forme_juridique, adresse_siege_social, adresse_site_web, code_nace_activite_principal, chiffre_affaire_du_dernier_exercice_fiscal, franchise, nombre_travailleurs, litige_respect_loi_social_environnemental, honnete, soumission_demande_de_subside_pour_le_label, partenaire_introduction, ajouter_autre_chose, remarque_commentaire_precision, est_valide, mdp) VALUES
('Jean', 'Dupont', 'jean.dupont@example.com', 'CEO', 'Test', 'BE123456789', 'SPRL', 'Rue de la Loi 1, 1000 Bruxelles', 'www.test.com', '1234', 100000, FALSE, 10, FALSE, TRUE, TRUE, 'Partenaire', FALSE, 'Test', 'validée', 'pbkdf2_sha256$870000$hEeQ7kiQJqwYlIVnUDvJxN$mv5MB3LLpB7jhe+vB06ni7hMPfQiv9FiEFshRMTyZi0='); --mdp = ipl

INSERT INTO shiftingpact_db.clients (prenom, nom, email, fonction, nom_entreprise, numero_tva, forme_juridique, adresse_siege_social, adresse_site_web, code_nace_activite_principal, chiffre_affaire_du_dernier_exercice_fiscal, franchise, nombre_travailleurs, litige_respect_loi_social_environnemental, honnete, soumission_demande_de_subside_pour_le_label, partenaire_introduction, ajouter_autre_chose, remarque_commentaire_precision, est_valide, mdp) VALUES
('Jean', 'Dupont', 'jean.dupont@example.com1', 'CEO', 'Test', 'BE123456789', 'SPRL', 'Rue de la Loi 1, 1000 Bruxelles', 'www.test.com', '1234', 100000, FALSE, 10, FALSE, TRUE, TRUE, 'Partenaire', FALSE, 'Test', 'validée', 'pbkdf2_sha256$870000$hEeQ7kiQJqwYlIVnUDvJxN$mv5MB3LLpB7jhe+vB06ni7hMPfQiv9FiEFshRMTyZi0='); --mdp = ipl

    INSERT INTO shiftingpact_db.clients (prenom, nom, email, fonction, nom_entreprise, numero_tva, forme_juridique, adresse_siege_social, adresse_site_web, code_nace_activite_principal, chiffre_affaire_du_dernier_exercice_fiscal, franchise, nombre_travailleurs, litige_respect_loi_social_environnemental, honnete, soumission_demande_de_subside_pour_le_label, partenaire_introduction, ajouter_autre_chose, remarque_commentaire_precision, est_valide, mdp) VALUES
('Jean', 'Dupont', 'jean.dupont@example.com2', 'CEO', 'Test', 'BE123456789', 'SPRL', 'Rue de la Loi 1, 1000 Bruxelles', 'www.test.com', '1234', 100000, FALSE, 10, FALSE, TRUE, TRUE, 'Partenaire', FALSE, 'Test', 'validée', 'pbkdf2_sha256$870000$hEeQ7kiQJqwYlIVnUDvJxN$mv5MB3LLpB7jhe+vB06ni7hMPfQiv9FiEFshRMTyZi0='); --mdp = ipl

    INSERT INTO shiftingpact_db.clients (prenom, nom, email, fonction, nom_entreprise, numero_tva, forme_juridique, adresse_siege_social, adresse_site_web, code_nace_activite_principal, chiffre_affaire_du_dernier_exercice_fiscal, franchise, nombre_travailleurs, litige_respect_loi_social_environnemental, honnete, soumission_demande_de_subside_pour_le_label, partenaire_introduction, ajouter_autre_chose, remarque_commentaire_precision, est_valide, mdp) VALUES
('Jean', 'Dupont', 'jean.dupont@example.com3', 'CEO', 'Test', 'BE123456789', 'SPRL', 'Rue de la Loi 1, 1000 Bruxelles', 'www.test.com', '1234', 100000, FALSE, 10, FALSE, TRUE, TRUE, 'Partenaire', FALSE, 'Test', 'validée', 'pbkdf2_sha256$870000$hEeQ7kiQJqwYlIVnUDvJxN$mv5MB3LLpB7jhe+vB06ni7hMPfQiv9FiEFshRMTyZi0='); --mdp = ipl

    INSERT INTO shiftingpact_db.clients (prenom, nom, email, fonction, nom_entreprise, numero_tva, forme_juridique, adresse_siege_social, adresse_site_web, code_nace_activite_principal, chiffre_affaire_du_dernier_exercice_fiscal, franchise, nombre_travailleurs, litige_respect_loi_social_environnemental, honnete, soumission_demande_de_subside_pour_le_label, partenaire_introduction, ajouter_autre_chose, remarque_commentaire_precision, est_valide, mdp) VALUES
('Jean', 'Dupont', 'jean.dupont@example.com4', 'CEO', 'Test', 'BE123456789', 'SPRL', 'Rue de la Loi 1, 1000 Bruxelles', 'www.test.com', '1234', 100000, FALSE, 10, FALSE, TRUE, TRUE, 'Partenaire', FALSE, 'Test', 'validée', 'pbkdf2_sha256$870000$hEeQ7kiQJqwYlIVnUDvJxN$mv5MB3LLpB7jhe+vB06ni7hMPfQiv9FiEFshRMTyZi0='); --mdp = ipl

    INSERT INTO shiftingpact_db.clients (prenom, nom, email, fonction, nom_entreprise, numero_tva, forme_juridique, adresse_siege_social, adresse_site_web, code_nace_activite_principal, chiffre_affaire_du_dernier_exercice_fiscal, franchise, nombre_travailleurs, litige_respect_loi_social_environnemental, honnete, soumission_demande_de_subside_pour_le_label, partenaire_introduction, ajouter_autre_chose, remarque_commentaire_precision, est_valide, mdp) VALUES
('Jean', 'Dupont', 'jean.dupont@example.com5', 'CEO', 'Test', 'BE123456789', 'SPRL', 'Rue de la Loi 1, 1000 Bruxelles', 'www.test.com', '1234', 100000, FALSE, 10, FALSE, TRUE, TRUE, 'Partenaire', FALSE, 'Test', 'validée', 'pbkdf2_sha256$870000$hEeQ7kiQJqwYlIVnUDvJxN$mv5MB3LLpB7jhe+vB06ni7hMPfQiv9FiEFshRMTyZi0='); --mdp = ipl

    INSERT INTO shiftingpact_db.clients (prenom, nom, email, fonction, nom_entreprise, numero_tva, forme_juridique, adresse_siege_social, adresse_site_web, code_nace_activite_principal, chiffre_affaire_du_dernier_exercice_fiscal, franchise, nombre_travailleurs, litige_respect_loi_social_environnemental, honnete, soumission_demande_de_subside_pour_le_label, partenaire_introduction, ajouter_autre_chose, remarque_commentaire_precision, est_valide, mdp) VALUES
('Jean', 'Dupont', 'jean.dupont@example.com6', 'CEO', 'Test', 'BE123456789', 'SPRL', 'Rue de la Loi 1, 1000 Bruxelles', 'www.test.com', '1234', 100000, FALSE, 10, FALSE, TRUE, TRUE, 'Partenaire', FALSE, 'Test', 'validée', 'pbkdf2_sha256$870000$hEeQ7kiQJqwYlIVnUDvJxN$mv5MB3LLpB7jhe+vB06ni7hMPfQiv9FiEFshRMTyZi0='); --mdp = ipl

    INSERT INTO shiftingpact_db.clients (prenom, nom, email, fonction, nom_entreprise, numero_tva, forme_juridique, adresse_siege_social, adresse_site_web, code_nace_activite_principal, chiffre_affaire_du_dernier_exercice_fiscal, franchise, nombre_travailleurs, litige_respect_loi_social_environnemental, honnete, soumission_demande_de_subside_pour_le_label, partenaire_introduction, ajouter_autre_chose, remarque_commentaire_precision, est_valide, mdp) VALUES
('Jean', 'Dupont', 'jean.dupont@example.com22h§hy§', 'CEO', 'Test', 'BE123456789', 'SPRL', 'Rue de la Loi 1, 1000 Bruxelles', 'www.test.com', '1234', 100000, FALSE, 10, FALSE, TRUE, TRUE, 'Partenaire', FALSE, 'Test', 'validée', 'pbkdf2_sha256$870000$hEeQ7kiQJqwYlIVnUDvJxN$mv5MB3LLpB7jhe+vB06ni7hMPfQiv9FiEFshRMTyZi0='); --mdp = ipl

--INSERT STANDARD
INSERT INTO shiftingpact_db.standards (nom,presentation, plus_info) VALUES
('B Lab®',
'B Lab est une ONG internationale qui développe des normes afin d établir les meilleures pratiques dans les domaines environnementaux, sociaux et de gouvernance (ESG) pour les entreprises. ' ||
 'Depuis la création de B Lab en 2006, ces normes sont en constante évolution. ' ||
 'Elles sont pilotées de manière indépendante par le "Standards Advisory Council" et le Conseil d administration de B Lab. ' ||
 'Ces Conseils reçoivent des avis et suggestions de parties prenantes externes et de divers groupes de travail et groupes consultatifs. ' ||
 'Les membres du Conseil consultatif des normes viennent d horizons divers : entreprises, gouvernements, universités et organisations à but non lucratif du monde entier, ' ||
 'ce qui leur permet d apporter un large éventail d expertise en matière de valorisation et d évaluation des entreprises au service du bien commun.' ||
 '\n\nL une des composantes particulièrement importantes de ces normes est le "B Impact Assessment" (BIA). ' ||
 'Il s agit d un outil complet permettant d évaluer, de gérer et d améliorer l impact positif d une entreprise sur les travailleur·euses, les communautés, les client·es, les fournisseurs et l environnement. ' ||
 'Cette évaluation examine non seulement les pratiques opérationnelles, mais aussi le modèle économique de l entreprise. ' ||
 'Pour obtenir la certification B Corp, les entreprises doivent obtenir un score vérifié d au moins 80 sur cette évaluation.' ||
 '\n\nAu cœur du mouvement B Corp, les normes de B Lab visent à ouvrir la voie à une économie plus équitable, plus inclusive et plus régénératrice.',
'https://www.bcorporation.net/en-us/standards/'),

('EFRAG',
'Le European Financial Reporting Advisory Group (EFRAG) est une association privée créée en 2001 par les principales fédérations et instituts comptables européens. ' ||
'\n\nLe rôle principal de l EFRAG est de fournir une expertise technique et des conseils à la Commission européenne sur les questions liées à l information financière et aux normes comptables. ' ||
'L EFRAG joue un rôle essentiel dans le processus d approbation des International Financial Reporting Standards (IFRS) au sein de l Union européenne (UE). ' ||
'\n\nPlus récemment, l EFRAG a fourni une expertise technique et des conseils sur les normes d information sur le développement durable et les exigences relatives aux European Sustainability Reporting Standards (ESRS). ' ||
'Ces normes visent à renforcer les exigences en matière d information sur le développement durable pour les entreprises opérant au sein de l UE. ' ||
'Elles visent à améliorer la qualité, la comparabilité et la fiabilité des informations sur le développement durable publiées par les entreprises, permettant ainsi aux investisseurs, aux parties prenantes et aux décideurs politiques de prendre des décisions mieux informées.',
'https://www.efrag.org/'),

('VSME ESRS',
'En novembre 2022, l EFRAG a présenté la norme volontaire européenne de reporting de durabilité pour les petites et moyennes entreprises non cotées (VSME ESRS). ' ||
'Veuillez noter que cette norme est actuellement (mars 2024) à l état de projet et qu elle peut faire l objet de développements ultérieurs.' ||
'\n\nLa présente norme vise à aider les micro, petites et moyennes entreprises à : ' ||
'- Contribuer à une économie plus durable et plus inclusive ; ' ||
'- Améliorer leur gestion des défis liés au développement durable, tels que les questions environnementales et la santé et la sécurité du personnel, et promouvoir ainsi la croissance compétitive et la résilience à long terme. ' ||
'- Fournir des données qui répondent aux exigences des prêteurs, des fournisseurs de crédit, des investisseurs et des grandes entreprises qui recherchent des informations sur la durabilité auprès de leurs fournisseurs, facilitant ainsi l accès au financement et répondant aux demandes du marché.' ||
'\n\nL ESRS VSME est volontaire et s applique aux entreprises de l Union européenne qui ne sont pas cotées en bourse et qui entrent dans les catégories de la directive 2013/34/UE pour les petites et moyennes entreprises sur la base du total du bilan, du chiffre d affaires net et du nombre moyen de travailleur·euses au cours de l exercice. ' ||
'Bien qu elles n entrent pas dans le champ d application de la directive sur les rapports sociaux des entreprises (CSRD), les micro-entreprises et les petites et moyennes entreprises sont encouragées à utiliser le VSME ESRS pour leurs rapports sur le développement durable. ' ||
'Cette norme couvre des questions de développement durable similaires à celles de l ESRS pour les grandes entreprises, mais elle est adaptée aux caractéristiques fondamentales des micro, petites et moyennes entreprises.',
'https://www.efrag.org/News/Public-479/EFRAGs-public-consultation-on-two-Exposure-Drafts-on-sustainability-r\n\nhttps://www.efrag.org/Assets/Download?assetUrl=%2Fsites%2Fwebpublishing%2FSiteAssets%2FVSME%2520ED%2520January%25202024.pdf'),

('Pacte mondial des Nations Unies (UNGC)',
'Le Pacte mondial des Nations unies est une initiative lancée en 2000 par les Nations unies. ' ||
'Il vise à encourager les entreprises à adopter des pratiques commerciales socialement responsables et durables, et à jouer ainsi leur rôle dans la réalisation des objectifs de développement durable.' ||
'\n\nPour ce faire, le Pacte propose un cadre d engagements basé sur dix principes universellement acceptés dans les domaines des droits de l homme, du travail, de l environnement et de la lutte contre la corruption. ' ||
'Ces principes découlent de la Déclaration universelle des droits de l homme, de la Déclaration de l Organisation internationale du travail relative aux principes et droits fondamentaux au travail, de la Déclaration de Rio sur l environnement et le développement et de la Convention des Nations unies contre la corruption.' ||
'\n\nLes entreprises qui adhèrent au Pacte mondial des Nations unies s engagent à intégrer ces principes dans leurs stratégies et leurs opérations, et à rendre compte publiquement des progrès accomplis dans la réalisation de ces objectifs.' ||
'\n\nLe Pacte mondial des Nations unies compte des milliers de participants dans plus de 160 pays. ' ||
'Il rassemble des entreprises, des organisations non gouvernementales, des gouvernements et d autres parties prenantes.',
'https://unglobalcompact.org/'),

('IF PNUE (UNEP FI)',
'L initiative financière du Programme des Nations unies pour l environnement (IF PNUE) est un partenariat entre le Programme des Nations unies pour l environnement (PNUE) et le secteur financier mondial. ' ||
'L IF PNUE s efforce de promouvoir la finance durable, en visant à intégrer les facteurs environnementaux, sociaux et de gouvernance (ESG) dans les processus de prise de décision financière.' ||
'\n\nCréé en 1992, l IF PNUEI sert de plateforme aux institutions financières, y compris les banques, les assureurs et les investisseurs, pour collaborer et développer des stratégies de développement durable. ' ||
'Ses initiatives comprennent la recherche, la défense des politiques et le développement d outils et de cadres pour aider les institutions financières à intégrer les principes de durabilité dans leurs opérations et leurs stratégies d investissement.' ||
'\n\nL IF PNUE reconnaît que divers secteurs et industries peuvent avoir des impacts positifs et négatifs sur l environnement et la société. ' ||
'Il élabore notamment des lignes directrices ou des cadres sectoriels qui mettent en évidence les impacts négatifs potentiels associés à chaque secteur. ' ||
'Ces lignes directrices peuvent concerner des secteurs tels que l énergie, l agriculture, la finance, etc. ' ||
'Elles décrivent les risques environnementaux et sociaux spécifiques qui doivent être pris en compte par les institutions financières et les investisseurs opérant dans ces secteurs.',
'https://www.unepfi.org/about/'),

('PAI',
'Potential Adverse Impact (PAI) fait référence aux effets négatifs possibles d un investissement sur les facteurs environnementaux, sociaux ou de gouvernance (ESG). ' ||
'\n\nLe PAI est un concept introduit dans le cadre du règlement de l Union européenne relatif à la divulgation d informations sur la finance durable (SFDR). ' ||
'À partir de janvier 2023, ce règlement exige des acteur·rices des marchés financiers qu ils·elles publient des informations sur la manière dont ils·elles intègrent les risques liés au développement durable dans leurs processus de prise de décision en matière d investissement. ' ||
'Il s agit notamment de divulguer la manière dont ils évaluent et gèrent les principaux PAI, qui concernent les questions climatiques, environnementales, sociales et de droits de l homme. ' ||
'Le règlement définit 16 indicateurs obligatoires, dont 14 sont applicables aux entreprises et 2 sont spécifiquement conçus pour les actifs immobiliers.' ||
'\n\nLa divulgation des PAI vise à fournir une transparence aux investisseur·euses concernant les effets négatifs potentiels des investissements sur les facteurs de durabilité, ' ||
'ce qui leur permet de prendre des décisions d investissement plus éclairées qui correspondent à leurs préférences et à leurs objectifs en matière de durabilité.',
'https://europa.eu/!fpD2kM'),

('ODD (SDG)',
'Les ODD, ou Objectifs de développement durable (Sustainable Development Goals en anglais), sont un ensemble de 17 objectifs mondiaux adoptés par les États membres des Nations unies en 2015 dans le cadre de l Agenda 2030 pour le développement durable. ' ||
'Ces objectifs visent à relever les défis les plus urgents du monde, tels que la pauvreté, les inégalités, le changement climatique, la dégradation de l environnement, la paix et la justice sociale.' ||
'\n\nLes ODD sont conçus pour être universels, intégrés et indivisibles, reflétant les dimensions économiques, sociales et environnementales du développement durable. ' ||
'Chaque objectif est accompagné de cibles spécifiques et mesurables, soit 169 cibles au total, afin de guider les efforts de mise en œuvre et de suivi.' ||
'\n\nLes ODD fournissent un cadre global pour guider les politiques, les stratégies et les actions à tous les niveaux, des gouvernements aux entreprises, en passant par la société civile et les individus, vers un avenir plus durable et plus inclusif pour tous.',
'https://sdgs.un.org/fr/goals'),

('Forum Ethibel',
'Forum Ethibel est désigné comme auditeur externe pour effectuer des contrôles ex-post de 20% des PME labellisées. ' ||
'Ces contrôles donnent lieu à des rapports publics, décrivant la couverture, l exhaustivité et la qualité du processus de labellisation.',
'https://www.forumethibel.org/fr');
