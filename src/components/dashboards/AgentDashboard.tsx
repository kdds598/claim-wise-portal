import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  FileText, 
  DollarSign, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RootState, AppDispatch } from '../../store';
import { updateClaim } from '../../store/slices/appSlice';

const AgentDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { policies, claims, users } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter data for current agent
  const agentPolicies = policies.filter(p => p.agentId === user?.id);
  const agentClaims = claims.filter(c => c.agentId === user?.id);
  const agentCustomers = users.filter(u => 
    u.role === 'customer' && agentPolicies.some(p => p.customerId === u.id)
  );

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

  const handleClaimAction = (claimId: string, newStatus: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      dispatch(updateClaim({
        ...claim,
        status: newStatus as any,
        processedDate: new Date().toISOString().split('T')[0]
      }));
    }
  };

  const stats = {
    totalCustomers: agentCustomers.length,
    totalPolicies: agentPolicies.length,
    activePolicies: agentPolicies.filter(p => p.status === 'active').length,
    totalClaims: agentClaims.length,
    pendingClaims: agentClaims.filter(c => c.status === 'pending' || c.status === 'processing').length,
    totalPremiums: agentPolicies.reduce((sum, p) => sum + p.premium, 0),
  };

  const filteredPolicies = agentPolicies.filter(policy => {
    const matchesSearch = policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredClaims = agentClaims.filter(claim => {
    const matchesSearch = claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agent Dashboard</h1>
          <p className="text-muted-foreground">Manage customer policies and claims</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active relationships
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
            <CardTitle className="text-sm font-medium">Annual Premiums</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPremiums.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total managed portfolio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingClaims}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies, claims, or customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="policies" className="w-full">
        <TabsList>
          <TabsTrigger value="policies">Customer Policies</TabsTrigger>
          <TabsTrigger value="claims">Claims Management</TabsTrigger>
          <TabsTrigger value="customers">My Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="policies" className="space-y-4">
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
                        Customer: {policy.customerName}
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
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Policy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="claims" className="space-y-4">
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
                        Customer: {claim.customerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {claim.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Amount: ${claim.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {claim.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleClaimAction(claim.id, 'approved')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleClaimAction(claim.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {claim.status === 'processing' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleClaimAction(claim.id, 'settled')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Settle
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agentCustomers.map((customer) => {
              const customerPoliciesCount = agentPolicies.filter(p => p.customerId === customer.id).length;
              const customerClaimsCount = agentClaims.filter(c => c.customerId === customer.id).length;
              
              return (
                <Card key={customer.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{customerPoliciesCount} Policies</span>
                        <span>{customerClaimsCount} Claims</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          New Policy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDashboard;