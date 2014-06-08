-- tipos de productos
INSERT INTO main_tipoproducto(id, nombre) VALUES(1, 'llenos normales');
INSERT INTO main_tipoproducto(id, nombre) VALUES(2, 'llenos catalíticos');
INSERT INTO main_tipoproducto(id, nombre) VALUES(3, 'garantías');

-- tipos de cambio en stock
INSERT INTO main_tipocambiostock(id, nombre) VALUES(1, 'Compra');
INSERT INTO main_tipocambiostock(id, nombre) VALUES(2, 'Venta');
INSERT INTO main_tipocambiostock(id, nombre) VALUES(3, 'Carta Canje');

-- productos
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(1, 1105, '5 kilos', 5, 1);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(2, 1111, '11 kilos', 11, 1);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(3, 1115, '15 kilos', 15, 1);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(4, 1145, '45 kilos', 45, 1);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(5, 1215, 'Autogas Aluminio', 15, 1);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(6, 1315, 'Autogas Fierro', 15, 1);

INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(7, 1405, '5 kilos', 5, 2);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(8, 1411, '11 kilos', 11, 2);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(9, 1415, '15 kilos', 15, 2);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(10, 1445, '45 kilos', 45, 2);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(11, 1515, 'Butano', 15, 2);

INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(12, 3105, '5 kilos', 5, 3);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(13, 3111, '11 kilos', 11, 3);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(14, 3115, '15 kilos', 15, 3);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(15, 3145, '45 kilos', 45, 3);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(16, 3215, 'Aluminio', 15, 3);
INSERT INTO main_producto(id, codigo, nombre, peso, tipo_producto_id) VALUES(17, 3315, 'Fierro', 15, 3);

-- tipos de pago
INSERT INTO main_tipopago(id, nombre) VALUES(1, 'Efectivo');
INSERT INTO main_tipopago(id, nombre) VALUES(2, 'Voucher');
INSERT INTO main_tipopago(id, nombre) VALUES(3, 'Cupón prepago');

-- COLOCAR NOMBRE MAS SIGNIFICATIVO
INSERT INTO main_tipopago(id, nombre) VALUES(4, 'Guía de despacho');

-- tarjetas de credito
INSERT INTO main_tipotarjeta(id, nombre) VALUES(1, 'tarjeta crédito');
INSERT INTO main_tipotarjeta(id, nombre) VALUES(2, 'tarjeta debito');
INSERT INTO main_tipotarjeta(id, nombre) VALUES(3, 'tarjeta casa comercial');

INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(1, 'VISA', 'vi', 1);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(2, 'Mastercard', 'mc', 1);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(3, 'American Express', 'ae', 1);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(4, 'Dinners Club', 'dc', 1);

INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(5, 'Debito', null, 2);

INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(6, 'Falabella', null, 3);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(7, 'Ripley', null, 3);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(8, 'Cencosud', null, 3);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(9, 'La Polar', null, 3);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(10, 'Tricot', null, 3);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(11, 'Johnson', null, 3);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(12, 'Dijon', null, 3);
INSERT INTO main_tarjetacredito(id, nombre, codigo, tipo_tarjeta_id) VALUES(13, 'Hites', null, 3);

-- Descuento
INSERT INTO main_tipodescuento(id, tipo) VALUES(1, 'Fijo');
INSERT INTO main_tipodescuento(id, tipo) VALUES(2, 'Porcentaje');

-- AFPS
INSERT INTO main_afp(id, nombre) VALUES(1, 'Bansander');
INSERT INTO main_afp(id, nombre) VALUES(2, 'Cuprum');
INSERT INTO main_afp(id, nombre) VALUES(3, 'Habitat');
INSERT INTO main_afp(id, nombre) VALUES(4, 'Planvital');
INSERT INTO main_afp(id, nombre) VALUES(5, 'Provida');
INSERT INTO main_afp(id, nombre) VALUES(6, 'Santa María');
INSERT INTO main_afp(id, nombre) VALUES(7, 'Modelo');

