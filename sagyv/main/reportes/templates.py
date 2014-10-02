# -*- coding: utf-8 -*-
from reportlab.lib import colors
from reportlab.platypus import BaseDocTemplate, Paragraph, Spacer, Frame, PageTemplate, PageBreak, NextPageTemplate, \
    Table, TableStyle
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.graphics.shapes import Rect
from reportlab.lib.colors import tan

from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import cm, inch

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from openpyxl import Workbook
from openpyxl.writer.excel import save_virtual_workbook

class TemplateBasePDF(BaseDocTemplate):

    """
         Parametros Posibles

         filename,
         pagesize=defaultPageSize,
         pageTemplates=[],
         showBoundary=0,
         leftMargin=inch,
         rightMargin=inch,
         topMargin=inch,
         bottomMargin=inch,
         allowSplitting=1,
         title=None,
         author=None,
         _pageBreakQuick=1,
        encrypt=None
    """

    def __init__(self, *args, **kwargs):
        BaseDocTemplate.__init__(self, *args, **kwargs)

        self.estilos = getSampleStyleSheet()
        self.contenido = []

    def saltar_pagina(self):
        self.contenido.append(PageBreak())

    def generar_documento(self):
        self.build(self.contenido)


class ConsumoClientesComerciales(object):

    def __init__(self):
        self.nombre = "consumo_clientes_comerciales"
        self.nombres_productos = []
        self.wb = Workbook(encoding="utf-8")
        self.matriz = {}

    def set_productos(self,productos):
        self.productos   = productos

    def set_clientes(self, clientes):
        self.clientes = (c.nombre for c in clientes)

    def construir_reporte(self, datos):
        hoja = self.wb.create_sheet(0,"Consumo")


        cont_col = ord("B")

        for producto in self.productos:
            str_col = str(chr(cont_col)+"1")
            hoja.cell(str_col).value = producto.nombre
            self.matriz[producto.id] = str(chr(cont_col))
            cont_col = cont_col + 1
            print str_col +" "+producto.nombre

        cont_fila = 2

        for nombre in self.clientes:
            str_fila = "A"+str(cont_fila)
            hoja.cell(str_fila).value = nombre
            self.matriz[nombre] = str(cont_fila)
            cont_fila = cont_fila + 1
            print str_fila +" " +nombre

        for consumo in datos:
            #@type consumo manager.ConsumoCliente
            columna = self.matriz[consumo.id_producto]
            fila = self.matriz[consumo.nombre]

            print fila+" | "+columna
            hoja.cell(columna+fila).value = str(consumo.suma_monto)


        return save_virtual_workbook(self.wb)


if __name__ == "__main__":
    print "oli"