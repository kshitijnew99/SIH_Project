import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ArrowLeft,
  Eye,
  Sprout
} from "lucide-react";
import { Link } from "react-router-dom";

const VerificationManagement = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/verifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setVerifications(data.verifications || []);
        console.log('Verifications fetched:', data.verifications?.length || 0);
      } else {
        console.error('Failed to fetch verifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveVerification = async (verificationId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/verifications/${verificationId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Verification approved successfully!');
        fetchVerifications();
      } else {
        alert('Failed to approve verification: ' + data.message);
      }
    } catch (error) {
      console.error('Error approving verification:', error);
      alert('Error approving verification');
    }
  };

  const rejectVerification = async (verificationId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/verifications/${verificationId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      if (data.success) {
        alert('Verification rejected successfully!');
        fetchVerifications();
      } else {
        alert('Failed to reject verification: ' + data.message);
      }
    } catch (error) {
      console.error('Error rejecting verification:', error);
      alert('Error rejecting verification');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, text: 'Pending Review' },
      approved: { variant: 'default', icon: CheckCircle, text: 'Approved' },
      rejected: { variant: 'destructive', icon: XCircle, text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      farmer: { color: 'bg-green-100 text-green-800', text: 'Farmer' },
      landowner: { color: 'bg-blue-100 text-blue-800', text: 'Landowner' },
      admin: { color: 'bg-purple-100 text-purple-800', text: 'Admin' }
    };
    
    const config = roleConfig[role] || roleConfig.farmer;
    
    return (
      <Badge className={config.color}>
        {config.text}
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
                <FileCheck className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Verification Management</h1>
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
          <h2 className="text-3xl font-bold text-foreground">User Verification Management</h2>
          <p className="text-muted-foreground mt-2">
            Review and manage user verification requests for farmers, landowners, and administrators
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <Clock className="h-3 w-3 mr-1" />
              {verifications.filter(v => v.status === 'pending').length} Pending Reviews
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              {verifications.filter(v => v.status === 'approved').length} Approved
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
              <XCircle className="h-3 w-3 mr-1" />
              {verifications.filter(v => v.status === 'rejected').length} Rejected
            </Badge>
          </div>
        </div>

        {/* Verifications List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading verifications...</p>
            </div>
          ) : verifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No Verification Requests</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  All user verifications have been processed.
                </p>
              </CardContent>
            </Card>
          ) : (
            verifications.map((verification) => (
              <Card key={verification.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <CardTitle className="text-lg">{verification.fullName || 'Unknown User'}</CardTitle>
                        {getRoleBadge(verification.role)}
                        {getStatusBadge(verification.status)}
                      </div>
                      <CardDescription>
                        Verification ID: #{verification.id} • Submitted: {new Date(verification.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVerification(selectedVerification?.id === verification.id ? null : verification)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedVerification?.id === verification.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{verification.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{verification.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{verification.district || verification.address || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedVerification?.id === verification.id && (
                    <div className="mt-6 p-4 bg-secondary/10 rounded-lg space-y-4">
                      <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                        Verification Details
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {verification.aadhaar && (
                          <div>
                            <span className="font-medium">Aadhaar Number:</span>
                            <p className="text-muted-foreground">{verification.aadhaar}</p>
                          </div>
                        )}
                        
                        {verification.employeeId && (
                          <div>
                            <span className="font-medium">Employee ID:</span>
                            <p className="text-muted-foreground">{verification.employeeId}</p>
                          </div>
                        )}
                        
                        {verification.department && (
                          <div>
                            <span className="font-medium">Department:</span>
                            <p className="text-muted-foreground">{verification.department}</p>
                          </div>
                        )}
                        
                        {verification.designation && (
                          <div>
                            <span className="font-medium">Designation:</span>
                            <p className="text-muted-foreground">{verification.designation}</p>
                          </div>
                        )}
                      </div>

                      {verification.status === 'rejected' && verification.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <span className="font-medium text-red-800">Rejection Reason:</span>
                          <p className="text-red-700 mt-1">{verification.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {verification.status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <Button
                        onClick={() => approveVerification(verification.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Verification
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => rejectVerification(verification.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Verification
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

export default VerificationManagement;