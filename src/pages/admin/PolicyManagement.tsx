import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Plus, 
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Sprout,
  Search,
  Filter,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Save,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    description: '',
    category: 'general',
    content: '',
    status: 'draft',
    applicableFrom: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/policies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setPolicies(data.policies || []);
        console.log('Policies fetched:', data.policies?.length || 0);
      } else {
        console.error('Failed to fetch policies:', data.message);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdatePolicy = async () => {
    if (!newPolicy.title || !newPolicy.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      const method = editingPolicy ? 'PUT' : 'POST';
      const url = editingPolicy 
        ? `http://localhost:5001/api/admin/policies/${editingPolicy.id}`
        : 'http://localhost:5001/api/admin/policies';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPolicy)
      });

      const data = await response.json();
      if (data.success) {
        alert(`Policy ${editingPolicy ? 'updated' : 'created'} successfully!`);
        setNewPolicy({
          title: '',
          description: '',
          category: 'general',
          content: '',
          status: 'draft',
          applicableFrom: '',
          expiryDate: ''
        });
        setShowCreateForm(false);
        setEditingPolicy(null);
        fetchPolicies();
      } else {
        alert(`Failed to ${editingPolicy ? 'update' : 'create'} policy: ` + data.message);
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Error saving policy');
    }
  };

  const deletePolicy = async (policyId) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) {
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/policies/${policyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Policy deleted successfully!');
        fetchPolicies();
      } else {
        alert('Failed to delete policy: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting policy:', error);
      alert('Error deleting policy');
    }
  };

  const togglePolicyStatus = async (policyId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/policies/${policyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        fetchPolicies();
      } else {
        alert('Failed to update policy status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating policy status:', error);
      alert('Error updating policy status');
    }
  };

  const getCategoryIcon = (category) => {
    const categoryConfig = {
      general: { icon: FileText, color: 'text-blue-600' },
      contract: { icon: Users, color: 'text-purple-600' },
      payment: { icon: Shield, color: 'text-green-600' },
      verification: { icon: CheckCircle, color: 'text-orange-600' },
      privacy: { icon: Shield, color: 'text-red-600' }
    };
    
    const config = categoryConfig[category] || categoryConfig.general;
    const IconComponent = config.icon;
    
    return <IconComponent className={`h-4 w-4 ${config.color}`} />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { color: 'bg-red-100 text-red-800', text: 'Inactive' },
      expired: { color: 'bg-orange-100 text-orange-800', text: 'Expired' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      general: { color: 'bg-blue-100 text-blue-800', text: 'General' },
      contract: { color: 'bg-purple-100 text-purple-800', text: 'Contract' },
      payment: { color: 'bg-green-100 text-green-800', text: 'Payment' },
      verification: { color: 'bg-orange-100 text-orange-800', text: 'Verification' },
      privacy: { color: 'bg-red-100 text-red-800', text: 'Privacy' }
    };
    
    const config = categoryConfig[category] || categoryConfig.general;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setNewPolicy({
      title: policy.title,
      description: policy.description,
      category: policy.category,
      content: policy.description || '',
      status: policy.status,
      applicableFrom: policy.applicableFrom?.split('T')[0] || '',
      expiryDate: policy.expiryDate?.split('T')[0] || ''
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setNewPolicy({
      title: '',
      description: '',
      category: 'general',
      content: '',
      status: 'draft',
      applicableFrom: '',
      expiryDate: ''
    });
    setEditingPolicy(null);
    setShowCreateForm(false);
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Policy Management</h1>
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
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Policy Management</h2>
              <p className="text-muted-foreground mt-2">
                Create and manage platform policies, terms of service, and compliance documents
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </div>
        </div>

        {/* Create/Edit Policy Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {editingPolicy ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                <span>{editingPolicy ? 'Edit Policy' : 'Create New Policy'}</span>
              </CardTitle>
              <CardDescription>
                {editingPolicy ? 'Update existing policy' : 'Create a new platform policy'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={newPolicy.title}
                    onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                    placeholder="Enter policy title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={newPolicy.category}
                    onChange={(e) => setNewPolicy({...newPolicy, category: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="general">General</option>
                    <option value="contract">Contract</option>
                    <option value="payment">Payment</option>
                    <option value="verification">Verification</option>
                    <option value="privacy">Privacy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  placeholder="Enter policy description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Policy Content *</label>
                <Textarea
                  value={newPolicy.content}
                  onChange={(e) => setNewPolicy({...newPolicy, content: e.target.value, description: e.target.value})}
                  placeholder="Enter detailed policy content"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={newPolicy.status}
                    onChange={(e) => setNewPolicy({...newPolicy, status: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Applicable From</label>
                  <Input
                    type="date"
                    value={newPolicy.applicableFrom}
                    onChange={(e) => setNewPolicy({...newPolicy, applicableFrom: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input
                    type="date"
                    value={newPolicy.expiryDate}
                    onChange={(e) => setNewPolicy({...newPolicy, expiryDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={createOrUpdatePolicy} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingPolicy ? 'Update Policy' : 'Create Policy'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold">{policies.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {policies.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {policies.filter(p => p.status === 'draft').length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {policies.filter(p => {
                      if (!p.expiryDate) return false;
                      const expiryDate = new Date(p.expiryDate);
                      const thirtyDaysFromNow = new Date();
                      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                      return expiryDate <= thirtyDaysFromNow;
                    }).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
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
                    placeholder="Search policies..."
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
                  <option value="general">General</option>
                  <option value="contract">Contract</option>
                  <option value="payment">Payment</option>
                  <option value="verification">Verification</option>
                  <option value="privacy">Privacy</option>
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
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
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

        {/* Policies List */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Policies ({filteredPolicies.length})</CardTitle>
            <CardDescription>
              All policies and terms governing the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading policies...</p>
              </div>
            ) : filteredPolicies.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No Policies Found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'No policies match your current filters.'
                    : 'Create your first policy to establish platform guidelines.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPolicies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4 hover:bg-secondary/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        {/* Policy Header */}
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(policy.category)}
                          <h3 className="font-medium text-lg">{policy.title}</h3>
                          {getCategoryBadge(policy.category)}
                          {getStatusBadge(policy.status)}
                        </div>
                        
                        {/* Policy Description */}
                        <p className="text-muted-foreground leading-relaxed">
                          {policy.description}
                        </p>
                        
                        {/* Policy Content Preview */}
                        <div className="bg-secondary/30 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground">
                            {(policy.description || '').length > 200 
                              ? `${(policy.description || '').substring(0, 200)}...` 
                              : policy.description || 'No description available'}
                          </p>
                        </div>
                        
                        {/* Policy Details */}
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {new Date(policy.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {policy.applicableFrom && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>Active from: {new Date(policy.applicableFrom).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {policy.expiryDate && (
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-4 w-4" />
                              <span>Expires: {new Date(policy.expiryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(policy)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePolicyStatus(policy.id, policy.status)}
                          className={policy.status === 'active' ? 'text-red-600' : 'text-green-600'}
                        >
                          {policy.status === 'active' ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePolicy(policy.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PolicyManagement;