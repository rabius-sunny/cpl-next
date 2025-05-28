'use client'

import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function BookingsTable({ bookings }: { bookings: any }) {
  const handleDelete = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`/api/delete-booking?id=${bookingId}`, {
          method: 'DELETE'
        })
        const result = await response.json()

        if (result.success) {
          toast.success('Booking deleted successfully')
        } else {
          alert(result.error || 'Failed to delete Booking')
        }
      } catch (error) {
        console.error('Error deleting Booking:', error)
        alert('An error occurred while deleting the Booking')
      }
    }
  }

  const columns = [
    {
      header: 'Name',
      accessorKey: (row: any) => `${row.firstname || ''} ${row.lastname || ''}`.trim() || 'N/A'
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Phone',
      accessorKey: 'phone'
    },
    {
      header: 'Date',
      accessorKey: 'date'
    },
    {
      header: 'Time',
      accessorKey: 'time'
    },
    {
      header: 'Received',
      accessorKey: (row: any) => {
        const date = new Date(row.createdAt)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },
    {
      header: 'Actions',
      accessorKey: (row: any) => (
        <div className='flex space-x-2'>
          <Button
            variant='destructive'
            size='sm'
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row._id)
            }}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={bookings || []} columns={columns} searchable pagination pageSize={10} />
        </CardContent>
      </Card>
    </div>
  )
}