-- sistemas de salud
INSERT INTO main_sistemasalud(id, nombre) VALUES(1,'Isapre');
INSERT INTO main_sistemasalud(id, nombre) VALUES(2,'Fonasa');

-- Isapres
INSERT INTO main_isapre(id, nombre) VALUES(1, 'Banmédica');
INSERT INTO main_isapre(id, nombre) VALUES(2, 'Colmena');
INSERT INTO main_isapre(id, nombre) VALUES(3, 'Consalud');
INSERT INTO main_isapre(id, nombre) VALUES(4, 'Cruz Blanca');
INSERT INTO main_isapre(id, nombre) VALUES(5, 'Más Vida');
INSERT INTO main_isapre(id, nombre) VALUES(6, 'Vida Tres');

-- Estados Civiles
INSERT INTO main_estadocivil(id, nombre) VALUES(1, 'Soltero');
INSERT INTO main_estadocivil(id, nombre) VALUES(2, 'Casado');
INSERT INTO main_estadocivil(id, nombre) VALUES(3, 'Divorciado');
INSERT INTO main_estadocivil(id, nombre) VALUES(4, 'Viudo');

-- regiones
INSERT INTO main_region (id, nombre, orden) VALUES (1, 'Región de Tarapacá', 1);
INSERT INTO main_region (id, nombre, orden) VALUES (2, 'Región de Antofagasta', 2);
INSERT INTO main_region (id, nombre, orden) VALUES (3, 'Región de Atacama', 3);
INSERT INTO main_region (id, nombre, orden) VALUES (4, 'Región de Coquimbo', 4);
INSERT INTO main_region (id, nombre, orden) VALUES (5, 'Región de Valparaíso', 5);
INSERT INTO main_region (id, nombre, orden) VALUES (6, 'Región del Libertador Gral. Bernardo O’Higgins', 6);
INSERT INTO main_region (id, nombre, orden) VALUES (7, 'Región del Maule', 7);
INSERT INTO main_region (id, nombre, orden) VALUES (8, 'Región del Biobío', 8);
INSERT INTO main_region (id, nombre, orden) VALUES (9, 'Región de la Araucanía', 9);
INSERT INTO main_region (id, nombre, orden) VALUES (10, 'Región de Los Lagos', 10);
INSERT INTO main_region (id, nombre, orden) VALUES (11, 'Región Aisén del Gral. Carlos Ibáñez del Campo', 11);
INSERT INTO main_region (id, nombre, orden) VALUES (12, 'Región de Magallanes y de la Antártica Chilena', 12);
INSERT INTO main_region (id, nombre, orden) VALUES (13, 'Región Metropolitana de Santiago', 13);
INSERT INTO main_region (id, nombre, orden) VALUES (14, 'Región de Los Ríos', 14);
INSERT INTO main_region (id, nombre, orden) VALUES (15, 'Región de Arica y Parinacota', 15);


