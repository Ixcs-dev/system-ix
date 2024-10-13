'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { useToast } from "../../components/ui/use-toast"

interface Abono {
  id: number
  cantidad: number
  metodoPago: string
  fecha: string
}

interface Producto {
  id: number
  nombre: string
  precio: number
}

interface Registro {
  id: number
  nombrePersona: string
  producto: Producto
  cantidadTotal: number
  fechaUltimoAbono: string
  abonos: Abono[]
}

export default function RegistroProductosApartados() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [nombrePersona, setNombrePersona] = useState('')
  const [productoId, setProductoId] = useState('')
  const [cantidadAbonada, setCantidadAbonada] = useState('')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRegistros()
    fetchProductos()
  }, [searchTerm])

  const fetchRegistros = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/registros?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Registros fetched:', data)
        setRegistros(data)
      } else {
        console.error('Error fetching registros')
        toast({
          title: "Error",
          description: "No se pudieron cargar los registros",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los registros",
        variant: "destructive",
      })
    }
  }

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/productos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      } else {
        console.error('Error fetching productos')
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los productos",
        variant: "destructive",
      })
    }
  }

  const agregarOActualizarRegistro = async () => {
    try {
      const token = localStorage.getItem('token')
      const producto = productos.find(p => p.id.toString() === productoId)
      if (!producto) {
        toast({
          title: "Error",
          description: "Por favor, seleccione un producto válido",
          variant: "destructive",
        })
        return
      }

      const registro = {
        nombrePersona,
        productoId: parseInt(productoId),
        cantidadAbonada: parseFloat(cantidadAbonada),
        metodoPago,
      }

      const url = editingId ? `/api/registros/${editingId}` : '/api/registros'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(registro),
      })

      if (response.ok) {
        fetchRegistros()
        limpiarFormulario()
        setIsDialogOpen(false)
        toast({
          title: "Éxito",
          description: editingId ? "Registro actualizado correctamente" : "Registro agregado correctamente",
        })
      } else {
        const errorData = await response.json()
        console.error('Error adding/updating registro:', errorData)
        toast({
          title: "Error",
          description: errorData.message || "No se pudo procesar el registro",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el registro",
        variant: "destructive",
      })
    }
  }

  const eliminarRegistro = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/registros/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchRegistros()
        toast({
          title: "Éxito",
          description: "Registro eliminado correctamente",
        })
      } else {
        const errorData = await response.json()
        console.error('Error deleting registro:', errorData)
        toast({
          title: "Error",
          description: errorData.message || "No se pudo eliminar el registro",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el registro",
        variant: "destructive",
      })
    }
  }

  const editarRegistro = (registro: Registro) => {
    setEditingId(registro.id)
    setNombrePersona(registro.nombrePersona)
    setProductoId(registro.producto?.id.toString() ?? '')
    setCantidadAbonada('')
    setMetodoPago('efectivo')
    setIsDialogOpen(true)
  }

  const limpiarFormulario = () => {
    setEditingId(null)
    setNombrePersona('')
    setProductoId('')
    setCantidadAbonada('')
    setMetodoPago('efectivo')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registro de Productos Apartados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                limpiarFormulario()
                setIsDialogOpen(true)
              }}>
                Agregar Registro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Editar Registro' : 'Agregar Registro'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombrePersona" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombrePersona"
                    value={nombrePersona}
                    onChange={(e) => setNombrePersona(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="producto" className="text-right">
                    Producto
                  </Label>
                  <Select value={productoId} onValueChange={setProductoId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id.toString()}>
                          {producto.nombre} - ${producto.precio.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cantidadAbonada" className="text-right">
                    Cantidad Abonada
                  </Label>
                  <Input
                    id="cantidadAbonada"
                    type="number"
                    value={cantidadAbonada}
                    onChange={(e) => setCantidadAbonada(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="metodoPago" className="text-right">
                    Método de Pago
                  </Label>
                  <Select value={metodoPago} onValueChange={setMetodoPago}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione el método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={agregarOActualizarRegistro}>
                  {editingId ? 'Actualizar' : 'Agregar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            <Label htmlFor="search">Buscar persona</Label>
            <Input
              id="search"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Total Abonado</TableHead>
                <TableHead>Deuda</TableHead>
                <TableHead>Último Abono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell>{registro.nombrePersona}</TableCell>
                  <TableCell>{registro.producto?.nombre ?? 'N/A'}</TableCell>
                  <TableCell>${registro.producto?.precio?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell>${registro.cantidadTotal?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell className="text-red-500">
                    ${((registro.producto?.precio ?? 0) - (registro.cantidadTotal ?? 0)).toFixed(2)}
                  </TableCell>
                  <TableCell>{registro.fechaUltimoAbono ? new Date(registro.fechaUltimoAbono).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => editarRegistro(registro)}>
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Eliminar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el registro y todos sus abonos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => eliminarRegistro(registro.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Ver Historial</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Historial de Abonos</DialogTitle>
                          </DialogHeader>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Método de Pago</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {registro.abonos && registro.abonos.length > 0 ? (
                                registro.abonos.map((abono) => (
                                  <TableRow key={abono.id}>
                                    <TableCell>{new Date(abono.fecha).toLocaleDateString()}</TableCell>
                                    <TableCell>${abono.cantidad.toFixed(2)}</TableCell>
                                    <TableCell>{abono.metodoPago}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center">No hay abonos registrados</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}