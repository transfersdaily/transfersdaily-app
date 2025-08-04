"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MobileDataCard } from "@/components/admin/MobileDataCard"
import { MobileSearchFilter } from "@/components/admin/MobileSearchFilter"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Users, Plus, MoreHorizontal, Trash2, Edit, Eye, UserCheck, UserX } from "lucide-react"
import { useIsMobile, adminMobileClasses, formatForMobile } from "@/lib/mobile-utils"

interface User {
  id: string
  email: string
  role: 'admin' | 'editor'
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin?: string
}

export function UsersManagementMobile() {
  const isMobile = useIsMobile()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Simulate loading
  useState(() => {
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          email: 'admin@transfersdaily.com',
          role: 'admin',
          status: 'active',
          createdAt: '2025-01-01',
          lastLogin: '2025-01-15'
        },
        {
          id: '2',
          email: 'editor@transfersdaily.com',
          role: 'editor',
          status: 'active',
          createdAt: '2025-01-02',
          lastLogin: '2025-01-14'
        },
        {
          id: '3',
          email: 'inactive@transfersdaily.com',
          role: 'editor',
          status: 'inactive',
          createdAt: '2025-01-03'
        }
      ])
      setIsLoading(false)
    }, 1000)
  })
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    role: 'editor' as 'admin' | 'editor',
    password: ''
  })

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.password) return
    
    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setUsers([...users, user])
    setNewUser({ email: '', role: 'editor', password: '' })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId)
  }

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId)
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getUserActions = (user: User) => [
    {
      label: "View",
      onClick: () => handleViewUser(user.id),
      variant: "outline" as const,
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: "Edit",
      onClick: () => handleEditUser(user.id),
      variant: "outline" as const,
      icon: <Edit className="w-4 h-4" />
    },
    {
      label: user.status === 'active' ? 'Deactivate' : 'Activate',
      onClick: () => handleToggleStatus(user.id),
      variant: user.status === 'active' ? 'destructive' as const : 'default' as const,
      icon: user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />
    },
    ...(user.role !== 'admin' ? [{
      label: "Delete",
      onClick: () => handleDeleteUser(user.id),
      variant: "destructive" as const,
      icon: <Trash2 className="w-4 h-4" />
    }] : [])
  ]

  // Mobile User Cards
  const MobileUsersList = () => (
    <div className="space-y-3">
      {filteredUsers.map((user) => (
        <MobileDataCard
          key={user.id}
          title={user.email}
          subtitle={`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} • Created ${formatForMobile.formatMobileDate(user.createdAt)}`}
          metadata={[
            { label: "Role", value: <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge> },
            { label: "Status", value: <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>{user.status}</Badge> },
            { label: "Last Login", value: user.lastLogin ? formatForMobile.formatMobileDate(user.lastLogin) : 'Never' },
          ]}
          actions={getUserActions(user)}
          badge={{
            text: user.status,
            variant: user.status === 'active' ? 'default' : 'destructive'
          }}
        />
      ))}
    </div>
  )

  // Desktop Table View
  const DesktopUsersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
          ))
        ) : (
          filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>{user.lastLogin || 'Never'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                      {user.status === 'active' ? (
                        <><UserX className="h-4 w-4 mr-2" />Deactivate</>
                      ) : (
                        <><UserCheck className="h-4 w-4 mr-2" />Activate</>
                      )}
                    </DropdownMenuItem>
                    {user.role !== 'admin' && (
                      <DropdownMenuItem 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  const filters = [
    {
      key: 'role',
      label: 'Role',
      value: roleFilter,
      options: [
        { value: 'all', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' }
      ],
      onChange: setRoleFilter
    },
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      onChange: setStatusFilter
    }
  ]

  const handleResetFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setStatusFilter("all")
  }

  return (
    <AdminPageLayout
      title="User Management"
      subtitle={`Manage admin and editor accounts (${filteredUsers.length} of ${users.length} users)`}
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="min-h-[44px]">
              <Plus className="h-4 w-4 mr-2" />
              {isMobile ? "Add User" : "Add User"}
            </Button>
          </DialogTrigger>
          <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw]" : ""}>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new admin or editor to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="user@transfersdaily.com"
                  className="min-h-[44px]"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: 'admin' | 'editor') => setNewUser({...newUser, role: value})}>
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Enter temporary password"
                  className="min-h-[44px]"
                />
              </div>
            </div>
            <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className={isMobile ? "w-full min-h-[44px]" : ""}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} className={isMobile ? "w-full min-h-[44px]" : ""}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <MobileSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onResetFilters={handleResetFilters}
        />

        {/* Users Display */}
        <Card>
          <CardHeader className={isMobile ? "pb-4" : ""}>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
            <CardDescription>
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: isMobile ? 3 : 5 }).map((_, i) => (
                  <div key={i} className={isMobile ? "p-4 border rounded-lg" : ""}>
                    <div className={`flex items-center gap-3 ${isMobile ? 'flex-col items-start space-y-2' : ''}`}>
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Mobile: Card-based layout */}
                <div className={adminMobileClasses.mobileOnly}>
                  <MobileUsersList />
                </div>
                
                {/* Desktop: Traditional table */}
                <div className={adminMobileClasses.desktopOnly}>
                  <DesktopUsersTable />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
