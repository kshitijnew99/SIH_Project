import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Handshake, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin,
  Calendar,
  ArrowLeft,
  Eye,
  Sprout,
  DollarSign,
  FileText,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const AgreementManagement = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/agreements', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setAgreements(data.agreements || []);
        console.log('Agreements fetched:', data.agreements?.length || 0);
      } else {
        console.error('Failed to fetch agreements:', data.message);
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveAgreement = async (agreementId) => {
    const approvalNotes = prompt('Add approval notes (optional):');
    
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/agreements/${agreementId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approvalNotes })
      });

      const data = await response.json();
      if (data.success) {
        alert('Agreement approved successfully!');
        fetchAgreements();
      } else {
        alert('Failed to approve agreement: ' + data.message);
      }
    } catch (error) {
      console.error('Error approving agreement:', error);
      alert('Error approving agreement');
    }
  };

  const rejectAgreement = async (agreementId) => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) return;
    
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/agreements/${agreementId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason })
      });

      const data = await response.json();
      if (data.success) {
        alert('Agreement rejected successfully!');
        fetchAgreements();
      } else {
        alert('Failed to reject agreement: ' + data.message);
      }
    } catch (error) {
      console.error('Error rejecting agreement:', error);
      alert('Error rejecting agreement');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, text: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
      approved: { variant: 'default', icon: CheckCircle, text: 'Approved', color: 'bg-green-100 text-green-800' },
      rejected: { variant: 'destructive', icon: XCircle, text: 'Rejected', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getAgreementTypeBadge = (type) => {
    const typeConfig = {
      'Crop Sharing': { color: 'bg-green-100 text-green-800' },
      'Fixed Rent': { color: 'bg-blue-100 text-blue-800' },
      'Revenue Sharing': { color: 'bg-purple-100 text-purple-800' },
      'Contract Farming': { color: 'bg-orange-100 text-orange-800' }
    };
    
    const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={config.color}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link to="/admin-dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Handshake className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Agreement Management</h1>
              </div>
            </div>
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">KisanConnect</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Farmer-Landowner Agreement Management</h2>
          <p className="text-muted-foreground mt-2">
            Review and approve agreements between farmers and landowners
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <Clock className="h-3 w-3 mr-1" />
              {agreements.filter(a => a.status === 'pending').length} Pending Approval
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              {agreements.filter(a => a.status === 'approved').length} Approved
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
              <XCircle className="h-3 w-3 mr-1" />
              {agreements.filter(a => a.status === 'rejected').length} Rejected
            </Badge>
          </div>
        </div>

        {/* Agreements List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading agreements...</p>
            </div>
          ) : agreements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Handshake className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No Agreements Found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  No farmer-landowner agreements have been created yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            agreements.map((agreement) => (
              <Card key={agreement.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <CardTitle className="text-lg">Agreement #{agreement.id}</CardTitle>
                        {getAgreementTypeBadge(agreement.agreementType)}
                        {getStatusBadge(agreement.status)}
                      </div>
                      <CardDescription>
                        Created: {new Date(agreement.createdAt).toLocaleDateString()} • 
                        Duration: {agreement.duration}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAgreement(selectedAgreement?.id === agreement.id ? null : agreement)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedAgreement?.id === agreement.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Parties Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Farmer</h4>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{agreement.farmerName || 'Unknown Farmer'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{agreement.farmerEmail || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Landowner</h4>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{agreement.landownerName || 'Unknown Landowner'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{agreement.landownerEmail || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Agreement Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/10 rounded-lg">
                    <div className="text-center">
                      <Sprout className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <p className="text-sm font-medium">{agreement.cropType}</p>
                      <p className="text-xs text-muted-foreground">Crop Type</p>
                    </div>
                    
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm font-medium">{agreement.duration}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    
                    <div className="text-center">
                      {agreement.sharePercentage ? (
                        <>
                          <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                          <p className="text-sm font-medium">{agreement.sharePercentage}% - 30%</p>
                          <p className="text-xs text-muted-foreground">Farmer - Landowner</p>
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-8 w-8 mx-auto text-green-600 mb-2" />
                          <p className="text-sm font-medium">₹{agreement.rentAmount?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Monthly Rent</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedAgreement?.id === agreement.id && (
                    <div className="mt-6 space-y-4">
                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                          Agreement Terms
                        </h4>
                        <p className="text-sm leading-relaxed">{agreement.terms}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Timeline</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Start: {new Date(agreement.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>End: {new Date(agreement.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Agreement Status</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Farmer Agreed: {new Date(agreement.farmerAgreedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              <span>Landowner Agreed: {new Date(agreement.landownerAgreedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {agreement.status === 'rejected' && agreement.rejectionReason && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <span className="font-medium text-red-800">Rejection Reason:</span>
                          <p className="text-red-700 mt-1">{agreement.rejectionReason}</p>
                        </div>
                      )}

                      {agreement.status === 'approved' && agreement.approvalNotes && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <span className="font-medium text-green-800">Approval Notes:</span>
                          <p className="text-green-700 mt-1">{agreement.approvalNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {agreement.status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <Button
                        onClick={() => approveAgreement(agreement.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Agreement
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => rejectAgreement(agreement.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Agreement
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementManagement;