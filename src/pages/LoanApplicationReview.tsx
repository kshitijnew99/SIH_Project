import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  AlertTriangle,
  IndianRupee,
  Clock
} from 'lucide-react';

interface LoanApplication {
  _id: string;
  applicationNumber: string;
  farmerId: any;
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  loanAmount: number;
  loanPurpose: string;
  loanPurposeDetails: string;
  loanTenure: number;
  requestedInterestRate: number;
  creditScore: {
    score: number;
    rating: string;
    breakdown: any;
  };
  riskAssessment: {
    riskLevel: string;
    riskFactors: any[];
  };
  collateral: any[];
  totalCollateralValue: number;
  loanToValueRatio: number;
  status: string;
  submittedAt: string;
  documents: any[];
}

export default function LoanApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'rejected'>('approved');
  const [reviewForm, setReviewForm] = useState({
    reviewNotes: '',
    approvedAmount: 0,
    approvedTenure: 0,
    offeredInterestRate: 0,
    rejectionReason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem('lenderToken');
      const res = await fetch(`http://localhost:5000/api/loan-applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setApplication(data.data);
        setReviewForm({
          reviewNotes: '',
          approvedAmount: data.data.loanAmount,
          approvedTenure: data.data.loanTenure,
          offeredInterestRate: data.data.requestedInterestRate || 12,
          rejectionReason: ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching application:', error);
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!application) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('lenderToken');
      const res = await fetch(`http://localhost:5000/api/loan-applications/${application._id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          decision: reviewDecision,
          ...reviewForm
        })
      });

      const data = await res.json();
      
      if (data.success) {
        alert(`Application ${reviewDecision} successfully!`);
        navigate('/lender/applications');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
    setSubmitting(false);
    setShowReviewDialog(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600 bg-green-100';
    if (score >= 600) return 'text-blue-600 bg-blue-100';
    if (score >= 500) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      'Very Low': 'text-green-600 bg-green-100',
      'Low': 'text-blue-600 bg-blue-100',
      'Medium': 'text-yellow-600 bg-yellow-100',
      'High': 'text-orange-600 bg-orange-100',
      'Very High': 'text-red-600 bg-red-100'
    };
    return colors[level] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Application not found</p>
          <Button className="mt-4" onClick={() => navigate('/lender/applications')}>
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/lender/applications')}
              className="mb-2"
            >
              ← Back to Applications
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Application #{application.applicationNumber}
            </h1>
            <p className="text-gray-600 mt-1">Review and process loan application</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => {
                setReviewDecision('rejected');
                setShowReviewDialog(true);
              }}
              disabled={!['submitted', 'under_review'].includes(application.status)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setReviewDecision('approved');
                setShowReviewDialog(true);
              }}
              disabled={!['submitted', 'under_review'].includes(application.status)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farmer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Farmer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{application.farmerName}</h3>
                    <p className="text-gray-600">{application.farmerId?.state}, {application.farmerId?.district}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{application.farmerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{application.farmerPhone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-600">Loan Amount</Label>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(application.loanAmount)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tenure</Label>
                    <p className="text-2xl font-bold text-gray-900">{application.loanTenure} months</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Purpose</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {application.loanPurpose.replace(/_/g, ' ').toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Requested Rate</Label>
                    <p className="text-lg font-semibold text-gray-900">{application.requestedInterestRate}% p.a.</p>
                  </div>
                </div>
                {application.loanPurposeDetails && (
                  <div className="mt-4">
                    <Label className="text-gray-600">Purpose Details</Label>
                    <p className="text-gray-700 mt-1">{application.loanPurposeDetails}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credit Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Credit Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.creditScore.breakdown && Object.entries(application.creditScore.breakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{value as number}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(((value as number) / 200) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            {application.riskAssessment.riskFactors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {application.riskAssessment.riskFactors.map((risk: any, index: number) => (
                      <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">{risk.type}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            risk.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{risk.description}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collateral */}
            {application.collateral.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Collateral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.collateral.map((item: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.type.toUpperCase()}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(item.estimatedValue)}</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded mt-1 inline-block ${
                              item.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.verificationStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Total Collateral Value</span>
                        <span className="text-xl font-bold text-gray-900">{formatCurrency(application.totalCollateralValue)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Loan-to-Value Ratio</span>
                        <span className="text-sm font-semibold text-gray-900">{application.loanToValueRatio}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Credit Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Credit Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getCreditScoreColor(application.creditScore.score)}`}>
                    <div>
                      <div className="text-4xl font-bold">{application.creditScore.score}</div>
                      <div className="text-sm font-medium">{application.creditScore.rating}</div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(application.riskAssessment.riskLevel)}`}>
                        {application.riskAssessment.riskLevel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">LTV Ratio</span>
                      <span className="text-sm font-semibold text-gray-900">{application.loanToValueRatio}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Submitted</p>
                      <p className="text-xs text-gray-600">
                        {new Date(application.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Status</p>
                      <p className="text-xs text-gray-600">{application.status.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            {application.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {application.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{doc.documentType.replace(/_/g, ' ')}</span>
                        </div>
                        <Button size="sm" variant="ghost">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewDecision === 'approved' ? 'Approve' : 'Reject'} Loan Application
            </DialogTitle>
            <DialogDescription>
              Application #{application.applicationNumber} - {application.farmerName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {reviewDecision === 'approved' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="approvedAmount">Approved Amount (₹)</Label>
                    <Input
                      id="approvedAmount"
                      type="number"
                      value={reviewForm.approvedAmount}
                      onChange={(e) => setReviewForm({...reviewForm, approvedAmount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="approvedTenure">Approved Tenure (months)</Label>
                    <Input
                      id="approvedTenure"
                      type="number"
                      value={reviewForm.approvedTenure}
                      onChange={(e) => setReviewForm({...reviewForm, approvedTenure: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="offeredInterestRate">Offered Interest Rate (% p.a.)</Label>
                  <Input
                    id="offeredInterestRate"
                    type="number"
                    step="0.1"
                    value={reviewForm.offeredInterestRate}
                    onChange={(e) => setReviewForm({...reviewForm, offeredInterestRate: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <Textarea
                    id="reviewNotes"
                    placeholder="Add any conditions or notes..."
                    value={reviewForm.reviewNotes}
                    onChange={(e) => setReviewForm({...reviewForm, reviewNotes: e.target.value})}
                    rows={4}
                  />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Please provide a reason for rejection..."
                  value={reviewForm.rejectionReason}
                  onChange={(e) => setReviewForm({...reviewForm, rejectionReason: e.target.value})}
                  rows={4}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={submitting || (reviewDecision === 'rejected' && !reviewForm.rejectionReason)}
              className={reviewDecision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {submitting ? 'Submitting...' : `Confirm ${reviewDecision === 'approved' ? 'Approval' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
