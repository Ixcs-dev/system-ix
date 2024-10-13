'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DebtorInfo {
  nombrePersona: string
  deuda: number
}

interface IncomeData {
  fecha: string
  ingreso: number
}

export default function Dashboard() {
  const [totalDebt, setTotalDebt] = useState<number>(0)
  const [debtorCount, setDebtorCount] = useState<number>(0)
  const [debtors, setDebtors] = useState<DebtorInfo[]>([])
  const [incomeData, setIncomeData] = useState<IncomeData[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setTotalDebt(data.totalDebt || 0)  // Valor predeterminado
        setDebtorCount(data.debtorCount || 0)
        setDebtors(data.debtors || [])
        setIncomeData(data.incomeData || [])
      } else {
        console.error('Error fetching dashboard data')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(totalDebt || 0).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Personas con Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{debtorCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deudores</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Ver Detalles</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Lista de Deudores</DialogTitle>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Deuda</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debtors.map((debtor, index) => (
                      <TableRow key={index}>
                        <TableCell>{debtor.nombrePersona}</TableCell>
                        <TableCell>${(debtor.deuda || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ingreso" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
