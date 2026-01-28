'use client';

import { useState } from 'react';
import { Search, User, Phone, Mail, MoreHorizontal, Filter } from 'lucide-react';
import { AddCustomerDialog } from './add-customer-dialog'; // Import your dialog
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  createdAt: Date;
}

export function CustomersTable({ data }: { data: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Client-side filtering
  const filteredData = data.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
                Manage your client database and history.
            </p>
        </div>
        <AddCustomerDialog />
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/40 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>
                        You have {data.length} total customers.
                    </CardDescription>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name, phone..."
                        className="pl-8 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-[400px] text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-medium text-lg">No customers found</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                {searchTerm 
                                    ? "No results matching your search terms." 
                                    : "Get started by adding your first customer to the database."}
                            </p>
                        </div>
                        {!searchTerm && <AddCustomerDialog />}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((c) => (
                  <TableRow key={c.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{c.phone}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        {c.email ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="text-sm">{c.email}</span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground/50 text-sm">-</span>
                        )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(c.createdAt)}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(c.phone)}>
                                    Copy phone
                                </DropdownMenuItem>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}