-- comunas
INSERT INTO main_comuna (id, region_id, nombre) VALUES (1101, 1, 'Iquique');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (1107, 1, 'Alto Hospicio');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (1401, 1, 'Pozo Almonte');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (1402, 1, 'Camiña');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (1403, 1, 'Colchane');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (1404, 1, 'Huara');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (1405, 1, 'Pica');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2101, 2, 'Antofagasta');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2102, 2, 'Mejillones');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2103, 2, 'Sierra Gorda');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2104, 2, 'Taltal');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2201, 2, 'Calama');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2202, 2, 'Ollagüe');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2203, 2, 'San Pedro de Atacama');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2301, 2, 'Tocopilla');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (2302, 2, 'María Elena');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3101, 3, 'Copiapó');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3102, 3, 'Caldera');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3103, 3, 'Tierra Amarilla');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3201, 3, 'Chañaral');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3202, 3, 'Diego de Almagro');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3301, 3, 'Vallenar');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3302, 3, 'Alto del Carmen');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3303, 3, 'Freirina');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (3304, 3, 'Huasco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4101, 4, 'La Serena');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4102, 4, 'Coquimbo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4103, 4, 'Andacollo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4104, 4, 'La Higuera');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4105, 4, 'Paiguano');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4106, 4, 'Vicuña');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4201, 4, 'Illapel');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4202, 4, 'Canela');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4203, 4, 'Los Vilos');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4204, 4, 'Salamanca');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4301, 4, 'Ovalle');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4302, 4, 'Combarbalá');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4303, 4, 'Monte Patria');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4304, 4, 'Punitaqui');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (4305, 4, 'Río Hurtado');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5101, 5, 'Valparaíso');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5102, 5, 'Casablanca');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5103, 5, 'Concón');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5104, 5, 'Juan Fernández');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5105, 5, 'Puchuncaví');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5107, 5, 'Quintero');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5109, 5, 'Viña del Mar');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5201, 5, 'Isla de Pascua');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5301, 5, 'Los Andes');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5302, 5, 'Calle Larga');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5303, 5, 'Rinconada');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5304, 5, 'San Esteban');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5401, 5, 'La Ligua');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5402, 5, 'Cabildo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5403, 5, 'Papudo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5404, 5, 'Petorca');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5405, 5, 'Zapallar');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5501, 5, 'Quillota');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5502, 5, 'Calera');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5503, 5, 'Hijuelas');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5504, 5, 'La Cruz');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5506, 5, 'Nogales');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5601, 5, 'San Antonio');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5602, 5, 'Algarrobo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5603, 5, 'Cartagena');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5604, 5, 'El Quisco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5605, 5, 'El Tabo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5606, 5, 'Santo Domingo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5701, 5, 'San Felipe');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5702, 5, 'Catemu');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5703, 5, 'Llaillay');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5704, 5, 'Panquehue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5705, 5, 'Putaendo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5706, 5, 'Santa María');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5801, 5, 'Quilpué ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5802, 5, 'Limache');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5803, 5, 'Olmué');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (5804, 5, 'Villa Alemana');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6101, 6, 'Rancagua');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6102, 6, 'Codegua');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6103, 6, 'Coinco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6104, 6, 'Coltauco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6105, 6, 'Doñihue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6106, 6, 'Graneros');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6107, 6, 'Las Cabras');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6108, 6, 'Machalí');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6109, 6, 'Malloa');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6110, 6, 'Mostazal');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6111, 6, 'Olivar');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6112, 6, 'Peumo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6113, 6, 'Pichidegua');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6114, 6, 'Quinta de Tilcoco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6115, 6, 'Rengo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6116, 6, 'Requínoa');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6117, 6, 'San Vicente');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6201, 6, 'Pichilemu');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6202, 6, 'La Estrella');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6203, 6, 'Litueche');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6204, 6, 'Marchihue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6205, 6, 'Navidad');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6206, 6, 'Paredones');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6301, 6, 'San Fernando');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6302, 6, 'Chépica');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6303, 6, 'Chimbarongo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6304, 6, 'Lolol');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6305, 6, 'Nancagua');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6306, 6, 'Palmilla');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6307, 6, 'Peralillo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6308, 6, 'Placilla');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6309, 6, 'Pumanque');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (6310, 6, 'Santa Cruz');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7101, 7, 'Talca');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7102, 7, 'Constitución');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7103, 7, 'Curepto');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7104, 7, 'Empedrado');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7105, 7, 'Maule');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7106, 7, 'Pelarco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7107, 7, 'Pencahue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7108, 7, 'Río Claro');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7109, 7, 'San Clemente');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7110, 7, 'San Rafael');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7201, 7, 'Cauquenes');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7202, 7, 'Chanco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7203, 7, 'Pelluhue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7301, 7, 'Curicó');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7302, 7, 'Hualañé');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7303, 7, 'Licantén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7304, 7, 'Molina');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7305, 7, 'Rauco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7306, 7, 'Romeral');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7307, 7, 'Sagrada Familia');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7308, 7, 'Teno');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7309, 7, 'Vichuquén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7401, 7, 'Linares');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7402, 7, 'Colbún');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7403, 7, 'Longaví');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7404, 7, 'Parral');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7405, 7, 'Retiro');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7406, 7, 'San Javier');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7407, 7, 'Villa Alegre');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (7408, 7, 'Yerbas Buenas');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8101, 8, 'Concepción');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8102, 8, 'Coronel');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8103, 8, 'Chiguayante');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8104, 8, 'Florida');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8105, 8, 'Hualqui');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8106, 8, 'Lota');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8107, 8, 'Penco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8108, 8, 'San Pedro de la Paz');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8109, 8, 'Santa Juana');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8110, 8, 'Talcahuano');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8111, 8, 'Tomé');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8112, 8, 'Hualpén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8201, 8, 'Lebu');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8202, 8, 'Arauco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8203, 8, 'Cañete');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8204, 8, 'Contulmo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8205, 8, 'Curanilahue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8206, 8, 'Los Álamos');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8207, 8, 'Tirúa');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8301, 8, 'Los Ángeles');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8302, 8, 'Antuco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8303, 8, 'Cabrero');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8304, 8, 'Laja');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8305, 8, 'Mulchén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8306, 8, 'Nacimiento');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8307, 8, 'Negrete');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8308, 8, 'Quilaco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8309, 8, 'Quilleco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8310, 8, 'San Rosendo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8311, 8, 'Santa Bárbara');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8312, 8, 'Tucapel');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8313, 8, 'Yumbel');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8314, 8, 'Alto Biobío');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8401, 8, 'Chillán');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8402, 8, 'Bulnes');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8403, 8, 'Cobquecura');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8404, 8, 'Coelemu');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8405, 8, 'Coihueco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8406, 8, 'Chillán Viejo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8407, 8, 'El Carmen');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8408, 8, 'Ninhue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8409, 8, 'Ñiquén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8410, 8, 'Pemuco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8411, 8, 'PINTO');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8412, 8, 'Portezuelo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8413, 8, 'Quillón');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8414, 8, 'Quirihue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8415, 8, 'Ránquil');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8416, 8, 'San Carlos');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8417, 8, 'San Fabián');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8418, 8, 'San Ignacio');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8419, 8, 'San Nicolás');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8420, 8, 'Treguaco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (8421, 8, 'Yungay');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9101, 9, 'Temuco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9102, 9, 'Carahue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9103, 9, 'Cunco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9104, 9, 'Curarrehue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9105, 9, 'Freire');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9106, 9, 'Galvarino');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9107, 9, 'Gorbea');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9108, 9, 'Lautaro');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9109, 9, 'Loncoche');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9110, 9, 'Melipeuco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9111, 9, 'Nueva Imperial');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9112, 9, 'Padre las Casas');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9113, 9, 'Perquenco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9114, 9, 'Pitrufquén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9115, 9, 'Pucón');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9116, 9, 'Saavedra');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9117, 9, 'Teodoro Schmidt');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9118, 9, 'Toltén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9119, 9, 'Vilcún');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9120, 9, 'Villarrica');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9121, 9, 'Cholchol');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9201, 9, 'Angol');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9202, 9, 'Collipulli');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9203, 9, 'Curacautín');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9204, 9, 'Ercilla');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9205, 9, 'Lonquimay');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9206, 9, 'Los Sauces');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9207, 9, 'Lumaco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9208, 9, 'Purén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9209, 9, 'Renaico');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9210, 9, 'Traiguén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (9211, 9, 'Victoria');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10101, 10, 'Puerto Montt');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10102, 10, 'Calbuco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10103, 10, 'Cochamó');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10104, 10, 'Fresia');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10105, 10, 'Frutillar');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10106, 10, 'Los Muermos');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10107, 10, 'Llanquihue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10108, 10, 'Maullín');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10109, 10, 'Puerto Varas');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10201, 10, 'Castro');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10202, 10, 'Ancud');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10203, 10, 'Chonchi');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10204, 10, 'Curaco de Vélez');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10205, 10, 'Dalcahue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10206, 10, 'Puqueldón');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10207, 10, 'Queilén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10208, 10, 'Quellón');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10209, 10, 'Quemchi');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10210, 10, 'Quinchao');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10301, 10, 'Osorno');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10302, 10, 'Puerto Octay');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10303, 10, 'Purranque');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10304, 10, 'Puyehue');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10305, 10, 'Río Negro');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10306, 10, 'San Juan de la Costa');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10307, 10, 'San Pablo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10401, 10, 'Chaitén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10402, 10, 'Futaleufú');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10403, 10, 'Hualaihué');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (10404, 10, 'Palena');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11101, 11, 'Coihaique');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11102, 11, 'Lago Verde');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11201, 11, 'Aisén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11202, 11, 'Cisnes');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11203, 11, 'Guaitecas');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11301, 11, 'Cochrane');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11302, 11, 'O’Higgins');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11303, 11, 'Tortel');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11401, 11, 'Chile Chico');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (11402, 11, 'Río Ibáñez');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12101, 12, 'Punta Arenas');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12102, 12, 'Laguna Blanca');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12103, 12, 'Río Verde');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12104, 12, 'San Gregorio');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12201, 12, 'Cabo de Hornos(Ex Navarino)');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12202, 12, 'Antártica');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12301, 12, 'Porvenir');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12302, 12, 'Primavera');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12303, 12, 'Timaukel');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12401, 12, 'Natales');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (12402, 12, 'Torres del Paine');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13101, 13, 'Santiago');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13102, 13, 'Cerrillos');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13103, 13, 'Cerro Navia');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13104, 13, 'Conchalí');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13105, 13, 'El Bosque');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13106, 13, 'Estación Central');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13107, 13, 'Huechuraba');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13108, 13, 'Independencia');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13109, 13, 'La Cisterna');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13110, 13, 'La Florida');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13111, 13, 'La Granja');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13112, 13, 'La Pintana');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13113, 13, 'La Reina');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13114, 13, 'Las Condes');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13115, 13, 'Lo Barnechea');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13116, 13, 'Lo Espejo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13117, 13, 'Lo Prado');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13118, 13, 'Macul');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13119, 13, 'Maipú');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13120, 13, 'Ñuñoa');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13121, 13, 'Pedro Aguirre Cerda');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13122, 13, 'Peñalolén');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13123, 13, 'Providencia');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13124, 13, 'Pudahuel');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13125, 13, 'Quilicura');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13126, 13, 'Quinta Normal');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13127, 13, 'Recoleta');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13128, 13, 'Renca');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13129, 13, 'San Joaquín');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13130, 13, 'San Miguel');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13131, 13, 'San Ramón');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13132, 13, 'Vitacura');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13201, 13, 'Puente Alto');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13202, 13, 'Pirque');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13203, 13, 'San José de Maipo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13301, 13, 'Colina');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13302, 13, 'Lampa');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13303, 13, 'Tiltil');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13401, 13, 'San Bernardo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13402, 13, 'Buin');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13403, 13, 'Calera de Tango');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13404, 13, 'Paine');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13501, 13, 'Melipilla');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13502, 13, 'Alhué');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13503, 13, 'Curacaví');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13504, 13, 'María PINTO');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13505, 13, 'San Pedro');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13601, 13, 'Talagante');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13602, 13, 'El Monte');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13603, 13, 'Isla de Maipo');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13604, 13, 'Padre Hurtado');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (13605, 13, 'Peñaflor');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14101, 14, 'Valdivia ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14102, 14, 'Corral ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14103, 14, 'Lanco ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14104, 14, 'Los Lagos ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14105, 14, 'Máfil');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14106, 14, 'Mariquina');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14107, 14, 'Paillaco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14108, 14, 'Panguipulli ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14201, 14, 'La Unión ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14202, 14, 'Futrono ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14203, 14, 'Lago Ranco');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (14204, 14, 'Río Bueno');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (15101, 15, 'Arica ');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (15102, 15, 'Camarones');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (15201, 15, 'Putre');
INSERT INTO main_comuna (id, region_id, nombre) VALUES (15202, 15, 'General Lagos ');
