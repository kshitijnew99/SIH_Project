import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  disbursed: number;
  totalDisbursedAmount: number;
  averageCreditScore: number;
  approvalRate: number;
  averageProcessingTime: number;
}

interface RecentApplication {
  _id: string;
  applicationNumber: string;
  farmerName: string;
  loanAmount: number;
  creditScore: { score: number; rating: string };
  status: string;
  submittedAt: string;
}

export default function LenderDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0,
    totalDisbursedAmount: 0,
    averageCreditScore: 0,
    approvalRate: 0,
    averageProcessingTime: 0
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [lenderProfile, setLenderProfile] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('lenderToken');
      
      // Fetch lender profile
      const profileRes = await fetch('http://localhost:5000/api/lender-auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      if (profileData.success) {
        setLenderProfile(profileData.data);
      }

      // Fetch portfolio stats
      const portfolioRes = await fetch('http://localhost:5000/api/loan-applications/lender/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const portfolioData = await portfolioRes.json();
      
      if (portfolioData.success) {
        setStats({
          totalApplications: portfolioData.stats.totalApplications,
          pendingReview: portfolioData.data.filter((app: any) => 
            ['submitted', 'under_review'].includes(app.status)
          ).length,
          approved: portfolioData.stats.approved,
          rejected: portfolioData.stats.rejected,
          disbursed: portfolioData.stats.disbursed,
          totalDisbursedAmount: portfolioData.stats.totalDisbursedAmount,
          averageCreditScore: Math.round(portfolioData.stats.averageCreditScore),
          approvalRate: portfolioData.stats.approved / (portfolioData.stats.approved + portfolioData.stats.rejected) * 100 || 0,
          averageProcessingTime: 3 // Placeholder
        });
        
        // Get recent applications
        setRecentApplications(portfolioData.data.slice(0, 5));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-blue-600';
    if (score >= 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lender Dashboard</h1>
          {lenderProfile && (
            <p className="text-gray-600 mt-1">
              {lenderProfile.organizationName} • {lenderProfile.lenderType}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.pendingReview} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Approval Rate
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvalRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.approved} approved, {stats.rejected} rejected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Disbursed
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalDisbursedAmount)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.disbursed} loans disbursed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Credit Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getCreditScoreColor(stats.averageCreditScore)}`}>
                {stats.averageCreditScore}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Portfolio average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => navigate('/lender/applications/pending')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Clock className="mr-2 h-4 w-4" />
            Review Applications ({stats.pendingReview})
          </Button>
          <Button
            onClick={() => navigate('/lender/portfolio')}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            View Portfolio
          </Button>
          <Button
            onClick={() => navigate('/lender/analytics')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <PieChartIcon className="mr-2 h-4 w-4" />
            Risk Analytics
          </Button>
          <Button
            onClick={() => navigate('/lender/profile')}
            variant="outline"
            className="w-full"
          >
            <Users className="mr-2 h-4 w-4" />
            My Profile
          </Button>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No applications yet</p>
                <p className="text-sm mt-2">Applications will appear here once farmers apply</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/lender/applications/${application._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">
                            {application.farmerName}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Application #{application.applicationNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(application.loanAmount)}
                        </p>
                        <p className={`text-sm font-medium ${getCreditScoreColor(application.creditScore.score)}`}>
                          Credit Score: {application.creditScore.score}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <span>Rating: {application.creditScore.rating}</span>
                      <span>•</span>
                      <span>
                        Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/lender/applications')}
                >
                  View All Applications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Alert */}
        {lenderProfile && !lenderProfile.isVerified && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Account Verification Pending
                  </h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Your account is currently under review. Complete your verification to access all features.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => navigate('/lender/verification')}
                  >
                    Complete Verification
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
