"use client"

import { UsersManagement } from "@/components/admin/UsersManagement"

export default function UsersPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage admin and editor accounts for the system
            </p>
          </div>
        </div>
        
        <UsersManagement />
      </div>
    </div>
  )
}