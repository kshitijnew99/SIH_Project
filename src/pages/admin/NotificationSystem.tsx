import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  Plus, 
  Send, 
  Users, 
  AlertTriangle,
  Info,
  CheckCircle,
  ArrowLeft,
  Sprout,
  MessageSquare,
  Target,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'general',
    targetUsers: 'all',
    priority: 'medium'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        console.log('Notifications fetched:', data.notifications?.length || 0);
      } else {
        console.error('Failed to fetch notifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5001/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNotification)
      });

      const data = await response.json();
      if (data.success) {
        alert('Notification created and sent successfully!');
        setNewNotification({
          title: '',
          message: '',
          type: 'general',
          targetUsers: 'all',
          priority: 'medium'
        });
        setShowCreateForm(false);
        fetchNotifications();
      } else {
        alert('Failed to create notification: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Error creating notification');
    }
  };

  const getTypeIcon = (type) => {
    const typeConfig = {
      general: { icon: Info, color: 'text-blue-600' },
      matching: { icon: Users, color: 'text-green-600' },
      contract: { icon: MessageSquare, color: 'text-purple-600' },
      issue: { icon: AlertTriangle, color: 'text-red-600' }
    };
    
    const config = typeConfig[type] || typeConfig.general;
    const IconComponent = config.icon;
    
    return <IconComponent className={`h-4 w-4 ${config.color}`} />;
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

  const getTypeBadge = (type) => {
    const typeConfig = {
      general: { color: 'bg-blue-100 text-blue-800', text: 'General' },
      matching: { color: 'bg-green-100 text-green-800', text: 'Matching' },
      contract: { color: 'bg-purple-100 text-purple-800', text: 'Contract' },
      issue: { color: 'bg-red-100 text-red-800', text: 'Issue Alert' }
    };
    
    const config = typeConfig[type] || typeConfig.general;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getTargetAudienceText = (targetUsers) => {
    if (targetUsers === 'all') return 'All Users';
    if (targetUsers === 'farmers') return 'Farmers Only';
    if (targetUsers === 'landowners') return 'Landowners Only';
    if (Array.isArray(targetUsers)) return `${targetUsers.length} Specific Users`;
    return 'Custom Audience';
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
                <Bell className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Notification System</h1>
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
              <h2 className="text-3xl font-bold text-foreground">Notification Management</h2>
              <p className="text-muted-foreground mt-2">
                Create and manage platform notifications for farmers, landowners, and administrators
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Notification
            </Button>
          </div>
        </div>

        {/* Create Notification Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create New Notification</span>
              </CardTitle>
              <CardDescription>
                Send targeted notifications to platform users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    placeholder="Enter notification title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="general">General</option>
                    <option value="matching">Farmer-Landowner Matching</option>
                    <option value="contract">Contract Related</option>
                    <option value="issue">Issue Alert</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message *</label>
                <Textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  placeholder="Enter your notification message"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <select
                    value={newNotification.targetUsers}
                    onChange={(e) => setNewNotification({...newNotification, targetUsers: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="all">All Users</option>
                    <option value="farmers">Farmers Only</option>
                    <option value="landowners">Landowners Only</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={createNotification} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
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
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {notifications.filter(n => n.status === 'active').length}
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
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {notifications.filter(n => {
                      const notificationDate = new Date(n.createdAt);
                      const now = new Date();
                      return notificationDate.getMonth() === now.getMonth() && 
                             notificationDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              All notifications sent to platform users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No Notifications Sent</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first notification to communicate with platform users.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4 hover:bg-secondary/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        {/* Notification Header */}
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(notification.type)}
                          <h3 className="font-medium text-lg">{notification.title}</h3>
                          {getTypeBadge(notification.type)}
                          {getPriorityBadge(notification.priority)}
                        </div>
                        
                        {/* Notification Message */}
                        <p className="text-muted-foreground leading-relaxed">
                          {notification.message}
                        </p>
                        
                        {/* Notification Details */}
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4" />
                            <span>Target: {getTargetAudienceText(notification.targetUsers)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Sent: {new Date(notification.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Read by: {notification.readBy?.length || 0} users</span>
                          </div>
                        </div>
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

export default NotificationSystem;