def enum(**values):
    return type('Enum', (), values)

TipoProducto = enum(GARANTIA=3)
TipoTarjeta = enum(CREDITO=1, DEBITO=2, COMERCIAL=3)
EstadoTerminal = enum(ACTIVO=1, MANTENCION=2, RETIRADO=3)
TipoTrabajador = enum(CHOFER=1, FLETE=2)
