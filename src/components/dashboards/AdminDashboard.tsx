import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  FileText, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RootState, AppDispatch } from '../../store';
import { updateUser, updatePolicy, updateClaim } from '../../store/slices/appSlice';

const AdminDashboard = () => {
  const { policies, claims, payments, users } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
      case 'settled':
        return 'default';
      case 'pending':
      case 'processing':
        return 'secondary';
      case 'expired':
      case 'rejected':
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Calculate comprehensive statistics
  const stats = {
    totalUsers: users.length,
    totalCustomers: users.filter(u => u.role === 'customer').length,
    totalAgents: users.filter(u => u.role === 'agent').length,
    totalPolicies: policies.length,
    activePolicies: policies.filter(p => p.status === 'active').length,
    totalClaims: claims.length,
    pendingClaims: claims.filter(c => c.status === 'pending' || c.status === 'processing').length,
    approvedClaims: claims.filter(c => c.status === 'approved' || c.status === 'settled').length,
    rejectedClaims: claims.filter(c => c.status === 'rejected').length,
    totalPremiums: policies.reduce((sum, p) => sum + p.premium, 0),
    totalCoverage: policies.reduce((sum, p) => sum + p.coverage, 0),
    totalClaimAmount: claims.reduce((sum, c) => sum + c.amount, 0),
    totalPayments: payments.reduce((sum, p) => sum + p.amount, 0),
  };

  // Policy distribution by type
  const policyTypes = policies.reduce((acc, policy) => {
    acc[policy.type] = (acc[policy.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || user.role === filterType;
    return matchesSearch && matchesType;
  });

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || policy.type === filterType || policy.status === filterType;
    return matchesSearch && matchesType;
  });

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || claim.status === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administrator Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCustomers} customers, {stats.totalAgents} agents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePolicies}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPolicies} total policies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Premiums</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalPremiums / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Annual premium income
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingClaims}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedClaims} approved, {stats.rejectedClaims} rejected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Business Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Policy Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(policyTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(count / stats.totalPolicies) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Coverage</span>
                <span className="font-medium">${(stats.totalCoverage / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Claim Amount</span>
                <span className="font-medium">${(stats.totalClaimAmount / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Loss Ratio</span>
                <span className="font-medium">
                  {((stats.totalClaimAmount / stats.totalPremiums) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Policy Approval Rate</span>
                <span className="font-medium text-success">
                  {((stats.activePolicies / stats.totalPolicies) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Claim Approval Rate</span>
                <span className="font-medium text-success">
                  {((stats.approvedClaims / stats.totalClaims) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pending Claims</span>
                <span className="font-medium text-warning">{stats.pendingClaims}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users, policies, or claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="agent">Agents</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="policies">Policy Management</TabsTrigger>
          <TabsTrigger value="claims">Claims Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">System Users</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge variant={user.role === 'administrator' ? 'destructive' : 'default'}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {new Date(user.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="policies" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Policy Overview</h3>
          </div>
          <div className="grid gap-4">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{policy.policyNumber}</h3>
                        <Badge variant={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Customer: {policy.customerName} | Agent: {policy.agentName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Insurance
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Coverage: ${policy.coverage.toLocaleString()} | Premium: ${policy.premium}/year
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="claims" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Claims Overview</h3>
          </div>
          <div className="grid gap-4">
            {filteredClaims.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{claim.claimNumber}</h3>
                        <Badge variant={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Customer: {claim.customerName} | Agent: {claim.agentName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {claim.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Amount: ${claim.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(claim.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;