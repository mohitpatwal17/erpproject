export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DepartmentPage() {
  const departments = await prisma.department.findMany({
    include: {
      _count: {
        select: {
          faculty: true,
          courses: true
        }
      }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h2 className="text-3xl font-black tracking-tighter">Academic Departments</h2>
                <p className="text-muted-foreground">Manage and view organizational departments, faculties, and associated courses.</p>
            </div>
            
            <Button size="lg" className="shadow-lg shadow-primary/20" disabled>
                <Plus className="mr-2 h-5 w-5" /> Add Department (Coming Soon)
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.length === 0 ? (
             <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-card/30">
               <Building2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
               <p className="text-muted-foreground font-medium">No departments found in the system yet.</p>
             </div>
          ) : (
            departments.map((dept) => (
              <Card key={dept.id} className="border-none shadow-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardHeader className="pb-3 border-b border-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                       <div className="p-2 bg-primary/10 rounded-md">
                          <Building2 className="h-4 w-4 text-primary" />
                       </div>
                       {dept.name}
                    </CardTitle>
                    <div className="px-2 py-1 bg-muted rounded text-xs font-mono font-bold text-muted-foreground">
                        {dept.code}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium flex items-center gap-2">
                         <GripVertical className="h-4 w-4 text-muted/50" />
                         Faculty Members
                      </span>
                      <span className="font-bold">{dept._count.faculty}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium flex items-center gap-2">
                         <GripVertical className="h-4 w-4 text-muted/50" />
                         Active Courses
                      </span>
                      <span className="font-bold">{dept._count.courses}</span>
                   </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
    </div>
  );
}
