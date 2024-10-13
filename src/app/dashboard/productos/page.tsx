'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"

interface Producto {
  id: number
  nombre: string
  precio: number
  categoria: string
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchProductos()
  }, [])

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
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const agregarOActualizarProducto = async () => {
    try {
      const token = localStorage.getItem('token')
      const producto = { nombre, precio: parseFloat(precio), categoria }
      const url = editingId ? `/api/productos/${editingId}` : '/api/productos'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(producto)
      })

      if (response.ok) {
        fetchProductos()
        limpiarFormulario()
        setIsDialogOpen(false)
      } else {
        console.error('Error adding/updating producto')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const eliminarProducto = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchProductos()
      } else {
        console.error('Error deleting producto')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const editarProducto = (producto: Producto) => {
    setEditingId(producto.id)
    setNombre(producto.nombre)
    setPrecio(producto.precio.toString())
    setCategoria(producto.categoria)
    setIsDialogOpen(true)
  }

  const limpiarFormulario = () => {
    setEditingId(null)
    setNombre('')
    setPrecio('')
    setCategoria('')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestión de Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">Agregar Producto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precio" className="text-right">
                  Precio
                </Label>
                <Input
                  id="precio"
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria" className="text-right">
                  Categoría
                </Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronica">Electrónica</SelectItem>
                    <SelectItem value="ropa">Ropa</SelectItem>
                    <SelectItem value="hogar">Hogar</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={agregarOActualizarProducto}>
                {editingId ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>${producto.precio.toFixed(2)}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => editarProducto(producto)}>
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
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el producto.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => eliminarProducto(producto.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}