import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  UserCheck,
  UserX,
  ClipboardList,
  Plus,
} from 'lucide-react';
import { HubLayout } from '@/components/hub/HubLayout';
import { useHubAuth } from '@/contexts/HubAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Employee,
  Attendance,
  mockEmployees,
  mockAttendance,
  getStoredData,
  setStoredData,
  initializeMockData,
  generateId,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueTime: string;
  createdAt: string;
  hubId: string;
}

export default function HubStaff() {
  const { hub, hubUser } = useHubAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  // Task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueTime: '',
  });

  useEffect(() => {
    initializeMockData();
    loadData();
  }, [hub]);

  const loadData = () => {
    const storedEmployees = getStoredData<Employee[]>('bakery_employees', mockEmployees);
    // Filter employees by hub location
    const hubEmployees = storedEmployees.filter(e => 
      e.location.toLowerCase().includes(hub?.name.split(' - ')[1]?.toLowerCase() || '') ||
      e.locationType === hub?.type
    );
    setEmployees(hubEmployees.length > 0 ? hubEmployees : storedEmployees.slice(0, 8));

    const storedAttendance = getStoredData<Attendance[]>('bakery_attendance', mockAttendance);
    // Filter today's attendance
    const today = new Date().toISOString().split('T')[0];
    setAttendance(storedAttendance.filter(a => a.date === today));

    const storedTasks = getStoredData<Task[]>('hub_tasks', []);
    setTasks(storedTasks.filter(t => t.hubId === hub?.id));
  };

  if (!hub || !hubUser) return null;

  const handleMarkAttendance = (employeeId: string, status: 'present' | 'absent' | 'half-day') => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const newAttendance: Attendance = {
      id: generateId('att'),
      employeeId,
      employeeName: employee.fullName,
      date: today,
      checkIn: status !== 'absent' ? now : null,
      checkOut: null,
      status,
    };

    const allAttendance = getStoredData<Attendance[]>('bakery_attendance', mockAttendance);
    // Remove existing attendance for this employee today
    const filtered = allAttendance.filter(a => 
      !(a.employeeId === employeeId && a.date === today)
    );
    setStoredData('bakery_attendance', [...filtered, newAttendance]);
    setAttendance(prev => {
      const updated = prev.filter(a => a.employeeId !== employeeId);
      return [...updated, newAttendance];
    });

    toast({
      title: 'Attendance Marked',
      description: `${employee.fullName} marked as ${status}`,
    });
  };

  const handleCheckOut = (employeeId: string) => {
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];

    const allAttendance = getStoredData<Attendance[]>('bakery_attendance', mockAttendance);
    const updated = allAttendance.map(a => 
      a.employeeId === employeeId && a.date === today 
        ? { ...a, checkOut: now }
        : a
    );
    setStoredData('bakery_attendance', updated);
    setAttendance(prev => prev.map(a => 
      a.employeeId === employeeId ? { ...a, checkOut: now } : a
    ));

    const employee = employees.find(e => e.id === employeeId);
    toast({
      title: 'Checked Out',
      description: `${employee?.fullName} checked out at ${now}`,
    });
  };

  const handleCreateTask = () => {
    const employee = employees.find(e => e.id === newTask.assignedTo);
    if (!employee) return;

    const task: Task = {
      id: generateId('task'),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      assignedToName: employee.fullName,
      status: 'pending',
      priority: newTask.priority,
      dueTime: newTask.dueTime,
      createdAt: new Date().toISOString(),
      hubId: hub.id,
    };

    const allTasks = getStoredData<Task[]>('hub_tasks', []);
    setStoredData('hub_tasks', [...allTasks, task]);
    setTasks([...tasks, task]);

    toast({
      title: 'Task Created',
      description: `Task assigned to ${employee.fullName}`,
    });

    setTaskDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueTime: '',
    });
  };

  const handleUpdateTaskStatus = (taskId: string, status: Task['status']) => {
    const allTasks = getStoredData<Task[]>('hub_tasks', []);
    const updated = allTasks.map(t => t.id === taskId ? { ...t, status } : t);
    setStoredData('hub_tasks', updated);
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));

    toast({
      title: 'Task Updated',
      description: `Task marked as ${status}`,
    });
  };

  const getAttendanceForEmployee = (employeeId: string) => 
    attendance.find(a => a.employeeId === employeeId);

  const filteredEmployees = employees.filter(e =>
    e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: employees.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: employees.length - attendance.filter(a => a.status === 'present' || a.status === 'half-day').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
  };

  return (
    <HubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground">Manage attendance and assign tasks</p>
          </div>
          <Button onClick={() => setTaskDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Assign Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <UserCheck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{stats.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <UserX className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <ClipboardList className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.pendingTasks}</p>
                  <p className="text-xs text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Clock className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-info">{stats.inProgressTasks}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-4 space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Staff Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee, index) => {
                const att = getAttendanceForEmployee(employee.id);
                return (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      'transition-all',
                      att?.status === 'present' && 'border-accent/30 bg-accent/5',
                      att?.status === 'absent' && 'border-destructive/30 bg-destructive/5'
                    )}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={employee.profilePhoto} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {employee.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{employee.fullName}</p>
                            <p className="text-sm text-muted-foreground">{employee.designation}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {employee.employeeId}
                            </Badge>
                          </div>
                        </div>

                        {att ? (
                          <div className="mt-4 p-3 rounded-lg bg-secondary/50">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={cn(
                                att.status === 'present' ? 'bg-accent' :
                                att.status === 'half-day' ? 'bg-warning text-foreground' :
                                'bg-destructive'
                              )}>
                                {att.status}
                              </Badge>
                              {att.checkOut && (
                                <span className="text-xs text-muted-foreground">
                                  Out: {att.checkOut}
                                </span>
                              )}
                            </div>
                            {att.checkIn && (
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-3 h-3" />
                                <span>Check-in: {att.checkIn}</span>
                              </div>
                            )}
                            {att.status !== 'absent' && !att.checkOut && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => handleCheckOut(employee.id)}
                              >
                                Check Out
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleMarkAttendance(employee.id, 'present')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAttendance(employee.id, 'half-day')}
                            >
                              Half
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleMarkAttendance(employee.id, 'absent')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4 space-y-4">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No tasks assigned</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setTaskDialogOpen(true)}
                  >
                    Create First Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      'transition-all',
                      task.status === 'in-progress' && 'border-info/30 bg-info/5',
                      task.status === 'completed' && 'border-accent/30 bg-accent/5'
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          <Badge className={cn(
                            task.priority === 'high' ? 'bg-destructive' :
                            task.priority === 'medium' ? 'bg-warning text-foreground' :
                            'bg-muted text-muted-foreground'
                          )}>
                            {task.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {task.assignedToName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignedToName}</span>
                        </div>

                        {task.dueTime && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            Due: {task.dueTime}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {task.status === 'pending' && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                            >
                              Start
                            </Button>
                          )}
                          {task.status === 'in-progress' && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                          {task.status === 'completed' && (
                            <Badge className="bg-accent w-full justify-center py-1.5">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Task</DialogTitle>
            <DialogDescription>
              Create and assign a task to a staff member
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Task Title</Label>
              <Input
                placeholder="e.g., Clean production area"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Task details..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assign To</Label>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(v) => setNewTask({ ...newTask, assignedTo: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(v) => setNewTask({ ...newTask, priority: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Due Time (Optional)</Label>
              <Input
                type="time"
                value={newTask.dueTime}
                onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              disabled={!newTask.title || !newTask.assignedTo}
            >
              Assign Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
