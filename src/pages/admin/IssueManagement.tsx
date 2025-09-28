import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  MessageSquare, 
  Users,
  CheckCircle,
  Clock,
  X,
  ArrowLeft,
  Sprout,
  Search,
  Filter,
  Eye,
  Mail,
  User,
  Calendar,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";

const IssueManagement = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/issues', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setIssues(data.issues || []);
        console.log('Issues fetched:', data.issues?.length || 0);
      } else {
        console.error('Failed to fetch issues:', data.message);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId, newStatus, responseMessage = '') => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          adminResponse: responseMessage,
          resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : null
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Issue ${newStatus} successfully`);
        fetchIssues();
        setShowDetails(false);
        setResponse('');
      } else {
        alert('Failed to update issue: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating issue:', error);
      alert('Error updating issue');
    }
  };

  const getCategoryIcon = (category) => {
    const categoryConfig = {
      'land-registration': { icon: CheckCircle, color: 'text-green-600' },
      'farmer-rights': { icon: Users, color: 'text-blue-600' },
      'government-schemes': { icon: MessageSquare, color: 'text-purple-600' },
      'technical-support': { icon: AlertTriangle, color: 'text-red-600' },
      'billing-payment': { icon: MessageSquare, color: 'text-orange-600' },
      'account-issues': { icon: Users, color: 'text-yellow-600' },
      'platform-feedback': { icon: MessageSquare, color: 'text-indigo-600' },
      'general-inquiry': { icon: MessageSquare, color: 'text-gray-600' },
      'financial': { icon: MessageSquare, color: 'text-green-600' },
      'legal': { icon: AlertTriangle, color: 'text-red-600' },
      'technical': { icon: AlertTriangle, color: 'text-red-600' },
      other: { icon: MessageSquare, color: 'text-gray-600' }
    };
    
    const config = categoryConfig[category] || categoryConfig.other;
    const IconComponent = config.icon;
    
    return <IconComponent className={`h-4 w-4 ${config.color}`} />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-blue-100 text-blue-800', text: 'Open' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
      resolved: { color: 'bg-green-100 text-green-800', text: 'Resolved' },
      closed: { color: 'bg-gray-100 text-gray-800', text: 'Closed' }
    };
    
    const config = statusConfig[status] || statusConfig.open;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800', text: 'Low' },
      medium: { color: 'bg-blue-100 text-blue-800', text: 'Medium' },
      high: { color: 'bg-orange-100 text-orange-800', text: 'High' },
      urgent: { color: 'bg-red-100 text-red-800', text: 'Urgent' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'land-registration': { color: 'bg-green-100 text-green-800', text: '🏡 Land Registration' },
      'farmer-rights': { color: 'bg-blue-100 text-blue-800', text: '⚖️ Farmer Rights' },
      'government-schemes': { color: 'bg-purple-100 text-purple-800', text: '🏛️ Government Schemes' },
      'technical-support': { color: 'bg-red-100 text-red-800', text: '🔧 Technical Support' },
      'billing-payment': { color: 'bg-orange-100 text-orange-800', text: '💳 Billing & Payment' },
      'account-issues': { color: 'bg-yellow-100 text-yellow-800', text: '👤 Account Issues' },
      'platform-feedback': { color: 'bg-indigo-100 text-indigo-800', text: '📝 Platform Feedback' },
      'general-inquiry': { color: 'bg-gray-100 text-gray-800', text: '❓ General Inquiry' },
      'financial': { color: 'bg-green-100 text-green-800', text: '💰 Financial' },
      'legal': { color: 'bg-red-100 text-red-800', text: '⚖️ Legal' },
      'technical': { color: 'bg-red-100 text-red-800', text: '🔧 Technical' },
      other: { color: 'bg-gray-100 text-gray-800', text: '❓ Other' }
    };
    
    const config = categoryConfig[category] || categoryConfig.other;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (issue.reporterName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
    setShowDetails(true);
  };

  const handleRespond = () => {
    if (!response.trim()) {
      alert('Please enter a response');
      return;
    }
    updateIssueStatus(selectedIssue.id, 'resolved', response);
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
                <AlertTriangle className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Issue Management</h1>
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
          <h2 className="text-3xl font-bold text-foreground">Issue Management</h2>
          <p className="text-muted-foreground mt-2">
            Monitor and resolve platform issues reported by farmers and landowners
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">{issues.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Issues</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {issues.filter(i => i.status === 'open').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {issues.filter(i => i.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {issues.filter(i => i.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search issues..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="all">All Categories</option>
                  <option value="land-registration">🏡 Land Registration</option>
                  <option value="farmer-rights">⚖️ Farmer Rights</option>
                  <option value="government-schemes">🏛️ Government Schemes</option>
                  <option value="technical-support">🔧 Technical Support</option>
                  <option value="billing-payment">💳 Billing & Payment</option>
                  <option value="account-issues">👤 Account Issues</option>
                  <option value="platform-feedback">📝 Platform Feedback</option>
                  <option value="general-inquiry">❓ General Inquiry</option>
                  <option value="financial">💰 Financial</option>
                  <option value="legal">⚖️ Legal</option>
                  <option value="technical">🔧 Technical</option>
                  <option value="other">❓ Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Issues ({filteredIssues.length})</CardTitle>
            <CardDescription>
              All issues reported by platform users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading issues...</p>
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No Issues Found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'No issues match your current filters.'
                    : 'No issues have been reported yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4 hover:bg-secondary/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        {/* Issue Header */}
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(issue.category)}
                          <h3 className="font-medium text-lg">{issue.title}</h3>
                          {getCategoryBadge(issue.category)}
                          {getPriorityBadge(issue.priority)}
                          {getStatusBadge(issue.status)}
                        </div>
                        
                        {/* Issue Description */}
                        <p className="text-muted-foreground leading-relaxed">
                          {issue.description.length > 150 
                            ? `${issue.description.substring(0, 150)}...` 
                            : issue.description}
                        </p>
                        
                        {/* Issue Details */}
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Reported by: {issue.reportedBy?.name || issue.reporterName || 'Anonymous'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {new Date(issue.reportedAt || issue.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Contact: {issue.reportedBy?.email || issue.reporterEmail || 'N/A'}</span>
                          </div>
                          
                          {issue.reportedBy?.phone && issue.reportedBy.phone !== 'Not provided' && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>Phone: {issue.reportedBy.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Admin Response (if any) */}
                        {issue.adminResponse && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                            <h4 className="font-medium text-green-800 text-sm mb-1">Admin Response:</h4>
                            <p className="text-green-700 text-sm">{issue.adminResponse}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(issue)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {issue.status === 'open' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        
                        {(issue.status === 'open' || issue.status === 'in_progress') && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleViewDetails(issue)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Issue Details Modal */}
      {showDetails && selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Issue Details</h3>
              <Button variant="outline" size="sm" onClick={() => setShowDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Title</h4>
                <p className="text-muted-foreground">{selectedIssue.title}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{selectedIssue.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  {getCategoryBadge(selectedIssue.category)}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Priority</h4>
                  {getPriorityBadge(selectedIssue.priority)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  {getStatusBadge(selectedIssue.status)}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Reported Date</h4>
                  <p className="text-muted-foreground">{new Date(selectedIssue.reportedAt || selectedIssue.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Reported By</h4>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p><strong>Name:</strong> {selectedIssue.reportedBy?.name || selectedIssue.reporterName || 'Anonymous'}</p>
                  <p><strong>Email:</strong> {selectedIssue.reportedBy?.email || selectedIssue.reporterEmail || 'N/A'}</p>
                  {selectedIssue.reportedBy?.phone && selectedIssue.reportedBy.phone !== 'Not provided' && (
                    <p><strong>Phone:</strong> {selectedIssue.reportedBy.phone}</p>
                  )}
                  {selectedIssue.reporterRole && (
                    <p><strong>Role:</strong> {selectedIssue.reporterRole}</p>
                  )}
                  {selectedIssue.type && (
                    <p><strong>Inquiry Type:</strong> {selectedIssue.type}</p>
                  )}
                </div>
              </div>
              
              {selectedIssue.adminResponse && (
                <div>
                  <h4 className="font-medium mb-2">Previous Response</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700">{selectedIssue.adminResponse}</p>
                  </div>
                </div>
              )}
              
              {(selectedIssue.status === 'open' || selectedIssue.status === 'in_progress') && (
                <div>
                  <h4 className="font-medium mb-2">Admin Response</h4>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your response to resolve this issue..."
                    rows={4}
                  />
                  <div className="flex space-x-3 mt-4">
                    <Button onClick={handleRespond} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve Issue
                    </Button>
                    <Button variant="outline" onClick={() => updateIssueStatus(selectedIssue.id, 'in_progress')}>
                      <Clock className="h-4 w-4 mr-2" />
                      Mark In Progress
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueManagement;