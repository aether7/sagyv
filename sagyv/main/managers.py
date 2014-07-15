from django.db import connection, models

class StockManager(models.Manager):

	def get_stock(self):
		consulta_sql = """
            SELECT  mp.codigo,
                    mp.peso,
                    msv.producto_id,
                    mtp.nombre,
                    SUM(msv.cantidad) as cantidad
            FROM main_stockvehiculo msv
            INNER JOIN main_producto mp ON(msv.producto_id = mp.id)
            INNER JOIN main_tipoproducto mtp ON(mp.tipo_producto_id = mtp.id)
            GROUP BY mp.codigo, mp.peso, msv.producto_id, mtp.nombre;
        """
		query = connection.cursor()
		query.execute(consulta_sql)

		resultado = []

		for row in query.fetchall():
			p = Stock()
			p.codigo = row[0]
			p.peso = row[1]
			p.producto_id = row[2]
			p.nombre = row[3]
			p.cantidad = row[4]
			resultado.append(p)

		return resultado

	def get_stock_total(self):
		consulta_sql = """
            SELECT  mp.codigo,
                    mp.peso,
                    mtp.nombre,
                    mp.stock as stock,
                    (SELECT cantidad  FROM main_stockvehiculo WHERE producto_id = mp.id) as cantidad,
                    mp.id

            FROM main_producto mp

            INNER JOIN main_tipoproducto mtp ON(mp.tipo_producto_id = mtp.id)
            GROUP BY mp.codigo, mp.peso,  mtp.nombre, mp.stock,mp.id
        """

		query = connection.cursor()
		query.execute(consulta_sql)

		resultado = []

		for row in query.fetchall():
			p = Stock()
			p.codigo = row[0]
			p.peso = row[1]
			p.nombre = row[2]

			if row[4]:
				p.cantidad = (row[3] +row[4]) or 0
			else:
				p.cantidad = (row[4]) or 0

			resultado.append(p)

		return resultado

class Stock():
	def __init__(self):
		self.codigo = 0
		self.peso = 0
		self.producto_id = 0
		self.nombre = ''
		self.cantidad = 0