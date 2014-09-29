# -*- coding: utf-8 -*-
from reportlab.platypus import BaseDocTemplate, Paragraph, Spacer, Frame, PageTemplate, PageBreak, NextPageTemplate
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.graphics.shapes import Rect
from reportlab.lib.colors import tan

from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import cm

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily


class ReportesEnum():

    CONSUMO_CLIENTES_COMERCIALES = "Consumo_clientes_comerciales"

class TemplateBase(BaseDocTemplate):

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


class ConsumoClientesComerciales(TemplateBase):

    def __init__(self,response,nombre):
        TemplateBase.__init__(self, response, title = nombre, pagesize= letter)
        template = PageTemplate('normal', [Frame(2.5*cm, 2.5*cm, 15*cm, 25*cm, id='F1')])

        self.addPageTemplates(template)
        self.encabezado_tabla = []

    def agregar_encabezados(self, tipo_productos):
        self.encabezado_tabla = [tp.nombre for tp in tipo_productos]


    def agregar_fila(self, txt):
        self.contenido.append(Paragraph(txt,self.estilos["Normal"]))
