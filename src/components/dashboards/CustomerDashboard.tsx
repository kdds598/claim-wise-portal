import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  Upload,
  Search,
  Calendar,
  CreditCard,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RootState } from '../../store';

const CustomerDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { policies, claims, payments } = useSelector((state: RootState) => state.app);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data for current customer
  const customerPolicies = policies.filter(p => p.customerId === user?.id);
  const customerClaims = claims.filter(c => c.customerId === user?.id);
  const customerPayments = payments.filter(p => p.customerId === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
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

  const stats = {
    totalPolicies: customerPolicies.length,
    activePolicies: customerPolicies.filter(p => p.status === 'active').length,
    totalClaims: customerClaims.length,
    pendingClaims: customerClaims.filter(c => c.status === 'pending' || c.status === 'processing').length,
    totalCoverage: customerPolicies.reduce((sum, p) => sum + p.coverage, 0),
    monthlyPremium: customerPolicies.reduce((sum, p) => sum + p.premium / 12, 0),
  };

  const filteredPolicies = customerPolicies.filter(policy =>
    policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClaims = customerClaims.filter(claim =>
    claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your policies and claims</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCoverage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all policies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Premium</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyPremium.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Combined monthly payment
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
              {stats.totalClaims} total claims
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search policies and claims..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="policies" className="w-full">
        <TabsList>
          <TabsTrigger value="policies">My Policies</TabsTrigger>
          <TabsTrigger value="claims">My Claims</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
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
                        {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Insurance
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Coverage: ${policy.coverage.toLocaleString()} | Premium: ${policy.premium}/year
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Valid: {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Make Payment
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
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4">
            {customerPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">${payment.amount.toLocaleString()}</h3>
                        <Badge variant={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Method: {payment.method.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Receipt
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

export default CustomerDashboard;