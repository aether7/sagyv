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
            GROUP BY producto_id;
        """
        query = connection.cursor()
        query.execute(consulta_sql)

        resultado = []

        for row in query.fetchall():
            p = self.model(codigo=row[0], peso=row[1], producto_id=row[2], nombre=row[3])
            p.cantidad = row[4]
            resultado.append(p)

        return resultado
